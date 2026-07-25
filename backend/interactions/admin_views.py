import uuid

from django.db.models import Count, Q
from rest_framework.decorators import action
from rest_framework import viewsets
from rest_framework.permissions import IsAdminUser
from rest_framework.response import Response

from config.admin_auth import SilentBasicAuthentication

from .after_sales import sync_after_sales_from_requests
from .admin_serializers import (
    AfterSalesCaseAdminSerializer,
    ChatConversationAdminDetailSerializer,
    ChatConversationAdminListSerializer,
    ClientNoteAdminSerializer,
    ClientProfileAdminSerializer,
    ConsultationBookingAdminSerializer,
    EducationRegistrationAdminSerializer,
    FeedbackRequestAdminSerializer,
)
from .models import (
    AfterSalesCase,
    ChatConversation,
    ClientNote,
    ClientProfile,
    ConsultationBooking,
    EducationRegistration,
    FeedbackRequest,
)


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


class ClientProfileAdminViewSet(viewsets.ModelViewSet):
    authentication_classes = [SilentBasicAuthentication]
    permission_classes = [IsAdminUser]
    serializer_class = ClientProfileAdminSerializer
    lookup_field = "id"

    def get_queryset(self):
        queryset = (
            ClientProfile.objects.annotate(
                cases_count=Count("cases", distinct=True),
                open_cases_count=Count(
                    "cases",
                    filter=~Q(cases__status__in=[AfterSalesCase.STATUS_DONE, AfterSalesCase.STATUS_CANCELLED]),
                    distinct=True,
                ),
            )
            .prefetch_related("cases__notes_list", "notes_list")
            .order_by("-updated_at")
        )
        search = self.request.query_params.get("search", "").strip()
        status = self.request.query_params.get("status", "").strip()

        if search:
            queryset = queryset.filter(
                Q(name__icontains=search)
                | Q(email__icontains=search)
                | Q(phone__icontains=search)
                | Q(notes__icontains=search)
            )

        if status:
            queryset = queryset.filter(status=status)

        return queryset

    @action(detail=False, methods=["post"], url_path="sync")
    def sync(self, request):
        sync_after_sales_from_requests()
        return Response({"detail": "After-sales clients and cases synced."})


class AfterSalesCaseAdminViewSet(viewsets.ModelViewSet):
    authentication_classes = [SilentBasicAuthentication]
    permission_classes = [IsAdminUser]
    serializer_class = AfterSalesCaseAdminSerializer
    lookup_field = "id"

    def get_queryset(self):
        queryset = (
            AfterSalesCase.objects.select_related("client", "assigned_to")
            .prefetch_related("notes_list")
            .order_by("-updated_at")
        )
        status = self.request.query_params.get("status", "").strip()
        priority = self.request.query_params.get("priority", "").strip()
        search = self.request.query_params.get("search", "").strip()

        if status:
            queryset = queryset.filter(status=status)
        if priority:
            queryset = queryset.filter(priority=priority)
        if search:
            queryset = queryset.filter(
                Q(summary__icontains=search)
                | Q(description__icontains=search)
                | Q(client__name__icontains=search)
                | Q(client__email__icontains=search)
                | Q(client__phone__icontains=search)
            )

        return queryset


class ClientNoteAdminViewSet(viewsets.ModelViewSet):
    authentication_classes = [SilentBasicAuthentication]
    permission_classes = [IsAdminUser]
    serializer_class = ClientNoteAdminSerializer
    lookup_field = "id"

    def get_queryset(self):
        queryset = ClientNote.objects.select_related("client", "case", "author").all()
        client_id = self.request.query_params.get("client", "").strip()
        case_id = self.request.query_params.get("case", "").strip()

        if client_id:
            queryset = queryset.filter(client_id=client_id)
        if case_id:
            queryset = queryset.filter(case_id=case_id)

        return queryset

    def perform_create(self, serializer):
        serializer.save(author=self.request.user)


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
