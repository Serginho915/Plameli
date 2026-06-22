from django.db import models

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
	payload = models.JSONField(default=dict, blank=True)

	def __str__(self):
		return f"booking:{self.email}:{self.selected_date}:{self.selected_time}"

# Create your models here.
