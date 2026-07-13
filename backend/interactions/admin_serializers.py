from rest_framework import serializers

from .models import (
    ChatConversation,
    ChatMessage,
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
