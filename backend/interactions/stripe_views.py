import re

import stripe
from django.conf import settings
from django.http import HttpResponse
from django.utils.decorators import method_decorator
from django.views.decorators.csrf import csrf_exempt
from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView

from content.models import EducationItem

from .models import EducationRegistration


def _parse_price_to_cents(price_str: str) -> int:
	"""Extract the first numeric value from a price string and convert to cents.

	Handles formats like "150", "150 EUR", "150.00", "1 500", "1.500,00".
	"""
	if not price_str:
		return 0
	# Remove non-breaking spaces and regular spaces used as thousands separators
	cleaned = price_str.replace("\u00a0", "").replace(" ", "")
	match = re.search(r"\d+(?:[.,]\d+)?", cleaned)
	if not match:
		return 0
	try:
		return int(float(match.group(0).replace(",", ".")) * 100)
	except (ValueError, TypeError):
		return 0


class StripeCreateCheckoutView(APIView):
	"""Create a Stripe Checkout Session for an education registration.

	Expected POST body:
	  language, name, email, phone, itemSlug, itemTitle, itemType, itemId
	Returns:
	  { "url": "https://checkout.stripe.com/..." }
	"""

	def post(self, request):
		if not settings.STRIPE_SECRET_KEY:
			return Response(
				{"detail": "Payment service not configured."},
				status=status.HTTP_503_SERVICE_UNAVAILABLE,
			)

		stripe.api_key = settings.STRIPE_SECRET_KEY
		data = request.data

		language = str(data.get("language", "ru")).strip()
		name = str(data.get("name", "")).strip()
		email = str(data.get("email", "")).strip()
		phone = str(data.get("phone", "")).strip()
		item_slug = str(data.get("itemSlug", "")).strip()
		item_id = str(data.get("itemId", "")).strip()

		# Resolve education item
		item = None
		if item_slug:
			item = EducationItem.objects.filter(slug=item_slug, is_published=True).first()
		if item is None and item_id:
			item = EducationItem.objects.filter(external_id=item_id, is_published=True).first()

		if item is None:
			return Response(
				{"detail": "Education item not found."},
				status=status.HTTP_404_NOT_FOUND,
			)

		amount_cents = _parse_price_to_cents(item.price)
		if amount_cents <= 0:
			return Response(
				{"detail": "Invalid item price."},
				status=status.HTTP_400_BAD_REQUEST,
			)

		product_name = item.title_bg if language == "bg" else item.title_ru
		frontend_url = settings.FRONTEND_URL.rstrip("/")
		success_url = f"{frontend_url}/{language}/education/{item.slug}?payment=success"
		cancel_url = f"{frontend_url}/{language}/education/{item.slug}?payment=cancelled"

		try:
			session = stripe.checkout.Session.create(
				payment_method_types=["card"],
				line_items=[
					{
						"price_data": {
							"currency": "eur",
							"product_data": {"name": product_name},
							"unit_amount": amount_cents,
						},
						"quantity": 1,
					}
				],
				mode="payment",
				customer_email=email or None,
				success_url=success_url,
				cancel_url=cancel_url,
				metadata={
					"name": name,
					"email": email,
					"phone": phone,
					"language": language,
					"item_slug": item.slug,
					"item_title": product_name,
					"item_type": item.item_type,
					"item_id": item.external_id,
				},
			)
		except stripe.error.StripeError as exc:
			return Response({"detail": str(exc)}, status=status.HTTP_400_BAD_REQUEST)

		return Response({"url": session.url})


@method_decorator(csrf_exempt, name="dispatch")
class StripeWebhookView(APIView):
	"""Receive Stripe webhook events.

	On checkout.session.completed: create an EducationRegistration.
	The stripe_session_id field is used to guarantee idempotency.
	"""

	authentication_classes = []
	permission_classes = []

	def post(self, request):
		if not settings.STRIPE_SECRET_KEY:
			return HttpResponse(status=503)

		stripe.api_key = settings.STRIPE_SECRET_KEY
		webhook_secret = settings.STRIPE_WEBHOOK_SECRET

		payload = request.body
		sig_header = request.META.get("HTTP_STRIPE_SIGNATURE", "")

		try:
			event = stripe.Webhook.construct_event(payload, sig_header, webhook_secret)
		except ValueError:
			return HttpResponse(status=400)
		except stripe.error.SignatureVerificationError:
			return HttpResponse(status=400)

		if event["type"] == "checkout.session.completed":
			session = event["data"]["object"]
			self._handle_checkout_complete(session)

		return HttpResponse(status=200)

	def _handle_checkout_complete(self, session: dict) -> None:
		session_id = session.get("id", "")
		if not session_id:
			return

		# Idempotency guard — skip duplicate webhook deliveries
		if EducationRegistration.objects.filter(stripe_session_id=session_id).exists():
			return

		metadata = session.get("metadata") or {}
		name = metadata.get("name", "")
		email = metadata.get("email", "")
		phone = metadata.get("phone", "")
		language = metadata.get("language", "ru")
		item_slug = metadata.get("item_slug", "")
		item_title = metadata.get("item_title", "")
		item_type = metadata.get("item_type", "")
		item_id = metadata.get("item_id", "")

		education_item = None
		if item_slug:
			education_item = EducationItem.objects.filter(slug=item_slug).first()

		EducationRegistration.objects.create(
			language=language,
			education_item=education_item,
			item_external_id=item_id,
			item_slug=item_slug,
			item_title=item_title,
			item_type=item_type,
			name=name,
			email=email,
			phone=phone,
			stripe_session_id=session_id,
			payload={
				"source": "stripe_checkout",
				"stripe_session_id": session_id,
				"payment_intent": session.get("payment_intent", ""),
				"amount_total": session.get("amount_total"),
				"currency": session.get("currency", "eur"),
			},
		)
