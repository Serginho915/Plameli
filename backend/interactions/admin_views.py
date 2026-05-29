from rest_framework import viewsets
from rest_framework.authentication import BasicAuthentication
from rest_framework.permissions import IsAdminUser

from .admin_serializers import (
    ConsultationBookingAdminSerializer,
    EducationRegistrationAdminSerializer,
    FeedbackRequestAdminSerializer,
)
from .models import ConsultationBooking, EducationRegistration, FeedbackRequest


class FeedbackRequestAdminViewSet(viewsets.ReadOnlyModelViewSet):
    authentication_classes = [BasicAuthentication]
    permission_classes = [IsAdminUser]
    queryset = FeedbackRequest.objects.all().order_by("-created_at")
    serializer_class = FeedbackRequestAdminSerializer
    lookup_field = "id"


class EducationRegistrationAdminViewSet(viewsets.ReadOnlyModelViewSet):
    authentication_classes = [BasicAuthentication]
    permission_classes = [IsAdminUser]
    queryset = EducationRegistration.objects.select_related("education_item").all().order_by("-created_at")
    serializer_class = EducationRegistrationAdminSerializer
    lookup_field = "id"


class ConsultationBookingAdminViewSet(viewsets.ReadOnlyModelViewSet):
    authentication_classes = [BasicAuthentication]
    permission_classes = [IsAdminUser]
    queryset = ConsultationBooking.objects.all().order_by("-created_at")
    serializer_class = ConsultationBookingAdminSerializer
    lookup_field = "id"
