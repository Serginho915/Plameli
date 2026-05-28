from calendar import monthrange
from datetime import date

from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView

from .serializers import (
	ConsultationBookingCreateSerializer,
	EducationRegistrationCreateSerializer,
	FeedbackRequestCreateSerializer,
)


class FeedbackRequestCreateAPIView(APIView):
	def post(self, request):
		serializer = FeedbackRequestCreateSerializer(data=request.data)
		serializer.is_valid(raise_exception=True)
		instance = serializer.save()
		return Response({"id": instance.id, "status": "created"}, status=status.HTTP_201_CREATED)


class EducationRegistrationCreateAPIView(APIView):
	def post(self, request):
		serializer = EducationRegistrationCreateSerializer(data=request.data)
		serializer.is_valid(raise_exception=True)
		instance = serializer.save()
		return Response({"id": instance.id, "status": "created"}, status=status.HTTP_201_CREATED)


class ConsultationBookingCreateAPIView(APIView):
	def post(self, request):
		serializer = ConsultationBookingCreateSerializer(data=request.data)
		serializer.is_valid(raise_exception=True)
		instance = serializer.save()
		return Response(
			{
				"id": instance.id,
				"status": "created",
				"amount": str(instance.total_amount_eur),
			},
			status=status.HTTP_201_CREATED,
		)


class AvailableSlotsAPIView(APIView):
	def get(self, request):
		try:
			year = int(request.query_params.get("year", date.today().year))
			month = int(request.query_params.get("month", date.today().month))
		except ValueError:
			return Response({"detail": "Invalid year or month."}, status=status.HTTP_400_BAD_REQUEST)

		if month < 1 or month > 12:
			return Response({"detail": "Month must be between 1 and 12."}, status=status.HTTP_400_BAD_REQUEST)

		day_count = monthrange(year, month)[1]
		slots = {}
		for day in range(1, day_count + 1):
			current = date(year, month, day)
			day_of_week = current.weekday()  # Monday=0
			key = current.isoformat()
			if day_of_week >= 5:
				slots[key] = []
				continue

			if day % 3 == 0:
				slots[key] = ["09:00", "11:00", "14:00", "16:00"]
			elif day % 2 == 0:
				slots[key] = ["10:00", "12:00", "15:00", "17:00"]
			else:
				slots[key] = ["09:00", "10:00", "13:00", "15:00", "18:00"]

		return Response(slots)

# Create your views here.
