from django.contrib import admin

from .google_calendar import delete_event
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

	def save_model(self, request, obj, form, change):
		if change and obj.status == ConsultationBooking.STATUS_CANCELLED:
			previous = ConsultationBooking.objects.filter(pk=obj.pk).first()
			if previous and previous.status != ConsultationBooking.STATUS_CANCELLED and previous.google_event_id:
				delete_event(previous.google_event_id)
				obj.google_event_id = ""
				obj.google_event_url = ""
				obj.payload = {
					**(obj.payload or {}),
					"google_event_id": "",
					"google_event_deleted": True,
				}
		super().save_model(request, obj, form, change)

# Register your models here.
