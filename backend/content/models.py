from uuid import uuid4

from django.db import models


def generate_external_id(prefix: str) -> str:
	return f"{prefix}_{uuid4().hex[:16]}"


def generate_blog_external_id() -> str:
	return generate_external_id("blog")


def generate_education_external_id() -> str:
	return generate_external_id("edu")


class TimeStampedModel(models.Model):
	created_at = models.DateTimeField(auto_now_add=True)
	updated_at = models.DateTimeField(auto_now=True)

	class Meta:
		abstract = True


class BlogPost(TimeStampedModel):
	external_id = models.CharField(max_length=32, unique=True, default=generate_blog_external_id, editable=False)
	slug = models.SlugField(unique=True)
	author = models.CharField(max_length=255)
	tags = models.JSONField(default=list)
	media_src = models.CharField(max_length=500, blank=True, default="")
	published_at = models.DateField()
	title_ru = models.CharField(max_length=255)
	title_bg = models.CharField(max_length=255)
	content_ru = models.TextField(blank=True, default="")
	content_bg = models.TextField(blank=True, default="")
	is_published = models.BooleanField(default=True)

	class Meta:
		ordering = ["created_at"]

	def __str__(self):
		return self.slug


class EducationItem(TimeStampedModel):
	TYPE_COURSE = "course"
	TYPE_WEBINAR = "webinar"
	TYPE_CHOICES = [
		(TYPE_COURSE, "Course"),
		(TYPE_WEBINAR, "Webinar"),
	]

	LEVEL_BEGINNER = "beginner"
	LEVEL_EXPERIENCED = "experienced"
	LEVEL_BUSINESS = "business"
	LEVEL_CHOICES = [
		(LEVEL_BEGINNER, "Beginner"),
		(LEVEL_EXPERIENCED, "Experienced"),
		(LEVEL_BUSINESS, "Business"),
	]

	GOAL_LAUNCH = "launch"
	GOAL_TAXES = "taxes"
	GOAL_PROFESSION = "profession"
	GOAL_OPTIMIZATION = "optimization"
	GOAL_CHOICES = [
		(GOAL_LAUNCH, "Launch"),
		(GOAL_TAXES, "Taxes"),
		(GOAL_PROFESSION, "Profession"),
		(GOAL_OPTIMIZATION, "Optimization"),
	]

	FORMAT_ONLINE = "online"
	FORMAT_LIVE = "live"
	FORMAT_OFFLINE = "offline"
	FORMAT_CHOICES = [
		(FORMAT_ONLINE, "Online"),
		(FORMAT_LIVE, "Live"),
		(FORMAT_OFFLINE, "Offline"),
	]

	external_id = models.CharField(max_length=32, unique=True, default=generate_education_external_id, editable=False)
	item_type = models.CharField(max_length=16, choices=TYPE_CHOICES)
	slug = models.SlugField(unique=True)
	image_src = models.CharField(max_length=500, blank=True, default="")
	video_src = models.CharField(max_length=500, blank=True, default="")

	title_ru = models.CharField(max_length=255)
	title_bg = models.CharField(max_length=255)

	description_ru = models.TextField()
	description_bg = models.TextField()

	start_date = models.DateField()

	price = models.CharField(max_length=120)

	level = models.CharField(max_length=20, choices=LEVEL_CHOICES)
	goal = models.CharField(max_length=20, choices=GOAL_CHOICES)
	item_format = models.CharField(max_length=20, choices=FORMAT_CHOICES)

	is_published = models.BooleanField(default=True)

	class Meta:
		ordering = ["created_at"]

	def __str__(self):
		return self.slug


class EducationModule(TimeStampedModel):
	education_item = models.ForeignKey(
		EducationItem,
		related_name="program",
		on_delete=models.CASCADE,
	)
	sort_order = models.PositiveIntegerField(default=0)
	title_ru = models.CharField(max_length=255)
	title_bg = models.CharField(max_length=255)
	description_ru = models.TextField()
	description_bg = models.TextField()

	class Meta:
		ordering = ["sort_order", "id"]

	def __str__(self):
		return f"{self.education_item.slug}:{self.sort_order}"

# Create your models here.
