from datetime import datetime
from decimal import Decimal

from rest_framework import serializers

from content.models import EducationItem
from .google_calendar import validate_slot_start

from .models import ConsultationBooking, EducationRegistration, FeedbackRequest


class FeedbackRequestCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = FeedbackRequest
        fields = ["language", "name", "email", "message", "phone", "source"]


class EducationRegistrationCreateSerializer(serializers.Serializer):
    language = serializers.CharField(default="ru", required=False)
    itemId = serializers.CharField(required=False, allow_blank=True)
    itemSlug = serializers.CharField(required=False, allow_blank=True)
    itemTitle = serializers.CharField(required=False, allow_blank=True)
    itemType = serializers.CharField(required=False, allow_blank=True)
    name = serializers.CharField(max_length=255)
    email = serializers.EmailField()
    phone = serializers.CharField(max_length=32)

    def validate_phone(self, value):
        digits = "".join(ch for ch in value if ch.isdigit())
        if len(digits) < 8:
            raise serializers.ValidationError("Phone number is too short.")
        return value

    def create(self, validated_data):
        item_external_id = validated_data.get("itemId", "")
        item_slug = validated_data.get("itemSlug", "")
        item_title = validated_data.get("itemTitle", "")
        item_type = validated_data.get("itemType", "")

        education_item = None
        if item_external_id:
            education_item = EducationItem.objects.filter(external_id=item_external_id).first()
        elif item_slug:
            education_item = EducationItem.objects.filter(slug=item_slug).first()

        if education_item:
            item_external_id = education_item.external_id
            item_slug = education_item.slug
            item_title = item_title or education_item.title_ru
            item_type = item_type or education_item.item_type

        return EducationRegistration.objects.create(
            language=validated_data.get("language", "ru"),
            education_item=education_item,
            item_external_id=item_external_id,
            item_slug=item_slug,
            item_title=item_title,
            item_type=item_type,
            name=validated_data["name"],
            email=validated_data["email"],
            phone=validated_data["phone"],
            payload=validated_data,
        )


class ConsultationBookingCreateSerializer(serializers.Serializer):
    language = serializers.ChoiceField(choices=["bg", "ru", "en"], default="bg", required=False)
    consultationFormat = serializers.ChoiceField(choices=["standard", "priority"])
    meetingType = serializers.ChoiceField(choices=["sofia", "zoom"])
    slotStart = serializers.CharField()
    name = serializers.CharField(max_length=255)
    phone = serializers.CharField(max_length=32)
    email = serializers.EmailField()
    message = serializers.CharField(required=False, allow_blank=True)

    def validate_phone(self, value):
        digits = "".join(ch for ch in value if ch.isdigit())
        if len(digits) < 8:
            raise serializers.ValidationError("Phone number is too short.")
        return value

    def validate(self, attrs):
        try:
            slot_start = datetime.fromisoformat(attrs["slotStart"].replace("Z", "+00:00"))
            if slot_start.tzinfo is None:
                raise ValueError("slotStart must include a timezone offset.")
            attrs["slotStart"] = slot_start
            attrs["slot"] = validate_slot_start(slot_start)
        except (TypeError, ValueError) as exc:
            raise serializers.ValidationError({"slotStart": str(exc)}) from exc
        return attrs

    def create(self, validated_data):
        slot = validated_data.pop("slot")
        validated_data.pop("slotStart")
        amount = Decimal("50.00") if validated_data["consultationFormat"] == "standard" else Decimal("85.00")
        return ConsultationBooking.objects.create(
            language=validated_data.get("language", "ru"),
            consultation_format=validated_data["consultationFormat"],
            meeting_type=validated_data["meetingType"],
            selected_date=slot.start.date(),
            selected_time=slot.start.strftime("%H:%M"),
            name=validated_data["name"],
            phone=validated_data["phone"],
            email=validated_data["email"],
            message=validated_data.get("message", ""),
            total_amount_eur=amount,
            payload=validated_data,
        )
