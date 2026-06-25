from datetime import datetime, timedelta
import time
from types import SimpleNamespace
from unittest.mock import patch
from zoneinfo import ZoneInfo

from django.test import TestCase, override_settings
from django.utils import timezone
from rest_framework.test import APIClient

from .google_calendar import ConsultationSlot, available_slots, candidate_slots
from content.models import EducationItem

from .models import ConsultationBooking, EducationRegistration
from .stripe_views import StripeWebhookView


@override_settings(
    CONSULTATION_TIMEZONE="Europe/Sofia",
    CONSULTATION_SLOT_DAYS="1,2,3,4",
    CONSULTATION_SLOT_TIMES="13:00,14:30",
    CONSULTATION_DURATION_MINUTES="60",
    CONSULTATION_LOOKAHEAD_DAYS="30",
)
class CandidateSlotsTests(TestCase):
    def test_generates_only_configured_future_slots(self):
        now = datetime(2026, 6, 22, 13, 30, tzinfo=ZoneInfo("Europe/Sofia"))

        slots = candidate_slots(now)

        self.assertEqual(slots[0].start.isoformat(), "2026-06-22T14:30:00+03:00")
        self.assertTrue(all(slot.start.isoweekday() in {1, 2, 3, 4} for slot in slots))
        self.assertTrue(all(slot.start.strftime("%H:%M") in {"13:00", "14:30"} for slot in slots))

    @patch("interactions.google_calendar._busy_periods", return_value=[])
    @patch("interactions.google_calendar.candidate_slots")
    def test_paid_local_booking_does_not_block_slot_after_google_event_is_deleted(
        self,
        candidate_slots_mock,
        _,
    ):
        slot = ConsultationSlot(
            start=datetime(2026, 7, 6, 13, 0, tzinfo=ZoneInfo("Europe/Sofia")),
            end=datetime(2026, 7, 6, 14, 0, tzinfo=ZoneInfo("Europe/Sofia")),
        )
        candidate_slots_mock.return_value = [slot]
        ConsultationBooking.objects.create(
            language="bg",
            consultation_format="standard",
            meeting_type="zoom",
            selected_date=slot.start.date(),
            selected_time=slot.start.strftime("%H:%M"),
            name="Paid Client",
            phone="+359888123456",
            email="paid@example.com",
            total_amount_eur="150.00",
            status=ConsultationBooking.STATUS_PAID,
            google_event_id="deleted-google-event",
            payload={"slotStart": slot.start.isoformat()},
        )

        self.assertEqual(available_slots(), [slot])

    @patch("interactions.google_calendar._busy_periods", return_value=[])
    @patch("interactions.google_calendar.candidate_slots")
    def test_pending_stripe_checkout_blocks_slot(self, candidate_slots_mock, _):
        slot = ConsultationSlot(
            start=datetime(2026, 7, 6, 13, 0, tzinfo=ZoneInfo("Europe/Sofia")),
            end=datetime(2026, 7, 6, 14, 0, tzinfo=ZoneInfo("Europe/Sofia")),
        )
        candidate_slots_mock.return_value = [slot]
        ConsultationBooking.objects.create(
            language="bg",
            consultation_format="standard",
            meeting_type="zoom",
            selected_date=slot.start.date(),
            selected_time=slot.start.strftime("%H:%M"),
            name="Pending Client",
            phone="+359888123456",
            email="pending@example.com",
            total_amount_eur="150.00",
            stripe_session_id="cs_test_pending",
            checkout_expires_at=timezone.now() + timedelta(minutes=30),
            payload={"slotStart": slot.start.isoformat()},
        )

        self.assertEqual(available_slots(), [])


