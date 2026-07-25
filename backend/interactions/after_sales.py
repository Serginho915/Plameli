from django.db import transaction

from .models import (
    AfterSalesCase,
    ClientProfile,
    ConsultationBooking,
    EducationRegistration,
    FeedbackRequest,
)


def normalize_email(email):
    return (email or "").strip().lower()


def get_or_create_client_from_record(record, source):
    email = normalize_email(getattr(record, "email", ""))
    if not email:
        return None

    defaults = {
        "name": getattr(record, "name", "") or email,
        "phone": getattr(record, "phone", "") or "",
        "language": getattr(record, "language", "") or "ru",
        "source": source,
    }
    client = ClientProfile.objects.filter(email__iexact=email).first()
    created = client is None
    if created:
        client = ClientProfile.objects.create(email=email, **defaults)

    updates = {}
    if not created:
        for field in ("name", "phone", "language"):
            value = defaults[field]
            if value and not getattr(client, field):
                updates[field] = value
        if defaults["source"] and not client.source:
            updates["source"] = defaults["source"]

    if updates:
        for field, value in updates.items():
            setattr(client, field, value)
        client.save(update_fields=[*updates.keys(), "updated_at"])

    return client


def build_case_payload(record):
    if isinstance(record, ConsultationBooking):
        return {
            "case_type": AfterSalesCase.TYPE_CONSULTATION_FOLLOWUP,
            "summary": f"Follow up consultation on {record.selected_date} at {record.selected_time}",
            "description": record.message,
            "source_model": "consultation_booking",
        }

    if isinstance(record, EducationRegistration):
        return {
            "case_type": AfterSalesCase.TYPE_EDUCATION_SUPPORT,
            "summary": f"Education follow up: {record.item_title or record.item_slug or record.item_type}",
            "description": "",
            "source_model": "education_registration",
        }

    if isinstance(record, FeedbackRequest):
        return {
            "case_type": AfterSalesCase.TYPE_FEEDBACK_FOLLOWUP,
            "summary": f"Feedback request from {record.name}",
            "description": record.message,
            "source_model": "feedback_request",
        }

    return {
        "case_type": AfterSalesCase.TYPE_GENERAL,
        "summary": "Client follow up",
        "description": "",
        "source_model": record.__class__.__name__.lower(),
    }


@transaction.atomic
def ensure_after_sales_case(record, source):
    client = get_or_create_client_from_record(record, source)
    if client is None:
        return None

    payload = build_case_payload(record)
    case, _ = AfterSalesCase.objects.get_or_create(
        source_model=payload["source_model"],
        source_id=record.id,
        defaults={
            "client": client,
            "case_type": payload["case_type"],
            "summary": payload["summary"][:255],
            "description": payload["description"],
        },
    )
    return case


def sync_after_sales_from_requests():
    for booking in ConsultationBooking.objects.all().iterator():
        ensure_after_sales_case(booking, "consultation")

    for registration in EducationRegistration.objects.all().iterator():
        ensure_after_sales_case(registration, "education")

    for feedback in FeedbackRequest.objects.all().iterator():
        ensure_after_sales_case(feedback, "feedback")
