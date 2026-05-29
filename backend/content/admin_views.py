from rest_framework import viewsets
from rest_framework.authentication import BasicAuthentication
from rest_framework.permissions import IsAdminUser
from rest_framework.response import Response
from rest_framework.views import APIView

from .admin_serializers import (
    BlogPostAdminSerializer,
    ContentPageAdminSerializer,
    EducationItemAdminSerializer,
)
from .models import BlogPost, ContentPage, EducationItem


class AdminMeAPIView(APIView):
    authentication_classes = [BasicAuthentication]
    permission_classes = [IsAdminUser]

    def get(self, request):
        return Response(
            {
                "id": request.user.id,
                "username": request.user.username,
                "is_staff": request.user.is_staff,
                "is_superuser": request.user.is_superuser,
            }
        )


class ContentPageAdminViewSet(viewsets.ModelViewSet):
    authentication_classes = [BasicAuthentication]
    permission_classes = [IsAdminUser]
    queryset = ContentPage.objects.all().order_by("slug")
    serializer_class = ContentPageAdminSerializer
    lookup_field = "id"


class BlogPostAdminViewSet(viewsets.ModelViewSet):
    authentication_classes = [BasicAuthentication]
    permission_classes = [IsAdminUser]
    queryset = BlogPost.objects.all().order_by("created_at")
    serializer_class = BlogPostAdminSerializer
    lookup_field = "id"


class EducationItemAdminViewSet(viewsets.ModelViewSet):
    authentication_classes = [BasicAuthentication]
    permission_classes = [IsAdminUser]
    queryset = EducationItem.objects.all().prefetch_related("program").order_by("created_at")
    serializer_class = EducationItemAdminSerializer
    lookup_field = "id"
