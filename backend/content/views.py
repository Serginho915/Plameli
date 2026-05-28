from rest_framework import viewsets
from rest_framework.decorators import action
from rest_framework.response import Response

from .models import BlogPost, ContentPage, EducationItem
from .serializers import (
	LocalizedBlogPostSerializer,
	LocalizedEducationItemSerializer,
	LocalizedPageSerializer,
)


def get_lang(request):
	return request.query_params.get("lang", "ru")


class ContentPageViewSet(viewsets.ReadOnlyModelViewSet):
	queryset = ContentPage.objects.filter(is_published=True)
	serializer_class = LocalizedPageSerializer
	lookup_field = "slug"

	def get_serializer_context(self):
		context = super().get_serializer_context()
		context["lang"] = get_lang(self.request)
		return context


class BlogPostViewSet(viewsets.ReadOnlyModelViewSet):
	queryset = BlogPost.objects.filter(is_published=True)
	serializer_class = LocalizedBlogPostSerializer
	lookup_field = "slug"

	def get_serializer_context(self):
		context = super().get_serializer_context()
		context["lang"] = get_lang(self.request)
		return context


class EducationItemViewSet(viewsets.ReadOnlyModelViewSet):
	queryset = EducationItem.objects.filter(is_published=True).prefetch_related("program")
	serializer_class = LocalizedEducationItemSerializer
	lookup_field = "slug"

	def get_queryset(self):
		queryset = super().get_queryset()
		item_type = self.request.query_params.get("type")
		level = self.request.query_params.get("level")
		goal = self.request.query_params.get("goal")
		item_format = self.request.query_params.get("format")

		if item_type:
			queryset = queryset.filter(item_type=item_type)
		if level:
			queryset = queryset.filter(level=level)
		if goal:
			queryset = queryset.filter(goal=goal)
		if item_format:
			normalized = item_format.lower()
			queryset = queryset.filter(item_format=normalized)
		return queryset

	def get_serializer_context(self):
		context = super().get_serializer_context()
		context["lang"] = get_lang(self.request)
		return context

	@action(detail=False, methods=["get"], url_path="courses")
	def courses(self, request):
		queryset = self.filter_queryset(self.get_queryset().filter(item_type=EducationItem.TYPE_COURSE))
		serializer = self.get_serializer(queryset, many=True)
		return Response(serializer.data)

	@action(detail=False, methods=["get"], url_path="webinars")
	def webinars(self, request):
		queryset = self.filter_queryset(self.get_queryset().filter(item_type=EducationItem.TYPE_WEBINAR))
		serializer = self.get_serializer(queryset, many=True)
		return Response(serializer.data)

# Create your views here.
