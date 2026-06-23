from django.db import migrations, models


class Migration(migrations.Migration):
    dependencies = [
        ("interactions", "0002_stripe_session_id"),
    ]

    operations = [
        migrations.AddField(
            model_name="consultationbooking",
            name="google_event_id",
            field=models.CharField(blank=True, default="", max_length=255),
        ),
        migrations.AddField(
            model_name="consultationbooking",
            name="google_event_url",
            field=models.URLField(blank=True, default=""),
        ),
        migrations.AddConstraint(
            model_name="consultationbooking",
            constraint=models.UniqueConstraint(
                condition=~models.Q(status="cancelled"),
                fields=("selected_date", "selected_time"),
                name="unique_active_consultation_slot",
            ),
        ),
    ]
