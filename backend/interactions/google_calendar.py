from dataclasses import dataclass
from datetime import datetime, time, timedelta
from zoneinfo import ZoneInfo, ZoneInfoNotFoundError

from django.conf import settings
from google.auth.exceptions import GoogleAuthError
from google.oauth2.credentials import Credentials
from googleapiclient.discovery import build
from googleapiclient.errors import HttpError


class CalendarConfigurationError(Exception):
    pass


class CalendarUnavailableError(Exception):
    pass


@dataclass(frozen=True)
class ConsultationSlot:
    start: datetime
    end: datetime

    def as_dict(self) -> dict[str, str]:
        return {
            "date": self.start.date().isoformat(),
            "time": self.start.strftime("%H:%M"),
            "start": self.start.isoformat(),
            "end": self.end.isoformat(),
        }


def _timezone() -> ZoneInfo:
    try:
        return ZoneInfo(settings.CONSULTATION_TIMEZONE)
    except ZoneInfoNotFoundError as exc:
        raise CalendarConfigurationError("CONSULTATION_TIMEZONE is invalid.") from exc


def _slot_days() -> set[int]:
    try:
        days = {int(value.strip()) for value in settings.CONSULTATION_SLOT_DAYS.split(",") if value.strip()}
    except ValueError as exc:
        raise CalendarConfigurationError("CONSULTATION_SLOT_DAYS must contain ISO weekday numbers.") from exc
    if not days or any(day < 1 or day > 7 for day in days):
        raise CalendarConfigurationError("CONSULTATION_SLOT_DAYS must contain numbers from 1 to 7.")
    return days


def _slot_times() -> list[time]:
    values = []
    try:
        for raw_value in settings.CONSULTATION_SLOT_TIMES.split(","):
            if raw_value.strip():
                values.append(time.fromisoformat(raw_value.strip()))
    except ValueError as exc:
        raise CalendarConfigurationError("CONSULTATION_SLOT_TIMES must use HH:MM format.") from exc
    if not values:
        raise CalendarConfigurationError("CONSULTATION_SLOT_TIMES cannot be empty.")
    return values


def _positive_int_setting(name: str) -> int:
    try:
        value = int(getattr(settings, name))
    except (TypeError, ValueError) as exc:
        raise CalendarConfigurationError(f"{name} must be a positive integer.") from exc
    if value <= 0:
        raise CalendarConfigurationError(f"{name} must be a positive integer.")
    return value


def _service():
    required = {
        "GOOGLE_CALENDAR_ID": settings.GOOGLE_CALENDAR_ID,
        "GOOGLE_CLIENT_ID": settings.GOOGLE_CLIENT_ID,
        "GOOGLE_CLIENT_SECRET": settings.GOOGLE_CLIENT_SECRET,
        "GOOGLE_REFRESH_TOKEN": settings.GOOGLE_REFRESH_TOKEN,
    }
    missing = [name for name, value in required.items() if not value]
    if missing:
        raise CalendarConfigurationError(f"Missing calendar configuration: {', '.join(missing)}.")

    credentials = Credentials(
        token=None,
        refresh_token=settings.GOOGLE_REFRESH_TOKEN,
        token_uri="https://oauth2.googleapis.com/token",
        client_id=settings.GOOGLE_CLIENT_ID,
        client_secret=settings.GOOGLE_CLIENT_SECRET,
        scopes=["https://www.googleapis.com/auth/calendar"],
    )
    return build("calendar", "v3", credentials=credentials, cache_discovery=False)


def candidate_slots(now: datetime | None = None) -> list[ConsultationSlot]:
    timezone = _timezone()
    current = now.astimezone(timezone) if now else datetime.now(timezone)
    duration = timedelta(minutes=_positive_int_setting("CONSULTATION_DURATION_MINUTES"))
    lookahead_days = _positive_int_setting("CONSULTATION_LOOKAHEAD_DAYS")
    slots = []

    for offset in range(lookahead_days + 1):
        slot_date = current.date() + timedelta(days=offset)
        if slot_date.isoweekday() not in _slot_days():
            continue
        for slot_time in _slot_times():
            start = datetime.combine(slot_date, slot_time, timezone)
            if start <= current:
                continue
            slots.append(ConsultationSlot(start=start, end=start + duration))

    return slots


def _parse_google_datetime(value: str) -> datetime:
    return datetime.fromisoformat(value.replace("Z", "+00:00"))


