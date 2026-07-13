from django.db import IntegrityError, transaction
from django.utils import timezone
from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView

from .google_calendar import (
	CalendarConfigurationError,
	CalendarUnavailableError,
	available_slots,
	create_event,
	is_slot_free,
)
from .serializers import (
	ConsultationBookingCreateSerializer,
	EducationRegistrationCreateSerializer,
	FeedbackRequestCreateSerializer,
)
from .openrouter_chat import (
	OpenRouterConfigurationError,
	OpenRouterRequestError,
	ask_openrouter,
)
from .models import ChatConversation, ChatMessage


def _client_ip(request):
	forwarded_for = request.META.get("HTTP_X_FORWARDED_FOR", "")
	if forwarded_for:
		return forwarded_for.split(",", 1)[0].strip()[:64]
	return request.META.get("REMOTE_ADDR", "")[:64]


def _clean_chat_messages(messages):
	cleaned = []
	for message in messages:
		if not isinstance(message, dict):
			continue

		role = message.get("role")
		content = str(message.get("content", "")).strip()
		if role not in {"user", "assistant"} or not content:
			continue

		cleaned.append({"role": role, "content": content})

	return cleaned


def _conversation_title(messages):
	for message in messages:
		if message["role"] == ChatMessage.ROLE_USER:
			content = " ".join(message["content"].split())
			return content[:120]
	return ""


def _last_user_message(messages):
	for message in reversed(messages):
		if message["role"] == ChatMessage.ROLE_USER:
			return message["content"]
	return ""


def _get_or_create_chat_conversation(request, messages):
	session_id = request.data.get("sessionId")
	conversation = None

	if session_id:
		conversation = ChatConversation.objects.filter(session_id=session_id).first()

	if conversation:
		return conversation, False

	return (
		ChatConversation.objects.create(
			language=str(request.data.get("language") or "").strip()[:8] or "bg",
			title=_conversation_title(messages),
			user_agent=request.META.get("HTTP_USER_AGENT", ""),
			ip_address=_client_ip(request),
		),
		True,
	)


def _messages_for_openrouter(conversation, messages):
	if not conversation:
		return messages

	stored_messages = list(
		conversation.messages.values("role", "content").order_by("created_at", "id")
	)
	return [*stored_messages, *messages[-1:]]


def _append_chat_messages(conversation, messages, answer, is_new_conversation):
	now = timezone.now()
	to_store = messages if is_new_conversation else messages[-1:]
	created_messages = [
		ChatMessage(
			conversation=conversation,
			role=message["role"],
			content=message["content"],
		)
		for message in to_store
	]
	created_messages.append(
		ChatMessage(
			conversation=conversation,
			role=ChatMessage.ROLE_ASSISTANT,
			content=answer,
		)
	)

	ChatMessage.objects.bulk_create(created_messages)

	if not conversation.title:
		conversation.title = _conversation_title(messages)
	conversation.language = str(conversation.language or "bg")[:8]
	conversation.last_user_message = _last_user_message(messages)
	conversation.last_message_at = now
	conversation.message_count = ChatMessage.objects.filter(conversation=conversation).count()
	conversation.save(
		update_fields=[
			"title",
			"language",
			"last_user_message",
			"last_message_at",
			"message_count",
			"updated_at",
		]
	)


class FeedbackRequestCreateAPIView(APIView):
	def post(self, request):
		serializer = FeedbackRequestCreateSerializer(data=request.data)
		serializer.is_valid(raise_exception=True)
		instance = serializer.save()
		return Response({"id": instance.id, "status": "created"}, status=status.HTTP_201_CREATED)


class EducationRegistrationCreateAPIView(APIView):
	def post(self, request):
		serializer = EducationRegistrationCreateSerializer(data=request.data)
		serializer.is_valid(raise_exception=True)
		instance = serializer.save()
		return Response({"id": instance.id, "status": "created"}, status=status.HTTP_201_CREATED)