@override_settings(
    CONSULTATION_TIMEZONE="Europe/Sofia",
    CONSULTATION_SLOT_DAYS="1,2,3,4,5,6,7",
    CONSULTATION_SLOT_TIMES="13:00",
    CONSULTATION_DURATION_MINUTES="60",
    CONSULTATION_LOOKAHEAD_DAYS="30",
    STRIPE_SECRET_KEY="sk_test_example",
    STRIPE_CURRENCY="eur",
    STRIPE_PAYMENT_METHOD_TYPES="card",
    STRIPE_CHECKOUT_EXPIRES_MINUTES="30",
    STRIPE_CONSULTATION_STANDARD_PRICE_EUR="150.00",
    STRIPE_CONSULTATION_PRIORITY_PRICE_EUR="250.00",
)
class ConsultationApiTests(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.slot = candidate_slots()[0]
        self.payload = {
            "slotStart": self.slot.start.isoformat(),
            "name": "Client Name",
            "email": "client@example.com",
            "phone": "+359888123456",
            "message": "Question",
            "consultationFormat": "standard",
            "meetingType": "zoom",
            "language": "bg",
        }

    @patch("interactions.views.available_slots")
    def test_availability_returns_slots(self, available_slots_mock):
        available_slots_mock.return_value = [self.slot]

        response = self.client.get("/api/consultation/availability")

        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.data["slots"][0]["start"], self.slot.start.isoformat())

    @patch("interactions.stripe_views.stripe.checkout.Session.create")
    @patch("interactions.stripe_views.is_slot_free", return_value=True)
    def test_booking_creates_checkout_and_reserves_slot(self, _, create_session_mock):
        create_session_mock.return_value = SimpleNamespace(
            id="cs_test_consultation",
            url="https://checkout.stripe.com/test",
            expires_at=int(time.time()) + 1800,
        )

        response = self.client.post("/api/consultation/book", self.payload, format="json")

        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.data["url"], "https://checkout.stripe.com/test")
        booking = ConsultationBooking.objects.get()
        self.assertEqual(booking.status, ConsultationBooking.STATUS_NEW)
        self.assertEqual(booking.stripe_session_id, "cs_test_consultation")
        self.assertEqual(str(booking.total_amount_eur), "150.00")
        checkout_args = create_session_mock.call_args.kwargs
        self.assertIn("{CHECKOUT_SESSION_ID}", checkout_args["cancel_url"])

    @patch("interactions.stripe_views.is_slot_free", return_value=False)
    def test_booking_returns_conflict_when_slot_is_busy(self, _):
        response = self.client.post("/api/consultation/book", self.payload, format="json")

        self.assertEqual(response.status_code, 409)
        self.assertEqual(response.data["code"], "slot_unavailable")
        self.assertFalse(ConsultationBooking.objects.exists())

    def test_booking_rejects_slot_without_timezone(self):
        self.payload["slotStart"] = self.slot.start.replace(tzinfo=None).isoformat()

        response = self.client.post("/api/consultation/book", self.payload, format="json")

        self.assertEqual(response.status_code, 400)

    @patch("interactions.stripe_views.stripe.checkout.Session.create")
    @patch("interactions.stripe_views.is_slot_free", return_value=True)
    def test_deleted_paid_calendar_event_allows_new_checkout(self, _, create_session_mock):
        ConsultationBooking.objects.create(
            language="bg",
            consultation_format="standard",
            meeting_type="zoom",
            selected_date=self.slot.start.date(),
            selected_time=self.slot.start.strftime("%H:%M"),
            name="Previous Client",
            phone="+359888000000",
            email="previous@example.com",
            total_amount_eur="150.00",
            status=ConsultationBooking.STATUS_PAID,
            google_event_id="deleted-google-event",
            payload={"slotStart": self.slot.start.isoformat()},
        )
        create_session_mock.return_value = SimpleNamespace(
            id="cs_test_rebooked",
            url="https://checkout.stripe.com/rebooked",
            expires_at=int(time.time()) + 1800,
        )

        response = self.client.post("/api/consultation/book", self.payload, format="json")

        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.data["sessionId"], "cs_test_rebooked")

    @patch("interactions.stripe_views.create_event")
    def test_paid_webhook_creates_calendar_event(self, create_event_mock):
        booking = ConsultationBooking.objects.create(
            language="bg",
            consultation_format="standard",
            meeting_type="zoom",
            selected_date=self.slot.start.date(),
            selected_time=self.slot.start.strftime("%H:%M"),
            name="Client Name",
            phone="+359888123456",
            email="client@example.com",
            message="Question",
            total_amount_eur="150.00",
            stripe_session_id="cs_test_consultation",
            payload={"slotStart": self.slot.start.isoformat()},
        )
        create_event_mock.return_value = {
            "id": "google-event-id",
            "htmlLink": "https://calendar.google.com/event",
        }

        StripeWebhookView()._complete_consultation(
            {
                "id": "cs_test_consultation",
                "payment_intent": "pi_test",
                "amount_total": 15000,
                "currency": "eur",
            },
            {"booking_id": str(booking.id)},
        )

        booking.refresh_from_db()
        self.assertEqual(booking.status, ConsultationBooking.STATUS_PAID)
        self.assertEqual(booking.google_event_id, "google-event-id")
        self.assertEqual(booking.stripe_payment_intent, "pi_test")

    @patch("interactions.stripe_views.stripe.checkout.Session.expire")
    def test_cancelled_checkout_releases_slot(self, expire_session_mock):
        booking = ConsultationBooking.objects.create(
            language="bg",
            consultation_format="standard",
            meeting_type="zoom",
            selected_date=self.slot.start.date(),
            selected_time=self.slot.start.strftime("%H:%M"),
            name="Client Name",
            phone="+359888123456",
            email="client@example.com",
            total_amount_eur="150.00",
            stripe_session_id="cs_test_cancelled",
            payload={"slotStart": self.slot.start.isoformat()},
        )

        response = self.client.post(
            "/api/stripe/consultation-cancel/",
            {"sessionId": booking.stripe_session_id},
            format="json",
        )

        self.assertEqual(response.status_code, 204)
        booking.refresh_from_db()
        self.assertEqual(booking.status, ConsultationBooking.STATUS_CANCELLED)
        expire_session_mock.assert_called_once_with("cs_test_cancelled")


