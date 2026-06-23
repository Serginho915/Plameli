from datetime import datetime
from unittest.mock import patch
from zoneinfo import ZoneInfo

from django.test import TestCase, override_settings
from rest_framework.test import APIClient

from .google_calendar import ConsultationSlot, candidate_slots
from .models import ConsultationBooking


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


@override_settings(
    CONSULTATION_TIMEZONE="Europe/Sofia",
    CONSULTATION_SLOT_DAYS="1,2,3,4,5,6,7",
    CONSULTATION_SLOT_TIMES="13:00",
    CONSULTATION_DURATION_MINUTES="60",
    CONSULTATION_LOOKAHEAD_DAYS="30",
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

    @patch("interactions.views.create_event")
    @patch("interactions.views.is_slot_free", return_value=True)
    def test_booking_creates_calendar_event_and_local_record(self, _, create_event_mock):
        create_event_mock.return_value = {"id": "google-event-id", "htmlLink": "https://calendar.google.com/event"}

        response = self.client.post("/api/consultation/book", self.payload, format="json")

        self.assertEqual(response.status_code, 201)
        self.assertEqual(response.data["eventId"], "google-event-id")
        booking = ConsultationBooking.objects.get()
        self.assertEqual(booking.google_event_id, "google-event-id")
        create_event_mock.assert_called_once()

    @patch("interactions.views.is_slot_free", return_value=False)
    def test_booking_returns_conflict_when_slot_is_busy(self, _):
        response = self.client.post("/api/consultation/book", self.payload, format="json")

        self.assertEqual(response.status_code, 409)
        self.assertEqual(response.data["code"], "slot_unavailable")
        self.assertFalse(ConsultationBooking.objects.exists())

    def test_booking_rejects_slot_without_timezone(self):
        self.payload["slotStart"] = self.slot.start.replace(tzinfo=None).isoformat()

        response = self.client.post("/api/consultation/book", self.payload, format="json")

        self.assertEqual(response.status_code, 400)
