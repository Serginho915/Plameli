from rest_framework import viewsets
from rest_framework.authentication import BasicAuthentication
from rest_framework.permissions import IsAdminUser
from rest_framework.response import Response
from rest_framework.views import APIView

from .admin_serializers import (
    BlogPostAdminSerializer,
    EducationItemAdminSerializer,
    store_uploaded_file,
)
from .models import BlogPost, EducationItem


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


class BlogAssetUploadAPIView(APIView):
    authentication_classes = [BasicAuthentication]
    permission_classes = [IsAdminUser]

    def post(self, request):
        file_obj = request.FILES.get("file")

        if file_obj is None:
            return Response({"detail": "File is required."}, status=400)

        path = store_uploaded_file(file_obj, "blog/content")
        absolute_url = request.build_absolute_uri(path)
        return Response({"url": absolute_url})


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
