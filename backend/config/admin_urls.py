from django.urls import include, path
from rest_framework.routers import DefaultRouter

from content.admin_views import (
    AdminMeAPIView,
    BlogAssetUploadAPIView,
    BlogPostAdminViewSet,
    EducationItemAdminViewSet,
)
from interactions.admin_views import (
    AfterSalesCaseAdminViewSet,
    ChatConversationAdminViewSet,
    ClientNoteAdminViewSet,
    ClientProfileAdminViewSet,
    ConsultationBookingAdminViewSet,
    EducationRegistrationAdminViewSet,
    FeedbackRequestAdminViewSet,
)

content_router = DefaultRouter()
content_router.register("blog-posts", BlogPostAdminViewSet, basename="admin-content-blog-posts")
content_router.register("education-items", EducationItemAdminViewSet, basename="admin-content-education-items")

requests_router = DefaultRouter()
requests_router.register("feedback", FeedbackRequestAdminViewSet, basename="admin-requests-feedback")
requests_router.register(
    "education-registrations",
    EducationRegistrationAdminViewSet,
    basename="admin-requests-education-registrations",
)
requests_router.register(
    "consultation-bookings",
    ConsultationBookingAdminViewSet,
    basename="admin-requests-consultation-bookings",
)

chat_router = DefaultRouter()
chat_router.register("conversations", ChatConversationAdminViewSet, basename="admin-chat-conversations")

after_sales_router = DefaultRouter()
after_sales_router.register("clients", ClientProfileAdminViewSet, basename="admin-after-sales-clients")
after_sales_router.register("cases", AfterSalesCaseAdminViewSet, basename="admin-after-sales-cases")
after_sales_router.register("notes", ClientNoteAdminViewSet, basename="admin-after-sales-notes")

urlpatterns = [
    path("me/", AdminMeAPIView.as_view(), name="admin-me"),
    path("content/blog-assets/", BlogAssetUploadAPIView.as_view(), name="admin-content-blog-assets"),
    path("content/", include(content_router.urls)),
    path("requests/", include(requests_router.urls)),
    path("chat/", include(chat_router.urls)),
    path("after-sales/", include(after_sales_router.urls)),
]
