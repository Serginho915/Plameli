import json
from uuid import uuid4

from django.conf import settings
from django.core.files.storage import default_storage
from rest_framework import serializers

from .models import BlogPost, EducationItem, EducationModule


def resolve_media_url(value: str, request) -> str:
    if not value:
        return ""
    if value.startswith(("http://", "https://")):
        return value
    if value.startswith(settings.MEDIA_URL) and request is not None:
        return request.build_absolute_uri(value)
    return value


def store_uploaded_file(file_obj, prefix: str) -> str:
    filename = f"{uuid4().hex}_{file_obj.name}"
    path = default_storage.save(f"content/{prefix}/{filename}", file_obj)
    return f"{settings.MEDIA_URL}{path}"


class BlogPostAdminSerializer(serializers.ModelSerializer):
    media_src = serializers.SerializerMethodField()
    media_file = serializers.FileField(write_only=True, required=False, allow_null=True)

    class Meta:
        model = BlogPost
        fields = [
            "id",
            "slug",
            "author",
            "tags",
            "media_src",
            "media_file",
            "published_at",
            "title_ru",
            "title_bg",
            "content_ru",
            "content_bg",
            "is_published",
            "created_at",
            "updated_at",
        ]
        read_only_fields = ["id", "created_at", "updated_at"]

    def to_internal_value(self, data):
        if hasattr(data, "items"):
            mutable_data = {key: value for key, value in data.items()}
        else:
            mutable_data = dict(data)

        tags = mutable_data.get("tags")
        if isinstance(tags, str):
            mutable_data["tags"] = json.loads(tags) if tags else []

        return super().to_internal_value(mutable_data)

    def validate(self, attrs):
        attrs = super().validate(attrs)
        media_file = attrs.get("media_file")
        has_media = bool(media_file or getattr(self.instance, "media_src", ""))

        if not has_media:
            raise serializers.ValidationError({"media_file": "Blog post requires a cover image."})

        return attrs

    def get_media_src(self, obj):
        return resolve_media_url(obj.media_src, self.context.get("request"))

    def create(self, validated_data):
        media_file = validated_data.pop("media_file", None)
        if media_file is not None:
            validated_data["media_src"] = store_uploaded_file(media_file, "blog/covers")
        return super().create(validated_data)

    def update(self, instance, validated_data):
        media_file = validated_data.pop("media_file", None)
        if media_file is not None:
            validated_data["media_src"] = store_uploaded_file(media_file, "blog/covers")
        return super().update(instance, validated_data)


class EducationModuleAdminSerializer(serializers.ModelSerializer):
    id = serializers.IntegerField(required=False)

    class Meta:
        model = EducationModule
        fields = [
            "id",
            "sort_order",
            "title_ru",
            "title_bg",
            "description_ru",
            "description_bg",
        ]


class EducationItemAdminSerializer(serializers.ModelSerializer):
    program = EducationModuleAdminSerializer(many=True, required=False)
    image_src = serializers.SerializerMethodField()
    video_src = serializers.SerializerMethodField()
    image_file = serializers.FileField(write_only=True, required=False, allow_null=True)
    video_file = serializers.FileField(write_only=True, required=False, allow_null=True)

    class Meta:
        model = EducationItem
        fields = [
            "id",
            "item_type",
            "slug",
            "image_src",
            "video_src",
            "image_file",
            "video_file",
            "title_ru",
            "title_bg",
            "description_ru",
            "description_bg",
            "start_date",
            "price",
            "level",
            "goal",
            "item_format",
            "is_published",
            "program",
            "created_at",
            "updated_at",
        ]
        read_only_fields = ["id", "created_at", "updated_at"]

    def to_internal_value(self, data):
        if hasattr(data, "items"):
            mutable_data = {key: value for key, value in data.items()}
        else:
            mutable_data = dict(data)

        program = mutable_data.get("program")
        if isinstance(program, str):
            mutable_data["program"] = json.loads(program) if program else []
        return super().to_internal_value(mutable_data)

    def validate(self, attrs):
        attrs = super().validate(attrs)
        item_type = attrs.get("item_type", getattr(self.instance, "item_type", None))
        image_file = attrs.get("image_file")
        video_file = attrs.get("video_file")
        has_image = bool(image_file or getattr(self.instance, "image_src", ""))
        has_video = bool(video_file or getattr(self.instance, "video_src", ""))

        if item_type == EducationItem.TYPE_COURSE and not has_image:
            raise serializers.ValidationError({"image_file": "Course requires an image."})
        if item_type == EducationItem.TYPE_WEBINAR:
            if not has_image:
                raise serializers.ValidationError({"image_file": "Webinar requires an image."})
            if not has_video:
                raise serializers.ValidationError({"video_file": "Webinar requires a video."})

        return attrs

    def get_image_src(self, obj):
        return resolve_media_url(obj.image_src, self.context.get("request"))

    def get_video_src(self, obj):
        return resolve_media_url(obj.video_src, self.context.get("request"))

    def create(self, validated_data):
        modules_data = validated_data.pop("program", [])
        image_file = validated_data.pop("image_file", None)
        video_file = validated_data.pop("video_file", None)
        if image_file is not None:
            validated_data["image_src"] = store_uploaded_file(image_file, "education/images")
        if video_file is not None:
            validated_data["video_src"] = store_uploaded_file(video_file, "education/videos")
        if validated_data.get("item_type") == EducationItem.TYPE_COURSE:
            validated_data["video_src"] = ""
        education_item = EducationItem.objects.create(**validated_data)
        self._replace_modules(education_item, modules_data)
        return education_item

    def update(self, instance, validated_data):
        modules_data = validated_data.pop("program", None)
        image_file = validated_data.pop("image_file", None)
        video_file = validated_data.pop("video_file", None)
        for attr, value in validated_data.items():
            setattr(instance, attr, value)

        if image_file is not None:
            instance.image_src = store_uploaded_file(image_file, "education/images")
        if video_file is not None:
            instance.video_src = store_uploaded_file(video_file, "education/videos")
        if instance.item_type == EducationItem.TYPE_COURSE:
            instance.video_src = ""

        instance.save()

        if modules_data is not None:
            self._replace_modules(instance, modules_data)

        return instance

    def _replace_modules(self, education_item: EducationItem, modules_data: list[dict]):
        education_item.program.all().delete()
        if not modules_data:
            return

        module_objects = [
            EducationModule(
                education_item=education_item,
                sort_order=module_data.get("sort_order", index),
                title_ru=module_data["title_ru"],
                title_bg=module_data["title_bg"],
                description_ru=module_data["description_ru"],
                description_bg=module_data["description_bg"],
            )
            for index, module_data in enumerate(modules_data)
        ]
        EducationModule.objects.bulk_create(module_objects)
