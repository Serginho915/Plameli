from django.urls import path

from .stripe_views import (
    StripeConsultationCancelView,
    StripeConsultationCheckoutView,
    StripeCreateCheckoutView,
    StripeWebhookView,
)
from .views import (
    AvailableSlotsAPIView,
    FeedbackRequestCreateAPIView,
)

urlpatterns = [
    path("feedback/", FeedbackRequestCreateAPIView.as_view(), name="feedback-create"),
    path("education/registrations/", StripeCreateCheckoutView.as_view(), name="education-registration-create"),
    path("consultations/bookings/", StripeConsultationCheckoutView.as_view(), name="consultation-booking-create"),
    path("consultations/available-slots/", AvailableSlotsAPIView.as_view(), name="consultation-available-slots"),
    path("consultation/book", StripeConsultationCheckoutView.as_view(), name="consultation-book"),
    path("consultation/availability", AvailableSlotsAPIView.as_view(), name="consultation-availability"),
    path("stripe/create-checkout/", StripeCreateCheckoutView.as_view(), name="stripe-create-checkout"),
    path("stripe/consultation-checkout/", StripeConsultationCheckoutView.as_view(), name="stripe-consultation-checkout"),
    path("stripe/consultation-cancel/", StripeConsultationCancelView.as_view(), name="stripe-consultation-cancel"),
    path("stripe/webhook/", StripeWebhookView.as_view(), name="stripe-webhook"),
]
