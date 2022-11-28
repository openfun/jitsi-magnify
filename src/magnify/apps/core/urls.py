"""Urls declarations for Magnify's core app."""

from django.conf import settings
from django.urls import include, path, re_path

from drf_yasg import openapi
from drf_yasg.views import get_schema_view
from rest_framework import permissions
from rest_framework.routers import DefaultRouter
from rest_framework_simplejwt import views as jwt_views

from magnify.apps.core import api

SchemaView = get_schema_view(
    openapi.Info(
        title="Magnify API",
        default_version="v1",
        description="""This is the schema for the Magnify API.
            This app is used in the sandbox folder of the project.""",
    ),
    public=True,
    permission_classes=[permissions.AllowAny],
    url=settings.API_URL,
)

router = DefaultRouter()
router.register("rooms", api.RoomViewSet, basename="rooms")
router.register("users", api.UserViewSet, basename="users")
router.register("groups", api.GroupViewSet, basename="groups")
router.register(
    "room-user-accesses", api.RoomUserAccessViewSet, basename="room_user_accesses"
)
router.register(
    "room-group-accesses", api.RoomGroupAccessViewSet, basename="room_group_accesses"
)

# To appear on the swagger URL,
# the views need to extend APIView from the rest_framework.views package.
urlpatterns = [
    path("", include(router.urls)),
    path(
        "accounts/token-refresh/",
        jwt_views.TokenRefreshView.as_view(),
        name="token_refresh",
    ),
    # Swagger documentation
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
