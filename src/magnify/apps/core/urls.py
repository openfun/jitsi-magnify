"""Urls declarations for Magnify's core app."""

from django.urls import path, re_path

from drf_yasg import openapi
from drf_yasg.views import get_schema_view
from rest_framework import permissions

from magnify.apps.core import views

SchemaView = get_schema_view(
    openapi.Info(
        title="Magnify API",
        default_version="v1",
        description="""This is the schema for the Magnify API.
            This app is used in the sandbox folder of the project.""",
    ),
    public=True,
    permission_classes=[permissions.AllowAny],
)

# To appear on the swagger URL,
# the views need to extend APIView from the rest_framework.views package.
urlpatterns = [
    path("token/<room>", views.RoomTokenView.as_view()),
    re_path(
        r"^swagger(?P<format>\.json|\.yaml)$",
        SchemaView.without_ui(cache_timeout=0),
        name="schema-json",
    ),
    re_path(
        r"^swagger/$",
        SchemaView.with_ui("swagger", cache_timeout=0),
        name="schema-swagger-ui",
    ),
    re_path(
        r"^redoc/$", SchemaView.with_ui("redoc", cache_timeout=0), name="schema-redoc"
    ),
]