def _busy_periods(start: datetime, end: datetime) -> list[tuple[datetime, datetime]]:
    try:
        response = (
            _service()
            .freebusy()
            .query(
                body={
                    "timeMin": start.isoformat(),
                    "timeMax": end.isoformat(),
                    "timeZone": settings.CONSULTATION_TIMEZONE,
                    "items": [{"id": settings.GOOGLE_CALENDAR_ID}],
                }
            )
            .execute()
        )
    except (HttpError, GoogleAuthError, OSError) as exc:
        raise CalendarUnavailableError("Google Calendar is currently unavailable.") from exc

    calendar_data = response.get("calendars", {}).get(settings.GOOGLE_CALENDAR_ID, {})
    if calendar_data.get("errors"):
        raise CalendarUnavailableError("Google Calendar returned an availability error.")
    return [
        (_parse_google_datetime(period["start"]), _parse_google_datetime(period["end"]))
        for period in calendar_data.get("busy", [])
    ]


def is_slot_free(slot: ConsultationSlot) -> bool:
    return not _busy_periods(slot.start, slot.end)


def available_slots() -> list[ConsultationSlot]:
    slots = candidate_slots()
    if not slots:
        return []
    busy_periods = _busy_periods(slots[0].start, slots[-1].end)
    from django.utils import timezone as django_timezone

    from .models import ConsultationBooking

    ConsultationBooking.objects.filter(
        status=ConsultationBooking.STATUS_NEW,
        checkout_expires_at__isnull=False,
        checkout_expires_at__lte=django_timezone.now(),
    ).update(status=ConsultationBooking.STATUS_CANCELLED)
    reserved_slots = set(
        ConsultationBooking.objects.filter(
            status=ConsultationBooking.STATUS_NEW,
            stripe_session_id__gt="",
            checkout_expires_at__gt=django_timezone.now(),
            selected_date__range=(slots[0].start.date(), slots[-1].start.date()),
        )
        .values_list("selected_date", "selected_time")
    )
    return [
        slot
        for slot in slots
        if (slot.start.date(), slot.start.strftime("%H:%M")) not in reserved_slots
        if not any(slot.start < busy_end and slot.end > busy_start for busy_start, busy_end in busy_periods)
    ]


def validate_slot_start(slot_start: datetime) -> ConsultationSlot:
    timezone = _timezone()
    if slot_start.tzinfo is None:
        raise ValueError("slotStart must include a timezone offset.")
    local_start = slot_start.astimezone(timezone)
    for slot in candidate_slots():
        if slot.start == local_start:
            return slot
    raise ValueError("The selected slot is outside the configured consultation schedule.")


def create_event(slot: ConsultationSlot, booking_data: dict) -> dict:
    language = booking_data.get("language", "bg")
    title_prefix = {
        "bg": "Консултация",
        "ru": "Консультация",
        "en": "Consultation",
    }.get(language, "Consultation")
    description_labels = {
        "bg": ("Име", "Имейл", "Телефон", "Формат", "Тип среща", "Съобщение"),
        "ru": ("Имя", "Email", "Телефон", "Формат", "Тип встречи", "Сообщение"),
        "en": ("Name", "Email", "Phone", "Format", "Meeting type", "Message"),
    }.get(language, ("Name", "Email", "Phone", "Format", "Meeting type", "Message"))
    name_label, email_label, phone_label, format_label, meeting_label, message_label = description_labels
    description = "\n".join(
        [
            f"{name_label}: {booking_data['name']}",
            f"{email_label}: {booking_data['email']}",
            f"{phone_label}: {booking_data['phone']}",
            f"{format_label}: {booking_data['consultationFormat']}",
            f"{meeting_label}: {booking_data['meetingType']}",
            f"{message_label}: {booking_data.get('message', '') or '-'}",
        ]
    )
    body = {
        "summary": f"{title_prefix}: {booking_data['name']}",
        "description": description,
        "start": {"dateTime": slot.start.isoformat(), "timeZone": settings.CONSULTATION_TIMEZONE},
        "end": {"dateTime": slot.end.isoformat(), "timeZone": settings.CONSULTATION_TIMEZONE},
        "extendedProperties": {
            "private": {
                "source": "website-consultation-form",
                "locale": language,
                "page": f"/{language}/consultation",
            }
        },
    }
    try:
        return (
            _service()
            .events()
            .insert(calendarId=settings.GOOGLE_CALENDAR_ID, body=body)
            .execute()
        )
    except (HttpError, GoogleAuthError, OSError) as exc:
        raise CalendarUnavailableError("The calendar event could not be created.") from exc


def delete_event(event_id: str) -> None:
    event_id = (event_id or "").strip()
    if not event_id:
        return
    try:
        _service().events().delete(calendarId=settings.GOOGLE_CALENDAR_ID, eventId=event_id).execute()
    except HttpError as exc:
        if getattr(exc, "status_code", None) in {404, 410} or getattr(getattr(exc, "resp", None), "status", None) in {404, 410}:
            return
        raise CalendarUnavailableError("The calendar event could not be deleted.") from exc
    except (GoogleAuthError, OSError) as exc:
        raise CalendarUnavailableError("The calendar event could not be deleted.") from exc
