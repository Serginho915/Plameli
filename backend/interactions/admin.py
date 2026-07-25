from django.contrib import admin

from .google_calendar import delete_event
from .models import (
	AfterSalesCase,
	ChatConversation,
	ChatMessage,
	ClientNote,
	ClientProfile,
	ConsultationBooking,
	EducationRegistration,
	FeedbackRequest,
)


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


class AfterSalesCaseInline(admin.TabularInline):
	model = AfterSalesCase
	extra = 0
	fields = ("summary", "case_type", "status", "priority", "due_at", "source_model", "source_id")
	readonly_fields = ("source_model", "source_id")


class ClientNoteInline(admin.TabularInline):
	model = ClientNote
	extra = 0
	fields = ("case", "author", "text", "created_at")
	readonly_fields = ("created_at",)


@admin.register(ClientProfile)
class ClientProfileAdmin(admin.ModelAdmin):
	list_display = ("name", "email", "phone", "status", "source", "updated_at")
	search_fields = ("name", "email", "phone", "notes")
	list_filter = ("status", "language", "source")
	inlines = [AfterSalesCaseInline, ClientNoteInline]


@admin.register(AfterSalesCase)
class AfterSalesCaseAdmin(admin.ModelAdmin):
	list_display = ("summary", "client", "case_type", "status", "priority", "due_at", "updated_at")
	search_fields = ("summary", "description", "client__name", "client__email", "client__phone")
	list_filter = ("case_type", "status", "priority")
	readonly_fields = ("source_model", "source_id", "created_at", "updated_at")


@admin.register(ClientNote)
class ClientNoteAdmin(admin.ModelAdmin):
	list_display = ("client", "case", "author", "created_at")
	search_fields = ("client__name", "client__email", "text")
	list_filter = ("created_at",)


class ChatMessageInline(admin.TabularInline):
	model = ChatMessage
	extra = 0
	readonly_fields = ("role", "content", "created_at")
	can_delete = False

	def has_add_permission(self, request, obj=None):
		return False


@admin.register(ChatConversation)
class ChatConversationAdmin(admin.ModelAdmin):
	list_display = ("title", "language", "message_count", "last_message_at", "ip_address")
	search_fields = ("session_id", "title", "last_user_message", "messages__content", "ip_address")
	list_filter = ("language",)
	readonly_fields = (
		"session_id",
		"language",
		"title",
		"last_user_message",
		"last_message_at",
		"message_count",
		"user_agent",
		"ip_address",
		"created_at",
		"updated_at",
	)
	inlines = [ChatMessageInline]

	def has_add_permission(self, request):
		return False

# Register your models here.
