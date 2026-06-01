from rest_framework import serializers

from .models import BlogPost, EducationItem, EducationModule


class BlogPostAdminSerializer(serializers.ModelSerializer):
    class Meta:
        model = BlogPost
        fields = [
            "id",
            "external_id",
            "slug",
            "author",
            "tags",
            "media_src",
            "date_label_ru",
            "date_label_bg",
            "title_ru",
            "title_bg",
            "content_ru",
            "content_bg",
            "is_published",
            "created_at",
            "updated_at",
        ]
        read_only_fields = ["id", "created_at", "updated_at"]


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

    class Meta:
        model = EducationItem
        fields = [
            "id",
            "external_id",
            "item_type",
            "slug",
            "media_src",
            "poster",
            "title_ru",
            "title_bg",
            "description_ru",
            "description_bg",
            "start_date_ru",
            "start_date_bg",
            "price_ru",
            "price_bg",
            "level",
            "goal",
            "item_format",
            "level_label_ru",
            "level_label_bg",
            "goal_label_ru",
            "goal_label_bg",
            "format_label_ru",
            "format_label_bg",
            "is_published",
            "program",
            "created_at",
            "updated_at",
        ]
        read_only_fields = ["id", "created_at", "updated_at"]

    def create(self, validated_data):
        modules_data = validated_data.pop("program", [])
        education_item = EducationItem.objects.create(**validated_data)
        self._replace_modules(education_item, modules_data)
        return education_item

    def update(self, instance, validated_data):
        modules_data = validated_data.pop("program", None)
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
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
