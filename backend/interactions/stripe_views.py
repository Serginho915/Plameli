import logging
import re
import time
from datetime import datetime, timedelta, timezone as datetime_timezone
from decimal import Decimal, InvalidOperation, ROUND_HALF_UP
from zoneinfo import ZoneInfo

import stripe
from django.conf import settings
from django.db import IntegrityError, transaction
from django.http import HttpResponse
from django.utils import timezone
from django.utils.decorators import method_decorator
from django.views.decorators.csrf import csrf_exempt
from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView

from content.models import EducationItem

from .booking_cancellation import cancel_consultation_booking
from .google_calendar import (
	CalendarConfigurationError,
	CalendarUnavailableError,
	ConsultationSlot,
	create_event,
	is_slot_free,
)
from .models import ConsultationBooking, EducationRegistration
from .serializers import ConsultationBookingCreateSerializer, EducationRegistrationCreateSerializer


logger = logging.getLogger(__name__)

ZERO_DECIMAL_CURRENCIES = {
	"bif", "clp", "djf", "gnf", "jpy", "kmf", "krw", "mga", "pyg", "rwf",
	"ugx", "vnd", "vuv", "xaf", "xof", "xpf",
}


def _is_configured_secret(value: str) -> bool:
	return bool(value and "REPLACE_ME" not in value)


def _stripe_error_response(exc: Exception) -> Response:
	message = getattr(exc, "user_message", None) or "Payment could not be started."
	return Response(
		{"code": "payment_error", "detail": message},
		status=status.HTTP_400_BAD_REQUEST,
	)


def _payment_method_types() -> list[str]:
	return [
		value.strip()
		for value in settings.STRIPE_PAYMENT_METHOD_TYPES.split(",")
		if value.strip()
	] or ["card"]


def _checkout_expiration_timestamp() -> int:
	try:
		minutes = int(settings.STRIPE_CHECKOUT_EXPIRES_MINUTES)
	except (TypeError, ValueError):
		minutes = 30
	minutes = min(max(minutes, 30), 1440)
	return int(time.time()) + minutes * 60


def _amount_to_minor_units(amount: Decimal) -> int:
	currency = settings.STRIPE_CURRENCY.lower()
	factor = Decimal("1") if currency in ZERO_DECIMAL_CURRENCIES else Decimal("100")
	return int((amount * factor).quantize(Decimal("1"), rounding=ROUND_HALF_UP))


def _parse_price(price: str) -> Decimal:
	if not price:
		return Decimal("0")
	cleaned = re.sub(r"[^\d,.\-]", "", price.replace("\u00a0", "").replace(" ", ""))
	if not cleaned:
		return Decimal("0")
	if "," in cleaned and "." in cleaned:
		if cleaned.rfind(",") > cleaned.rfind("."):
			cleaned = cleaned.replace(".", "").replace(",", ".")
		else:
			cleaned = cleaned.replace(",", "")
	elif "," in cleaned:
		parts = cleaned.split(",")
		cleaned = "".join(parts[:-1]) + "." + parts[-1] if len(parts[-1]) <= 2 else "".join(parts)
	elif cleaned.count(".") > 1:
		parts = cleaned.split(".")
		cleaned = "".join(parts[:-1]) + "." + parts[-1] if len(parts[-1]) <= 2 else "".join(parts)
	try:
		return Decimal(cleaned)
	except InvalidOperation:
		return Decimal("0")


def _request_public_base_url(request) -> str:
	host = request.headers.get("X-Forwarded-Host") or request.get_host()
	host = host.split(",")[0].strip()
	hostname = host.split(":", 1)[0].lower().strip("[]")
	if hostname in {"localhost", "127.0.0.1", "::1", "backend", "testserver"}:
		return ""
	proto = request.headers.get("X-Forwarded-Proto") or request.scheme
	proto = proto.split(",")[0].strip() or "https"
	return f"{proto}://{host}".rstrip("/")


def _frontend_url(request, path: str, payment_result: str, include_session_id: bool = False) -> str:
	configured_base = settings.FRONTEND_URL.rstrip("/")
	request_base = _request_public_base_url(request)
	base = request_base or configured_base
	separator = "&" if "?" in path else "?"
	url = f"{base}{path}{separator}payment={payment_result}"
	if include_session_id:
		url += "&session_id={CHECKOUT_SESSION_ID}"
	return url


