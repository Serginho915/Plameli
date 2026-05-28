from rest_framework import serializers

from .models import BlogPost, ContentPage, EducationItem

SUPPORTED_LANGUAGES = {"ru", "bg", "en"}


def get_language(context: dict) -> str:
    lang = context.get("lang", "ru")
    return lang if lang in SUPPORTED_LANGUAGES else "ru"


def localized_value(obj, base_name: str, lang: str):
    value = getattr(obj, f"{base_name}_{lang}", None)
    if value:
        return value
    return getattr(obj, f"{base_name}_ru")


class LocalizedPageSerializer(serializers.ModelSerializer):
    title = serializers.SerializerMethodField()
    content = serializers.SerializerMethodField()

    class Meta:
        model = ContentPage
        fields = ["slug", "title", "content"]

    def get_title(self, obj):
        return localized_value(obj, "title", get_language(self.context))

    def get_content(self, obj):
        return localized_value(obj, "content", get_language(self.context))


class LocalizedBlogPostSerializer(serializers.ModelSerializer):
    id = serializers.CharField(source="external_id")
    title = serializers.SerializerMethodField()
    content = serializers.SerializerMethodField()
    date = serializers.SerializerMethodField()

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
        return localized_value(obj, "date_label", get_language(self.context))


class LocalizedProgramModuleSerializer(serializers.Serializer):
    title = serializers.CharField()
    description = serializers.CharField()


class LocalizedEducationItemSerializer(serializers.ModelSerializer):
    id = serializers.CharField(source="external_id")
    type = serializers.SerializerMethodField()
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

    def get_title(self, obj):
        return localized_value(obj, "title", get_language(self.context))

    def get_startDate(self, obj):
        return localized_value(obj, "start_date", get_language(self.context))

    def get_format(self, obj):
        value = obj.item_format
        if value == EducationItem.FORMAT_LIVE:
            return "Live"
        if value == EducationItem.FORMAT_OFFLINE:
            return "Offline"
        return "Online"

    def get_price(self, obj):
        return localized_value(obj, "price", get_language(self.context))

    def get_description(self, obj):
        return localized_value(obj, "description", get_language(self.context))

    def get_levelLabel(self, obj):
        return localized_value(obj, "level_label", get_language(self.context))

    def get_goalLabel(self, obj):
        return localized_value(obj, "goal_label", get_language(self.context))

    def get_formatLabel(self, obj):
        return localized_value(obj, "format_label", get_language(self.context))

    def get_program(self, obj):
        lang = get_language(self.context)
        return [
            {
                "title": localized_value(module, "title", lang),
                "description": localized_value(module, "description", lang),
            }
            for module in obj.program.all()
        ]
