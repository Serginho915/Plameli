from rest_framework import serializers

from .models import (
    AfterSalesCase,
    ChatConversation,
    ChatMessage,
    ClientNote,
    ClientProfile,
    ConsultationBooking,
    EducationRegistration,
    FeedbackRequest,
)


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


class ClientNoteAdminSerializer(serializers.ModelSerializer):
    author_username = serializers.CharField(source="author.username", read_only=True)

    class Meta:
        model = ClientNote
        fields = [
            "id",
            "client",
            "case",
            "author",
            "author_username",
            "text",
            "created_at",
            "updated_at",
        ]
        read_only_fields = ["author", "author_username", "created_at", "updated_at"]


class AfterSalesCaseAdminSerializer(serializers.ModelSerializer):
    client_name = serializers.CharField(source="client.name", read_only=True)
    client_email = serializers.EmailField(source="client.email", read_only=True)
    client_phone = serializers.CharField(source="client.phone", read_only=True)
    assigned_to_username = serializers.CharField(source="assigned_to.username", read_only=True)
    notes_list = ClientNoteAdminSerializer(many=True, read_only=True)

    class Meta:
        model = AfterSalesCase
        fields = [
            "id",
            "client",
            "client_name",
            "client_email",
            "client_phone",
            "case_type",
            "status",
            "priority",
            "due_at",
            "assigned_to",
            "assigned_to_username",
            "summary",
            "description",
            "source_model",
            "source_id",
            "notes_list",
            "created_at",
            "updated_at",
        ]
        read_only_fields = [
            "client_name",
            "client_email",
            "client_phone",
            "assigned_to_username",
            "source_model",
            "source_id",
            "created_at",
            "updated_at",
        ]


class ClientProfileAdminSerializer(serializers.ModelSerializer):
    cases = AfterSalesCaseAdminSerializer(many=True, read_only=True)
    notes_list = ClientNoteAdminSerializer(many=True, read_only=True)
    cases_count = serializers.IntegerField(read_only=True)
    open_cases_count = serializers.IntegerField(read_only=True)

    class Meta:
        model = ClientProfile
        fields = [
            "id",
            "language",
            "name",
            "email",
            "phone",
            "status",
            "source",
            "notes",
            "cases_count",
            "open_cases_count",
            "cases",
            "notes_list",
            "created_at",
            "updated_at",
        ]
        read_only_fields = ["cases_count", "open_cases_count", "created_at", "updated_at"]


class ChatMessageAdminSerializer(serializers.ModelSerializer):
    class Meta:
        model = ChatMessage
        fields = ["id", "role", "content", "created_at"]


class ChatConversationAdminListSerializer(serializers.ModelSerializer):
    class Meta:
        model = ChatConversation
        fields = [
            "id",
            "session_id",
            "language",
            "title",
            "last_user_message",
            "last_message_at",
            "message_count",
            "user_agent",
            "ip_address",
            "created_at",
            "updated_at",
        ]


class ChatConversationAdminDetailSerializer(ChatConversationAdminListSerializer):
    messages = ChatMessageAdminSerializer(many=True, read_only=True)

    class Meta(ChatConversationAdminListSerializer.Meta):
        fields = [*ChatConversationAdminListSerializer.Meta.fields, "messages"]
