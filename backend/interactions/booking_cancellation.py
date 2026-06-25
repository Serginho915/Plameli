from .google_calendar import delete_event
from .models import ConsultationBooking


def cancel_consultation_booking(booking: ConsultationBooking) -> ConsultationBooking:
    if booking.google_event_id:
        delete_event(booking.google_event_id)
        booking.google_event_id = ""
        booking.google_event_url = ""
        booking.payload = {
            **(booking.payload or {}),
            "google_event_id": "",
            "google_event_deleted": True,
        }

    booking.status = ConsultationBooking.STATUS_CANCELLED
    booking.save(update_fields=[
        "status",
        "google_event_id",
        "google_event_url",
        "payload",
        "updated_at",
    ])
    return booking
