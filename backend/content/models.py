from django.db import models


class TimeStampedModel(models.Model):
	created_at = models.DateTimeField(auto_now_add=True)
	updated_at = models.DateTimeField(auto_now=True)

	class Meta:
		abstract = True


class BlogPost(TimeStampedModel):
	external_id = models.CharField(max_length=32, unique=True)
	slug = models.SlugField(unique=True)
	author = models.CharField(max_length=255)
	tags = models.JSONField(default=list)
	media_src = models.CharField(max_length=500)
	date_label_ru = models.CharField(max_length=120)
	date_label_bg = models.CharField(max_length=120)
	title_ru = models.CharField(max_length=255)
	title_bg = models.CharField(max_length=255)
	content_ru = models.JSONField(default=list)
	content_bg = models.JSONField(default=list)
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

	external_id = models.CharField(max_length=32, unique=True)
	item_type = models.CharField(max_length=16, choices=TYPE_CHOICES)
	slug = models.SlugField(unique=True)
	media_src = models.CharField(max_length=500)
	poster = models.CharField(max_length=500, blank=True)

	title_ru = models.CharField(max_length=255)
	title_bg = models.CharField(max_length=255)

	description_ru = models.TextField()
	description_bg = models.TextField()

	start_date_ru = models.CharField(max_length=120)
	start_date_bg = models.CharField(max_length=120)

	price_ru = models.CharField(max_length=120)
	price_bg = models.CharField(max_length=120)

	level = models.CharField(max_length=20, choices=LEVEL_CHOICES)
	goal = models.CharField(max_length=20, choices=GOAL_CHOICES)
	item_format = models.CharField(max_length=20, choices=FORMAT_CHOICES)

	level_label_ru = models.CharField(max_length=120)
	level_label_bg = models.CharField(max_length=120)
	goal_label_ru = models.CharField(max_length=120)
	goal_label_bg = models.CharField(max_length=120)
	format_label_ru = models.CharField(max_length=120)
	format_label_bg = models.CharField(max_length=120)

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
