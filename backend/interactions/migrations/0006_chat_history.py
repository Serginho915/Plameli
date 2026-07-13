import uuid

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):
    dependencies = [
        ("interactions", "0005_calendar_is_source_of_truth"),
    ]

    operations = [
        migrations.CreateModel(
            name="ChatConversation",
            fields=[
                ("id", models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name="ID")),
                ("created_at", models.DateTimeField(auto_now_add=True)),
                ("updated_at", models.DateTimeField(auto_now=True)),
                ("session_id", models.UUIDField(default=uuid.uuid4, editable=False, unique=True)),
                ("language", models.CharField(blank=True, default="bg", max_length=8)),
                ("title", models.CharField(blank=True, max_length=255)),
                ("last_user_message", models.TextField(blank=True)),
                ("last_message_at", models.DateTimeField(blank=True, db_index=True, null=True)),
                ("message_count", models.PositiveIntegerField(default=0)),
                ("user_agent", models.TextField(blank=True)),
                ("ip_address", models.CharField(blank=True, max_length=64)),
            ],
            options={
                "ordering": ["-last_message_at", "-created_at"],
            },
        ),
        migrations.CreateModel(
            name="ChatMessage",
            fields=[
                ("id", models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name="ID")),
                ("created_at", models.DateTimeField(auto_now_add=True)),
                ("updated_at", models.DateTimeField(auto_now=True)),
                (
                    "role",
                    models.CharField(
                        choices=[("assistant", "Assistant"), ("user", "User")],
                        max_length=16,
                    ),
                ),
                ("content", models.TextField()),
                (
                    "conversation",
                    models.ForeignKey(
                        on_delete=django.db.models.deletion.CASCADE,
                        related_name="messages",
                        to="interactions.chatconversation",
                    ),
                ),
            ],
            options={
                "ordering": ["created_at", "id"],
            },
        ),
        migrations.AddIndex(
            model_name="chatmessage",
            index=models.Index(fields=["conversation", "created_at"], name="interaction_convers_a58152_idx"),
        ),
    ]
