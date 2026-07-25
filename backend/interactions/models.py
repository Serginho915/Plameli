import uuid

from django.db import models
from django.db.models.functions import Lower

from content.models import EducationItem


class TimeStampedModel(models.Model):
	created_at = models.DateTimeField(auto_now_add=True)
	updated_at = models.DateTimeField(auto_now=True)

	class Meta:
		abstract = True


class FeedbackRequest(TimeStampedModel):
	language = models.CharField(max_length=8, default="ru")
	name = models.CharField(max_length=255)
	email = models.EmailField()
	message = models.TextField()
	phone = models.CharField(max_length=32, blank=True)
	source = models.CharField(max_length=64, default="site")

	def __str__(self):
		return f"feedback:{self.email}"


class EducationRegistration(TimeStampedModel):
	STATUS_NEW = "new"
	STATUS_CONTACTED = "contacted"
	STATUS_CLOSED = "closed"
	STATUS_CHOICES = [
		(STATUS_NEW, "New"),
		(STATUS_CONTACTED, "Contacted"),
		(STATUS_CLOSED, "Closed"),
	]

	language = models.CharField(max_length=8, default="ru")
	education_item = models.ForeignKey(
		EducationItem,
		related_name="registrations",
		null=True,
		blank=True,
		on_delete=models.SET_NULL,
	)
	item_external_id = models.CharField(max_length=32, blank=True)
	item_slug = models.SlugField(max_length=255, blank=True)
	item_title = models.CharField(max_length=255, blank=True)
	item_type = models.CharField(max_length=16, blank=True)

	name = models.CharField(max_length=255)
	email = models.EmailField()
	phone = models.CharField(max_length=32)
	status = models.CharField(max_length=16, choices=STATUS_CHOICES, default=STATUS_NEW)
	stripe_session_id = models.CharField(max_length=255, blank=True, default="", db_index=True)
	payload = models.JSONField(default=dict, blank=True)

	class Meta:
		constraints = [
			models.UniqueConstraint(
				fields=["stripe_session_id"],
				condition=~models.Q(stripe_session_id=""),
				name="unique_education_stripe_session",
			)
		]

	def __str__(self):
		return f"registration:{self.email}:{self.item_slug or '-'}"


class ConsultationBooking(TimeStampedModel):
	FORMAT_STANDARD = "standard"
	FORMAT_PRIORITY = "priority"
	FORMAT_CHOICES = [
		(FORMAT_STANDARD, "Standard"),
		(FORMAT_PRIORITY, "Priority"),
	]

	MEETING_SOFIA = "sofia"
	MEETING_ZOOM = "zoom"
	MEETING_CHOICES = [
		(MEETING_SOFIA, "Sofia"),
		(MEETING_ZOOM, "Zoom"),
	]

	STATUS_NEW = "new"
	STATUS_PAID = "paid"
	STATUS_CANCELLED = "cancelled"
	STATUS_CHOICES = [
		(STATUS_NEW, "New"),
		(STATUS_PAID, "Paid"),
		(STATUS_CANCELLED, "Cancelled"),
	]

	language = models.CharField(max_length=8, default="ru")
	consultation_format = models.CharField(max_length=16, choices=FORMAT_CHOICES)
	meeting_type = models.CharField(max_length=16, choices=MEETING_CHOICES)

	name = models.CharField(max_length=255)
	phone = models.CharField(max_length=32)
	email = models.EmailField()
	message = models.TextField(blank=True)

	selected_date = models.DateField()
	selected_time = models.CharField(max_length=16)
	total_amount_eur = models.DecimalField(max_digits=10, decimal_places=2)
	status = models.CharField(max_length=16, choices=STATUS_CHOICES, default=STATUS_NEW)
	stripe_session_id = models.CharField(max_length=255, blank=True, default="", db_index=True)
	stripe_payment_intent = models.CharField(max_length=255, blank=True, default="")
	checkout_expires_at = models.DateTimeField(null=True, blank=True)
	google_event_id = models.CharField(max_length=255, blank=True, default="")
	google_event_url = models.URLField(blank=True, default="")
	payload = models.JSONField(default=dict, blank=True)

	class Meta:
		constraints = [
			models.UniqueConstraint(
				fields=["selected_date", "selected_time"],
				condition=models.Q(status="new"),
				name="unique_active_consultation_slot",
			),
			models.UniqueConstraint(
				fields=["stripe_session_id"],
				condition=~models.Q(stripe_session_id=""),
				name="unique_consultation_stripe_session",
			),
		]

	def __str__(self):
		return f"booking:{self.email}:{self.selected_date}:{self.selected_time}"


class ClientProfile(TimeStampedModel):
	STATUS_NEW = "new"
	STATUS_ACTIVE = "active"
	STATUS_WAITING = "waiting"
	STATUS_COMPLETED = "completed"
	STATUS_LOST = "lost"
	STATUS_CHOICES = [
		(STATUS_NEW, "New"),
		(STATUS_ACTIVE, "Active"),
		(STATUS_WAITING, "Waiting"),
		(STATUS_COMPLETED, "Completed"),
		(STATUS_LOST, "Lost"),
	]

	language = models.CharField(max_length=8, default="ru")
	name = models.CharField(max_length=255)
	email = models.EmailField(db_index=True)
	phone = models.CharField(max_length=32, blank=True)
	status = models.CharField(max_length=32, choices=STATUS_CHOICES, default=STATUS_NEW)
	source = models.CharField(max_length=64, blank=True)
	notes = models.TextField(blank=True)

	class Meta:
		ordering = ["-updated_at", "-created_at"]
		constraints = [
			models.UniqueConstraint(
				Lower("email"),
				name="unique_client_profile_email_lower",
			)
		]

	def __str__(self):
		return f"client:{self.email}"


