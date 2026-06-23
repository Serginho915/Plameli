from django.db import IntegrityError, transaction
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

# Create your views here.
