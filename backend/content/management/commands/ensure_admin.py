import os

from django.contrib.auth import get_user_model
from django.core.management.base import BaseCommand


class Command(BaseCommand):
    help = "Create or update a staff superuser from environment variables."

    def handle(self, *args, **options):
        username = os.environ.get("DJANGO_ADMIN_USERNAME") or os.environ.get("DJANGO_SUPERUSER_USERNAME")
        password = os.environ.get("DJANGO_ADMIN_PASSWORD") or os.environ.get("DJANGO_SUPERUSER_PASSWORD")
        email = os.environ.get("DJANGO_ADMIN_EMAIL") or os.environ.get("DJANGO_SUPERUSER_EMAIL", "")

        if not username or not password:
            self.stdout.write("Admin bootstrap skipped: DJANGO_ADMIN_USERNAME/PASSWORD are not set.")
            return

        User = get_user_model()
        user, created = User.objects.get_or_create(
            username=username,
            defaults={
                "email": email,
                "is_staff": True,
                "is_superuser": True,
            },
        )

        user.email = email or user.email
        user.is_staff = True
        user.is_superuser = True
        user.set_password(password)
        user.save(update_fields=["email", "is_staff", "is_superuser", "password"])

        action = "created" if created else "updated"
        self.stdout.write(self.style.SUCCESS(f"Admin user '{username}' {action}."))
