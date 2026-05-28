from django.contrib import admin

from .models import ConsultationBooking, EducationRegistration, FeedbackRequest


@admin.register(FeedbackRequest)
class FeedbackRequestAdmin(admin.ModelAdmin):
	list_display = ("name", "email", "language", "source", "created_at")
	search_fields = ("name", "email", "message")
	list_filter = ("language", "source")


@admin.register(EducationRegistration)
class EducationRegistrationAdmin(admin.ModelAdmin):
	list_display = ("name", "email", "item_slug", "item_type", "status", "created_at")
	search_fields = ("name", "email", "item_slug", "item_title")
	list_filter = ("status", "language", "item_type")


@admin.register(ConsultationBooking)
class ConsultationBookingAdmin(admin.ModelAdmin):
	list_display = (
		"name",
		"email",
		"consultation_format",
		"meeting_type",
		"selected_date",
		"selected_time",
		"status",
	)
	search_fields = ("name", "email")
	list_filter = ("consultation_format", "meeting_type", "status", "language")

# Register your models here.
