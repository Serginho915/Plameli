from django.db import migrations, models


def migrate_legacy_consultations(apps, schema_editor):
    ConsultationBooking = apps.get_model("interactions", "ConsultationBooking")
    ConsultationBooking.objects.filter(
        status="new",
        stripe_session_id="",
        google_event_id__gt="",
    ).update(status="paid")
    ConsultationBooking.objects.filter(
        status="new",
        stripe_session_id="",
        google_event_id="",
    ).update(status="cancelled")


class Migration(migrations.Migration):
    dependencies = [
        ("interactions", "0004_consultation_stripe_checkout"),
    ]

    operations = [
        migrations.RunPython(migrate_legacy_consultations, migrations.RunPython.noop),
        migrations.RemoveConstraint(
            model_name="consultationbooking",
            name="unique_active_consultation_slot",
        ),
        migrations.AddConstraint(
            model_name="consultationbooking",
            constraint=models.UniqueConstraint(
                condition=models.Q(status="new"),
                fields=("selected_date", "selected_time"),
                name="unique_active_consultation_slot",
            ),
        ),
    ]
