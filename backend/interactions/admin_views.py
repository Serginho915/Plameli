import uuid

from django.db.models import Q
from rest_framework import viewsets
from rest_framework.permissions import IsAdminUser

from config.admin_auth import SilentBasicAuthentication

from .admin_serializers import (
    ChatConversationAdminDetailSerializer,
    ChatConversationAdminListSerializer,
    ConsultationBookingAdminSerializer,
    EducationRegistrationAdminSerializer,
    FeedbackRequestAdminSerializer,
)
from .models import ChatConversation, ConsultationBooking, EducationRegistration, FeedbackRequest


class FeedbackRequestAdminViewSet(viewsets.ReadOnlyModelViewSet):
    authentication_classes = [SilentBasicAuthentication]
    permission_classes = [IsAdminUser]
    queryset = FeedbackRequest.objects.all().order_by("-created_at")
    serializer_class = FeedbackRequestAdminSerializer
    lookup_field = "id"


class EducationRegistrationAdminViewSet(viewsets.ReadOnlyModelViewSet):
    authentication_classes = [SilentBasicAuthentication]
    permission_classes = [IsAdminUser]
    queryset = EducationRegistration.objects.select_related("education_item").all().order_by("-created_at")
    serializer_class = EducationRegistrationAdminSerializer
    lookup_field = "id"


class ConsultationBookingAdminViewSet(viewsets.ReadOnlyModelViewSet):
    authentication_classes = [SilentBasicAuthentication]
    permission_classes = [IsAdminUser]
    queryset = ConsultationBooking.objects.all().order_by("-created_at")
    serializer_class = ConsultationBookingAdminSerializer
    lookup_field = "id"


class ChatConversationAdminViewSet(viewsets.ReadOnlyModelViewSet):
    authentication_classes = [SilentBasicAuthentication]
    permission_classes = [IsAdminUser]
    queryset = ChatConversation.objects.prefetch_related("messages").all()
    lookup_field = "session_id"

    def get_queryset(self):
        queryset = super().get_queryset()
        search = self.request.query_params.get("search", "").strip()

        if not search:
            return queryset

        query = (
            Q(title__icontains=search)
            | Q(last_user_message__icontains=search)
            | Q(messages__content__icontains=search)
            | Q(ip_address__icontains=search)
            | Q(user_agent__icontains=search)
        )
        try:
            query |= Q(session_id=uuid.UUID(search))
        except ValueError:
            pass

        return queryset.filter(query).distinct()

    def get_serializer_class(self):
        if self.action == "retrieve":
            return ChatConversationAdminDetailSerializer
        return ChatConversationAdminListSerializer
