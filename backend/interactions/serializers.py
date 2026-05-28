from datetime import date
from decimal import Decimal

from rest_framework import serializers

from content.models import EducationItem

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
    language = serializers.CharField(default="ru", required=False)
    consultationFormat = serializers.ChoiceField(choices=["standard", "priority"])
    meetingType = serializers.ChoiceField(choices=["sofia", "zoom"])
    selectedDate = serializers.DateField()
    selectedTime = serializers.CharField(max_length=16)
    name = serializers.CharField(max_length=255)
    phone = serializers.CharField(max_length=32)
    email = serializers.EmailField()
    message = serializers.CharField(required=False, allow_blank=True)

    def validate_phone(self, value):
        digits = "".join(ch for ch in value if ch.isdigit())
        if len(digits) < 8:
            raise serializers.ValidationError("Phone number is too short.")
        return value

    def validate_selectedDate(self, value):
        if value < date.today():
            raise serializers.ValidationError("Date cannot be in the past.")
        return value

    def create(self, validated_data):
        amount = Decimal("50.00") if validated_data["consultationFormat"] == "standard" else Decimal("85.00")
        return ConsultationBooking.objects.create(
            language=validated_data.get("language", "ru"),
            consultation_format=validated_data["consultationFormat"],
            meeting_type=validated_data["meetingType"],
            selected_date=validated_data["selectedDate"],
            selected_time=validated_data["selectedTime"],
            name=validated_data["name"],
            phone=validated_data["phone"],
            email=validated_data["email"],
            message=validated_data.get("message", ""),
            total_amount_eur=amount,
            payload=validated_data,
        )
