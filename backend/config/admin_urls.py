from django.urls import include, path
from rest_framework.routers import DefaultRouter

from content.admin_views import (
    AdminMeAPIView,
    BlogPostAdminViewSet,
    EducationItemAdminViewSet,
)
from interactions.admin_views import (
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

urlpatterns = [
    path("me/", AdminMeAPIView.as_view(), name="admin-me"),
    path("content/", include(content_router.urls)),
    path("requests/", include(requests_router.urls)),
]
