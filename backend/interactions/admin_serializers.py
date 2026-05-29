from rest_framework import serializers

from .models import ConsultationBooking, EducationRegistration, FeedbackRequest


class FeedbackRequestAdminSerializer(serializers.ModelSerializer):
    class Meta:
        model = FeedbackRequest
        fields = "__all__"


class EducationRegistrationAdminSerializer(serializers.ModelSerializer):
    class Meta:
        model = EducationRegistration
        fields = "__all__"


class ConsultationBookingAdminSerializer(serializers.ModelSerializer):
    class Meta:
        model = ConsultationBooking
        fields = "__all__"