class StripeCreateCheckoutView(APIView):
	"""Create a Stripe Checkout Session for a published course or webinar."""

	def post(self, request):
		if not _is_configured_secret(settings.STRIPE_SECRET_KEY):
			return Response(
				{"code": "payment_not_configured", "detail": "Payment service is not configured."},
				status=status.HTTP_503_SERVICE_UNAVAILABLE,
			)

		serializer = EducationRegistrationCreateSerializer(data=request.data)
		serializer.is_valid(raise_exception=True)
		data = serializer.validated_data
		item_slug = data.get("itemSlug", "")
		item_id = data.get("itemId", "")
		item = None
		if item_slug:
			item = EducationItem.objects.filter(slug=item_slug, is_published=True).first()
		if item is None and item_id:
			item = EducationItem.objects.filter(external_id=item_id, is_published=True).first()
		if item is None:
			return Response(
				{"code": "education_item_not_found", "detail": "Education item not found."},
				status=status.HTTP_404_NOT_FOUND,
			)

		amount = _parse_price(item.price)
		amount_minor = _amount_to_minor_units(amount)
		if amount_minor <= 0:
			return Response(
				{"code": "invalid_price", "detail": "Education item price is invalid."},
				status=status.HTTP_400_BAD_REQUEST,
			)

		language = data.get("language", "bg")
		product_name = item.title_bg if language == "bg" else item.title_ru
		return_path = f"/{language}/education/{item.slug}"
		metadata = {
			"purchase_type": "education",
			"name": data["name"],
			"email": data["email"],
			"phone": data["phone"],
			"language": language,
			"item_slug": item.slug,
			"item_title": product_name,
			"item_type": item.item_type,
			"item_id": item.external_id,
		}

		stripe.api_key = settings.STRIPE_SECRET_KEY
		try:
			session = stripe.checkout.Session.create(
				payment_method_types=_payment_method_types(),
				line_items=[{
					"price_data": {
						"currency": settings.STRIPE_CURRENCY,
						"product_data": {"name": product_name},
						"unit_amount": amount_minor,
					},
					"quantity": 1,
				}],
				mode="payment",
				submit_type="pay",
				customer_email=data["email"],
				success_url=_frontend_url(request, return_path, "success"),
				cancel_url=_frontend_url(request, return_path, "cancelled"),
				metadata=metadata,
				payment_intent_data={"metadata": metadata},
			)
		except stripe.error.StripeError as exc:
			return _stripe_error_response(exc)

		return Response({"url": session.url, "sessionId": session.id})


class StripeConsultationCheckoutView(APIView):
	"""Reserve a consultation slot and create its Stripe Checkout Session."""

	def post(self, request):
		if not _is_configured_secret(settings.STRIPE_SECRET_KEY):
			return Response(
				{"code": "payment_not_configured", "detail": "Payment service is not configured."},
				status=status.HTTP_503_SERVICE_UNAVAILABLE,
			)

		serializer = ConsultationBookingCreateSerializer(data=request.data)
		serializer.is_valid(raise_exception=True)
		slot = serializer.validated_data["slot"]
		if not is_slot_free(slot):
			return Response(
				{"code": "slot_unavailable", "detail": "This consultation slot is no longer available."},
				status=status.HTTP_409_CONFLICT,
			)

		try:
			with transaction.atomic():
				booking = serializer.save()
		except IntegrityError:
			return Response(
				{"code": "slot_unavailable", "detail": "This consultation slot is no longer available."},
				status=status.HTTP_409_CONFLICT,
			)

		language = booking.language
		product_names = {
			"bg": "Индивидуална консултация",
			"ru": "Индивидуальная консультация",
			"en": "Individual consultation",
		}
		format_names = {
			"standard": {"bg": "Стандарт", "ru": "Стандарт", "en": "Standard"},
			"priority": {"bg": "Приоритет", "ru": "Приоритет", "en": "Priority"},
		}
		product_name = f"{product_names.get(language, product_names['bg'])} — {format_names[booking.consultation_format].get(language, format_names[booking.consultation_format]['bg'])}"
		metadata = {
			"purchase_type": "consultation",
			"booking_id": str(booking.id),
			"language": language,
		}
		return_path = f"/{language}/consultation"

		stripe.api_key = settings.STRIPE_SECRET_KEY
		try:
			session = stripe.checkout.Session.create(
				payment_method_types=_payment_method_types(),
				line_items=[{
					"price_data": {
						"currency": settings.STRIPE_CURRENCY,
						"product_data": {"name": product_name},
						"unit_amount": _amount_to_minor_units(booking.total_amount_eur),
					},
					"quantity": 1,
				}],
				mode="payment",
				submit_type="book",
				customer_email=booking.email,
				client_reference_id=f"consultation:{booking.id}",
				success_url=_frontend_url(request, return_path, "success", include_session_id=True),
				cancel_url=_frontend_url(request, return_path, "cancelled", include_session_id=True),
				expires_at=_checkout_expiration_timestamp(),
				metadata=metadata,
				payment_intent_data={"metadata": metadata},
			)
		except stripe.error.StripeError as exc:
			cancel_consultation_booking(booking)
			return _stripe_error_response(exc)

		booking.stripe_session_id = session.id
		booking.checkout_expires_at = datetime.fromtimestamp(session.expires_at, tz=datetime_timezone.utc)
		booking.payload = {**booking.payload, "stripe_session_id": session.id}
		booking.save(update_fields=[
			"stripe_session_id",
			"checkout_expires_at",
			"payload",
			"updated_at",
		])
		return Response({"url": session.url, "sessionId": session.id})