class ConsultationBookingCreateAPIView(APIView):
	def post(self, request):
		serializer = ConsultationBookingCreateSerializer(data=request.data)
		serializer.is_valid(raise_exception=True)
		slot = serializer.validated_data["slot"]
		try:
			if not is_slot_free(slot):
				return Response(
					{"code": "slot_unavailable", "detail": "This consultation slot is no longer available."},
					status=status.HTTP_409_CONFLICT,
				)
			try:
				with transaction.atomic():
					instance = serializer.save()
			except IntegrityError:
				return Response(
					{"code": "slot_unavailable", "detail": "This consultation slot is no longer available."},
					status=status.HTTP_409_CONFLICT,
				)

			try:
				event = create_event(slot, request.data)
			except Exception:
				instance.delete()
				raise

			instance.google_event_id = event.get("id", "")
			instance.google_event_url = event.get("htmlLink", "")
			instance.payload = {**instance.payload, "google_event_id": instance.google_event_id}
			instance.save(update_fields=["google_event_id", "google_event_url", "payload", "updated_at"])
		except CalendarConfigurationError as exc:
			return Response(
				{"code": "calendar_not_configured", "detail": str(exc)},
				status=status.HTTP_503_SERVICE_UNAVAILABLE,
			)
		except CalendarUnavailableError as exc:
			return Response(
				{"code": "calendar_unavailable", "detail": str(exc)},
				status=status.HTTP_503_SERVICE_UNAVAILABLE,
			)

		return Response(
			{
				"id": instance.id,
				"status": "created",
				"eventId": instance.google_event_id,
			},
			status=status.HTTP_201_CREATED,
		)


class AvailableSlotsAPIView(APIView):
	def get(self, request):
		try:
			slots = available_slots()
		except CalendarConfigurationError as exc:
			return Response(
				{"code": "calendar_not_configured", "detail": str(exc)},
				status=status.HTTP_503_SERVICE_UNAVAILABLE,
			)
		except CalendarUnavailableError as exc:
			return Response(
				{"code": "calendar_unavailable", "detail": str(exc)},
				status=status.HTTP_503_SERVICE_UNAVAILABLE,
			)
		return Response({"slots": [slot.as_dict() for slot in slots]})


class HelpChatAPIView(APIView):
	def post(self, request):
		messages = request.data.get("messages")
		if not isinstance(messages, list):
			return Response(
				{"code": "invalid_messages", "detail": "Messages must be a list."},
				status=status.HTTP_400_BAD_REQUEST,
			)
		clean_messages = _clean_chat_messages(messages)
		if not clean_messages:
			return Response(
				{"code": "invalid_messages", "detail": "Messages must include at least one valid item."},
				status=status.HTTP_400_BAD_REQUEST,
			)
		session_id = request.data.get("sessionId")
		existing_conversation = (
			ChatConversation.objects.prefetch_related("messages").filter(session_id=session_id).first()
			if session_id
			else None
		)
		try:
			answer = ask_openrouter(_messages_for_openrouter(existing_conversation, clean_messages))
		except OpenRouterConfigurationError as exc:
			return Response(
				{"code": "openrouter_not_configured", "detail": str(exc)},
				status=status.HTTP_503_SERVICE_UNAVAILABLE,
			)
		except OpenRouterRequestError:
			return Response(
				{
					"code": "openrouter_unavailable",
					"detail": "The assistant is temporarily unavailable.",
				},
				status=status.HTTP_503_SERVICE_UNAVAILABLE,
			)

		if existing_conversation:
			conversation = existing_conversation
			is_new_conversation = False
		else:
			conversation, is_new_conversation = _get_or_create_chat_conversation(request, clean_messages)
		_append_chat_messages(conversation, clean_messages, answer, is_new_conversation)

		return Response({"answer": answer, "sessionId": str(conversation.session_id)})

# Create your views here.
