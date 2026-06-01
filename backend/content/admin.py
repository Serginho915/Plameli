from django.contrib import admin

from .models import BlogPost, EducationItem, EducationModule


@admin.register(BlogPost)
class BlogPostAdmin(admin.ModelAdmin):
	list_display = ("external_id", "slug", "author", "is_published", "updated_at")
	list_filter = ("is_published",)
	search_fields = ("external_id", "slug", "title_ru", "title_bg")


class EducationModuleInline(admin.TabularInline):
	model = EducationModule
	extra = 1


@admin.register(EducationItem)
class EducationItemAdmin(admin.ModelAdmin):
	list_display = ("external_id", "slug", "item_type", "level", "goal", "item_format", "is_published")
	list_filter = ("item_type", "level", "goal", "item_format", "is_published")
	search_fields = ("external_id", "slug", "title_ru", "title_bg")
	inlines = [EducationModuleInline]

# Register your models here.