class StripeConsultationCancelView(APIView):
	"""Release a pending consultation reservation when Checkout is cancelled."""

	def post(self, request):
		session_id = str(request.data.get("sessionId", "")).strip()
		if not session_id:
			return Response(
				{"code": "session_id_required", "detail": "sessionId is required."},
				status=status.HTTP_400_BAD_REQUEST,
			)
		booking = ConsultationBooking.objects.filter(
			stripe_session_id=session_id,
			status=ConsultationBooking.STATUS_NEW,
		).first()
		if booking is None:
			return Response(status=status.HTTP_204_NO_CONTENT)

		cancel_consultation_booking(booking)
		if _is_configured_secret(settings.STRIPE_SECRET_KEY):
			stripe.api_key = settings.STRIPE_SECRET_KEY
			try:
				stripe.checkout.Session.expire(session_id)
			except stripe.error.StripeError:
				pass
		return Response(status=status.HTTP_204_NO_CONTENT)


class StripeConsultationConfirmView(APIView):
	"""Confirm a paid Checkout Session and create the calendar event if needed."""

	def post(self, request):
		session_id = str(request.data.get("sessionId", "")).strip()
		if not session_id:
			return Response(
				{"code": "session_id_required", "detail": "sessionId is required."},
				status=status.HTTP_400_BAD_REQUEST,
			)
		if not _is_configured_secret(settings.STRIPE_SECRET_KEY):
			return Response(
				{"code": "payment_not_configured", "detail": "Payment service is not configured."},
				status=status.HTTP_503_SERVICE_UNAVAILABLE,
			)

		stripe.api_key = settings.STRIPE_SECRET_KEY
		try:
			session = stripe.checkout.Session.retrieve(session_id)
		except stripe.error.StripeError as exc:
			return _stripe_error_response(exc)

		if session.get("payment_status") != "paid":
			return Response(
				{"code": "payment_not_completed", "detail": "Checkout Session is not paid yet."},
				status=status.HTTP_409_CONFLICT,
			)
		metadata = session.get("metadata") or {}
		if metadata.get("purchase_type") != "consultation":
			return Response(
				{"code": "invalid_session", "detail": "Checkout Session is not for a consultation."},
				status=status.HTTP_400_BAD_REQUEST,
			)

		try:
			StripeWebhookView()._complete_consultation(session, metadata)
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
		except (KeyError, TypeError, ValueError) as exc:
			logger.exception("Paid consultation confirmation failed because booking data is invalid.")
			return Response(
				{"code": "booking_invalid", "detail": "Consultation booking data is incomplete."},
				status=status.HTTP_422_UNPROCESSABLE_ENTITY,
			)
		except Exception:
			logger.exception("Paid consultation confirmation failed unexpectedly.")
			return Response(
				{"code": "confirmation_failed", "detail": "Paid consultation could not be confirmed."},
				status=status.HTTP_503_SERVICE_UNAVAILABLE,
			)

		booking = ConsultationBooking.objects.filter(stripe_session_id=session_id).first()
		if booking is None:
			return Response(
				{"code": "booking_not_found", "detail": "Consultation booking was not found."},
				status=status.HTTP_404_NOT_FOUND,
			)
		return Response(
			{
				"status": booking.status,
				"eventId": booking.google_event_id,
				"eventUrl": booking.google_event_url,
			}
		)


