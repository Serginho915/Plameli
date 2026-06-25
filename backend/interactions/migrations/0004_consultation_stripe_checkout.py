from django.db import migrations, models


class Migration(migrations.Migration):
    dependencies = [
        ("interactions", "0003_consultation_google_calendar"),
    ]

    operations = [
        migrations.AddField(
            model_name="consultationbooking",
            name="checkout_expires_at",
            field=models.DateTimeField(blank=True, null=True),
        ),
        migrations.AddField(
            model_name="consultationbooking",
            name="stripe_payment_intent",
            field=models.CharField(blank=True, default="", max_length=255),
        ),
        migrations.AddField(
            model_name="consultationbooking",
            name="stripe_session_id",
            field=models.CharField(blank=True, db_index=True, default="", max_length=255),
        ),
        migrations.AddConstraint(
            model_name="educationregistration",
            constraint=models.UniqueConstraint(
                condition=~models.Q(stripe_session_id=""),
                fields=("stripe_session_id",),
                name="unique_education_stripe_session",
            ),
        ),
        migrations.AddConstraint(
            model_name="consultationbooking",
            constraint=models.UniqueConstraint(
                condition=~models.Q(stripe_session_id=""),
                fields=("stripe_session_id",),
                name="unique_consultation_stripe_session",
            ),
        ),
    ]
