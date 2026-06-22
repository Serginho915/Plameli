from datetime import date

from django.conf import settings
from rest_framework import serializers

from .models import BlogPost, EducationItem

SUPPORTED_LANGUAGES = {"ru", "bg"}


def get_language(context: dict) -> str:
    lang = context.get("lang", "ru")
    return lang if lang in SUPPORTED_LANGUAGES else "ru"


def localized_value(obj, base_name: str, lang: str):
    value = getattr(obj, f"{base_name}_{lang}", None)
    if value:
        return value
    return getattr(obj, f"{base_name}_ru")


def resolve_media_url(value: str, request) -> str:
    if not value:
        return ""
    if value.startswith(("http://", "https://")):
        return value
    if value.startswith(settings.MEDIA_URL) and request is not None:
        return request.build_absolute_uri(value)
    return value


class LocalizedBlogPostSerializer(serializers.ModelSerializer):
    id = serializers.CharField(source="external_id")
    title = serializers.SerializerMethodField()
    content = serializers.SerializerMethodField()
    date = serializers.SerializerMethodField()
    media_src = serializers.SerializerMethodField()

    class Meta:
        model = BlogPost
        fields = [
            "id",
            "slug",
            "title",
            "tags",
            "author",
            "date",
            "media_src",
            "content",
        ]

    def get_title(self, obj):
        return localized_value(obj, "title", get_language(self.context))

    def get_content(self, obj):
        return localized_value(obj, "content", get_language(self.context))

    def get_date(self, obj):
        value: date = obj.published_at
        return value.strftime("%d.%m.%Y")

    def get_media_src(self, obj):
        return resolve_media_url(obj.media_src, self.context.get("request"))


class LocalizedProgramModuleSerializer(serializers.Serializer):
    title = serializers.CharField()
    description = serializers.CharField()


class LocalizedEducationItemSerializer(serializers.ModelSerializer):
    id = serializers.CharField(source="external_id")
    type = serializers.SerializerMethodField()
    media_src = serializers.SerializerMethodField()
    poster = serializers.SerializerMethodField()
    title = serializers.SerializerMethodField()
    startDate = serializers.SerializerMethodField()
    format = serializers.SerializerMethodField()
    price = serializers.SerializerMethodField()
    levelLabel = serializers.SerializerMethodField()
    goalLabel = serializers.SerializerMethodField()
    formatLabel = serializers.SerializerMethodField()
    description = serializers.SerializerMethodField()
    program = serializers.SerializerMethodField()

    class Meta:
        model = EducationItem
        fields = [
            "id",
            "slug",
            "type",
            "media_src",
            "poster",
            "title",
            "startDate",
            "format",
            "price",
            "level",
            "goal",
            "description",
            "levelLabel",
            "goalLabel",
            "formatLabel",
            "program",
        ]

    def get_type(self, obj):
        return "video" if obj.item_type == EducationItem.TYPE_WEBINAR else "image"

    def get_media_src(self, obj):
        if obj.item_type == EducationItem.TYPE_WEBINAR:
            return resolve_media_url(obj.video_src, self.context.get("request"))
        return resolve_media_url(obj.image_src, self.context.get("request"))

    def get_poster(self, obj):
        if obj.item_type != EducationItem.TYPE_WEBINAR:
            return ""
        return resolve_media_url(obj.image_src, self.context.get("request"))

    def get_title(self, obj):
        return localized_value(obj, "title", get_language(self.context))

    def get_startDate(self, obj):
        return obj.start_date.strftime("%d.%m.%Y")

    def get_format(self, obj):
        value = obj.item_format
        if value == EducationItem.FORMAT_LIVE:
            return "Live"
        if value == EducationItem.FORMAT_OFFLINE:
            return "Offline"
        return "Online"

    def get_price(self, obj):
        return obj.price

    def get_description(self, obj):
        return localized_value(obj, "description", get_language(self.context))

    def get_levelLabel(self, obj):
        lang = get_language(self.context)
        labels = {
            "ru": {
                EducationItem.LEVEL_BEGINNER: "Начальный",
                EducationItem.LEVEL_EXPERIENCED: "Опытный",
                EducationItem.LEVEL_BUSINESS: "Бизнес",
            },
            "bg": {
                EducationItem.LEVEL_BEGINNER: "Начинаещ",
                EducationItem.LEVEL_EXPERIENCED: "Напреднал",
                EducationItem.LEVEL_BUSINESS: "Бизнес",
            },
        }
        return labels[lang].get(obj.level, obj.level)

    def get_goalLabel(self, obj):
        lang = get_language(self.context)
        labels = {
            "ru": {
                EducationItem.GOAL_LAUNCH: "Запуск",
                EducationItem.GOAL_TAXES: "Налоги",
                EducationItem.GOAL_PROFESSION: "Профессия",
                EducationItem.GOAL_OPTIMIZATION: "Оптимизация",
            },
            "bg": {
                EducationItem.GOAL_LAUNCH: "Стартиране",
                EducationItem.GOAL_TAXES: "Данъци",
                EducationItem.GOAL_PROFESSION: "Професия",
                EducationItem.GOAL_OPTIMIZATION: "Оптимизация",
            },
        }
        return labels[lang].get(obj.goal, obj.goal)

    def get_formatLabel(self, obj):
        lang = get_language(self.context)
        labels = {
            "ru": {
                EducationItem.FORMAT_ONLINE: "Онлайн",
                EducationItem.FORMAT_LIVE: "Вживую",
                EducationItem.FORMAT_OFFLINE: "Оффлайн",
            },
            "bg": {
                EducationItem.FORMAT_ONLINE: "Онлайн",
                EducationItem.FORMAT_LIVE: "На живо",
                EducationItem.FORMAT_OFFLINE: "Офлайн",
            },
        }
        return labels[lang].get(obj.item_format, obj.item_format)

    def get_program(self, obj):
        lang = get_language(self.context)
        return [
            {
                "title": localized_value(module, "title", lang),
                "description": localized_value(module, "description", lang),
            }
            for module in obj.program.all()
        ]