@override_settings(
    STRIPE_SECRET_KEY="sk_test_example",
    STRIPE_CURRENCY="eur",
    STRIPE_PAYMENT_METHOD_TYPES="card",
)
class EducationCheckoutTests(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.item = EducationItem.objects.create(
            item_type=EducationItem.TYPE_WEBINAR,
            slug="paid-webinar",
            title_ru="Вебинар",
            title_bg="Уебинар",
            description_ru="Описание",
            description_bg="Описание",
            start_date="2026-07-01",
            price="75 EUR",
            level=EducationItem.LEVEL_BEGINNER,
            goal=EducationItem.GOAL_TAXES,
            item_format=EducationItem.FORMAT_ONLINE,
        )

    @patch("interactions.stripe_views.stripe.checkout.Session.create")
    def test_course_or_webinar_checkout_uses_published_item_price(self, create_session_mock):
        create_session_mock.return_value = SimpleNamespace(
            id="cs_test_education",
            url="https://checkout.stripe.com/education",
        )

        response = self.client.post(
            "/api/stripe/create-checkout/",
            {
                "language": "bg",
                "name": "Client Name",
                "email": "client@example.com",
                "phone": "+359888123456",
                "itemSlug": self.item.slug,
            },
            format="json",
        )

        self.assertEqual(response.status_code, 200)
        line_item = create_session_mock.call_args.kwargs["line_items"][0]
        self.assertEqual(line_item["price_data"]["unit_amount"], 7500)

    def test_paid_education_webhook_creates_registration_once(self):
        session = {
            "id": "cs_test_education",
            "payment_intent": "pi_education",
            "amount_total": 7500,
            "currency": "eur",
        }
        metadata = {
            "purchase_type": "education",
            "language": "bg",
            "name": "Client Name",
            "email": "client@example.com",
            "phone": "+359888123456",
            "item_slug": self.item.slug,
            "item_title": self.item.title_bg,
            "item_type": self.item.item_type,
            "item_id": self.item.external_id,
        }

        view = StripeWebhookView()
        view._complete_education(session, metadata)
        view._complete_education(session, metadata)

        self.assertEqual(EducationRegistration.objects.count(), 1)