@method_decorator(csrf_exempt, name="dispatch")
class StripeWebhookView(APIView):
	authentication_classes = []
	permission_classes = []

	def post(self, request):
		if (
			not _is_configured_secret(settings.STRIPE_SECRET_KEY)
			or not _is_configured_secret(settings.STRIPE_WEBHOOK_SECRET)
		):
			return HttpResponse(status=503)

		stripe.api_key = settings.STRIPE_SECRET_KEY
		try:
			event = stripe.Webhook.construct_event(
				request.body,
				request.META.get("HTTP_STRIPE_SIGNATURE", ""),
				settings.STRIPE_WEBHOOK_SECRET,
			)
		except (ValueError, stripe.error.SignatureVerificationError):
			return HttpResponse(status=400)

		event_type = event["type"]
		session = event["data"]["object"]
		if event_type in {"checkout.session.completed", "checkout.session.async_payment_succeeded"}:
			if session.get("payment_status") == "paid":
				self._handle_paid_session(session)
		elif event_type in {"checkout.session.expired", "checkout.session.async_payment_failed"}:
			self._handle_failed_session(session)

		return HttpResponse(status=200)

	def _handle_paid_session(self, session: dict) -> None:
		metadata = session.get("metadata") or {}
		if metadata.get("purchase_type") == "consultation":
			self._complete_consultation(session, metadata)
		elif metadata.get("purchase_type") == "education":
			self._complete_education(session, metadata)

	def _complete_education(self, session: dict, metadata: dict) -> None:
		session_id = session.get("id", "")
		if not session_id or EducationRegistration.objects.filter(stripe_session_id=session_id).exists():
			return
		item_slug = metadata.get("item_slug", "")
		education_item = EducationItem.objects.filter(slug=item_slug).first() if item_slug else None
		try:
			EducationRegistration.objects.create(
				language=metadata.get("language", "bg"),
				education_item=education_item,
				item_external_id=metadata.get("item_id", ""),
				item_slug=item_slug,
				item_title=metadata.get("item_title", ""),
				item_type=metadata.get("item_type", ""),
				name=metadata.get("name", ""),
				email=metadata.get("email", ""),
				phone=metadata.get("phone", ""),
				stripe_session_id=session_id,
				payload={
					"source": "stripe_checkout",
					"stripe_session_id": session_id,
					"payment_intent": session.get("payment_intent", ""),
					"amount_total": session.get("amount_total"),
					"currency": session.get("currency", settings.STRIPE_CURRENCY),
				},
			)
		except IntegrityError:
			return

	def _complete_consultation(self, session: dict, metadata: dict) -> None:
		booking_id = metadata.get("booking_id")
		session_id = session.get("id", "")
		if not booking_id and not session_id:
			return
		with transaction.atomic():
			bookings = ConsultationBooking.objects.select_for_update()
			if booking_id:
				booking = bookings.filter(id=booking_id).first()
				if booking is None and session_id:
					booking = bookings.filter(stripe_session_id=session_id).first()
			else:
				booking = bookings.filter(stripe_session_id=session_id).first()
			if booking is None or booking.status == ConsultationBooking.STATUS_CANCELLED:
				return
			if booking.status == ConsultationBooking.STATUS_PAID and booking.google_event_id:
				return

			slot_start_raw = (booking.payload or {}).get("slotStart")
			if slot_start_raw:
				slot_start = datetime.fromisoformat(slot_start_raw.replace("Z", "+00:00"))
			else:
				slot_start = datetime.combine(
					booking.selected_date,
					datetime.strptime(booking.selected_time, "%H:%M").time(),
					ZoneInfo(settings.CONSULTATION_TIMEZONE),
				)
			local_start = slot_start.astimezone(ZoneInfo(settings.CONSULTATION_TIMEZONE))
			slot = ConsultationSlot(
				start=local_start,
				end=local_start + timedelta(minutes=int(settings.CONSULTATION_DURATION_MINUTES)),
			)
			event = create_event(slot, {
				"language": booking.language,
				"name": booking.name,
				"email": booking.email,
				"phone": booking.phone,
				"consultationFormat": booking.consultation_format,
				"meetingType": booking.meeting_type,
				"message": booking.message,
			})
			booking.status = ConsultationBooking.STATUS_PAID
			booking.stripe_payment_intent = session.get("payment_intent", "") or ""
			booking.google_event_id = event.get("id", "")
			booking.google_event_url = event.get("htmlLink", "")
			booking.payload = {
				**booking.payload,
				"source": "stripe_checkout",
				"stripe_session_id": session.get("id", ""),
				"payment_intent": booking.stripe_payment_intent,
				"amount_total": session.get("amount_total"),
				"currency": session.get("currency", settings.STRIPE_CURRENCY),
				"google_event_id": booking.google_event_id,
			}
			booking.save(update_fields=[
				"status",
				"stripe_payment_intent",
				"google_event_id",
				"google_event_url",
				"payload",
				"updated_at",
			])

	def _handle_failed_session(self, session: dict) -> None:
		metadata = session.get("metadata") or {}
		if metadata.get("purchase_type") != "consultation":
			return
		booking = ConsultationBooking.objects.filter(
			id=metadata.get("booking_id"),
			status=ConsultationBooking.STATUS_NEW,
		).first()
		if booking is not None:
			cancel_consultation_booking(booking)
