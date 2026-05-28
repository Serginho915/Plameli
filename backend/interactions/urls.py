from django.urls import path

from .views import (
    AvailableSlotsAPIView,
    ConsultationBookingCreateAPIView,
    EducationRegistrationCreateAPIView,
    FeedbackRequestCreateAPIView,
)

urlpatterns = [
    path("feedback/", FeedbackRequestCreateAPIView.as_view(), name="feedback-create"),
    path("education/registrations/", EducationRegistrationCreateAPIView.as_view(), name="education-registration-create"),
    path("consultations/bookings/", ConsultationBookingCreateAPIView.as_view(), name="consultation-booking-create"),
    path("consultations/available-slots/", AvailableSlotsAPIView.as_view(), name="consultation-available-slots"),
]