class AfterSalesCase(TimeStampedModel):
	TYPE_CONSULTATION_FOLLOWUP = "consultation_followup"
	TYPE_EDUCATION_SUPPORT = "education_support"
	TYPE_FEEDBACK_FOLLOWUP = "feedback_followup"
	TYPE_DOCUMENTS = "documents"
	TYPE_GENERAL = "general"
	TYPE_CHOICES = [
		(TYPE_CONSULTATION_FOLLOWUP, "Consultation follow-up"),
		(TYPE_EDUCATION_SUPPORT, "Education support"),
		(TYPE_FEEDBACK_FOLLOWUP, "Feedback follow-up"),
		(TYPE_DOCUMENTS, "Documents"),
		(TYPE_GENERAL, "General"),
	]

	STATUS_OPEN = "open"
	STATUS_IN_PROGRESS = "in_progress"
	STATUS_WAITING_CLIENT = "waiting_client"
	STATUS_DONE = "done"
	STATUS_CANCELLED = "cancelled"
	STATUS_CHOICES = [
		(STATUS_OPEN, "Open"),
		(STATUS_IN_PROGRESS, "In progress"),
		(STATUS_WAITING_CLIENT, "Waiting client"),
		(STATUS_DONE, "Done"),
		(STATUS_CANCELLED, "Cancelled"),
	]

	PRIORITY_LOW = "low"
	PRIORITY_NORMAL = "normal"
	PRIORITY_HIGH = "high"
	PRIORITY_CHOICES = [
		(PRIORITY_LOW, "Low"),
		(PRIORITY_NORMAL, "Normal"),
		(PRIORITY_HIGH, "High"),
	]

	client = models.ForeignKey(ClientProfile, related_name="cases", on_delete=models.CASCADE)
	case_type = models.CharField(max_length=32, choices=TYPE_CHOICES, default=TYPE_GENERAL)
	status = models.CharField(max_length=32, choices=STATUS_CHOICES, default=STATUS_OPEN)
	priority = models.CharField(max_length=16, choices=PRIORITY_CHOICES, default=PRIORITY_NORMAL)
	due_at = models.DateTimeField(null=True, blank=True)
	assigned_to = models.ForeignKey(
		"auth.User",
		related_name="after_sales_cases",
		null=True,
		blank=True,
		on_delete=models.SET_NULL,
	)
	summary = models.CharField(max_length=255)
	description = models.TextField(blank=True)
	source_model = models.CharField(max_length=64, blank=True)
	source_id = models.PositiveIntegerField(null=True, blank=True)

	class Meta:
		ordering = ["-updated_at", "-created_at"]
		indexes = [
			models.Index(fields=["status", "priority"], name="as_status_priority_idx"),
			models.Index(fields=["source_model", "source_id"], name="as_source_idx"),
		]
		constraints = [
			models.UniqueConstraint(
				fields=["source_model", "source_id"],
				condition=~models.Q(source_model="") & models.Q(source_id__isnull=False),
				name="unique_after_sales_source",
			)
		]

	def __str__(self):
		return f"case:{self.client.email}:{self.summary}"


class ClientNote(TimeStampedModel):
	client = models.ForeignKey(ClientProfile, related_name="notes_list", on_delete=models.CASCADE)
	case = models.ForeignKey(
		AfterSalesCase,
		related_name="notes_list",
		null=True,
		blank=True,
		on_delete=models.CASCADE,
	)
	author = models.ForeignKey(
		"auth.User",
		related_name="client_notes",
		null=True,
		blank=True,
		on_delete=models.SET_NULL,
	)
	text = models.TextField()

	class Meta:
		ordering = ["-created_at"]

	def __str__(self):
		return f"note:{self.client.email}:{self.created_at:%Y-%m-%d}"


class ChatConversation(TimeStampedModel):
	session_id = models.UUIDField(default=uuid.uuid4, unique=True, editable=False)
	language = models.CharField(max_length=8, default="bg", blank=True)
	title = models.CharField(max_length=255, blank=True)
	last_user_message = models.TextField(blank=True)
	last_message_at = models.DateTimeField(null=True, blank=True, db_index=True)
	message_count = models.PositiveIntegerField(default=0)
	user_agent = models.TextField(blank=True)
	ip_address = models.CharField(max_length=64, blank=True)

	class Meta:
		ordering = ["-last_message_at", "-created_at"]

	def __str__(self):
		return f"chat:{self.session_id}"


class ChatMessage(TimeStampedModel):
	ROLE_ASSISTANT = "assistant"
	ROLE_USER = "user"
	ROLE_CHOICES = [
		(ROLE_ASSISTANT, "Assistant"),
		(ROLE_USER, "User"),
	]

	conversation = models.ForeignKey(
		ChatConversation,
		related_name="messages",
		on_delete=models.CASCADE,
	)
	role = models.CharField(max_length=16, choices=ROLE_CHOICES)
	content = models.TextField()

	class Meta:
		ordering = ["created_at", "id"]
		indexes = [
			models.Index(fields=["conversation", "created_at"], name="interaction_convers_a58152_idx"),
		]

	def __str__(self):
		return f"chat-message:{self.conversation_id}:{self.role}"

# Create your models here.
