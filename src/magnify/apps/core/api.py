"""Magnify core API endpoints"""
from django.contrib.auth import authenticate
from django.core.cache import cache
from django.core.exceptions import ValidationError
from django.db.models import Q

from rest_framework import mixins, permissions, viewsets
from rest_framework.decorators import action
from rest_framework.exceptions import Throttled
from rest_framework.exceptions import ValidationError as DRFValidationError
from rest_framework.response import Response
from rest_framework.views import exception_handler as drf_exception_handler

from .models import Room, RoomGroupAccess, RoomUserAccess, User
from .permissions import IsObjectAdministrator, IsRoomAdministrator, IsSelf
from .serializers import (
    PasswordChangeSerializer,
    RegistrationSerializer,
    RoomGroupAccessSerializer,
    RoomSerializer,
    RoomUserAccessSerializer,
    UserSerializer,
)
from .utils import get_tokens_for_user


def exception_handler(exc, context):
    """Handle Django ValidationError as an accepted exception.

    For the parameters, see ``exception_handler``
    This code comes from twidi's gist:
    https://gist.github.com/twidi/9d55486c36b6a51bdcb05ce3a763e79f
    """
    if isinstance(exc, ValidationError):
        if hasattr(exc, "message_dict"):
            detail = exc.message_dict
        elif hasattr(exc, "message"):
            detail = exc.message
        elif hasattr(exc, "messages"):
            detail = exc.messages

        exc = DRFValidationError(detail=detail)

    return drf_exception_handler(exc, context)


class UserViewSet(
    mixins.CreateModelMixin,
    mixins.DestroyModelMixin,
    mixins.RetrieveModelMixin,
    mixins.UpdateModelMixin,
    viewsets.GenericViewSet,
):
    """
    API endpoints to access and perform actions on rooms.
    """

    permission_classes = [IsSelf]
    queryset = User.objects.all()

    def get_serializer_class(self):
        """
        Return the serializer class. Creation is a special case because we received the
        password in 2 repeated fields.
        """
        if self.action == "create":
            return RegistrationSerializer

        return UserSerializer

    def list(self, request, *args, **kwargs):
        """Limit listed users by a query with throttle protection."""
        user = self.request.user
        query = self.request.GET.get("q", "")
        queryset = self.filter_queryset(self.get_queryset()).filter(
            Q(username=query) | Q(email=query)
        )

        if not user.is_authenticated:
            return queryset.none()

        # Brute force protection
        key_base = f"throttle-user-list-{user.id!s}"
        key_hour = f"{key_base:s}-minute"
        key_day = f"{key_base:s}-day"

        if queryset:
            cache.delete(key_hour)
            cache.delete(key_day)
        else:
            try:
                count_hour = cache.incr(key_hour)
            except ValueError:
                cache.set(key_hour, 1, 3600)
                count_hour = 1

            try:
                count_day = cache.incr(key_day)
            except ValueError:
                cache.set(key_day, 1, 86400)
                count_day = 1

            if count_hour > 3 or count_day > 10:
                raise Throttled()

        serializer = self.get_serializer(queryset, many=True)
        return Response(serializer.data)

    @staticmethod
    @action(
        methods=["get"],
        detail=False,
    )
    # pylint: disable=invalid-name
    def me(request):
        """Return the logged-in user."""
        if not request.user.is_authenticated:
            return Response({"msg": "User is anonymous"}, status=401)

        serializer = UserSerializer(instance=request.user, context={"request": request})
        return Response(serializer.data, status=200)

    @staticmethod
    @action(
        methods=["post"],
        detail=False,
    )
    def login(request):
        """Endpoint to login."""
        if "username" not in request.data or "password" not in request.data:
            return Response({"msg": "Credentials missing"}, status=400)

        user = authenticate(
            request,
            username=request.data["username"],
            password=request.data["password"],
        )
        if user is not None:
            auth_data = get_tokens_for_user(user)
            return Response({"msg": "Login success", **auth_data}, status=200)

        return Response({"msg": "Invalid credentials"}, status=401)

    @staticmethod
    @action(
        methods=["post"],
        detail=False,
        url_path="change-password",
        permission_classes=[permissions.IsAuthenticated],
    )
    def change_password(request):
        """Endpoint to change once's password."""
        serializer = PasswordChangeSerializer(
            context={"request": request}, data=request.data
        )
        serializer.is_valid(raise_exception=True)

        user = request.user
        user.set_password(serializer.validated_data["new_password"])
        user.save()
        return Response(status=204)


class RoomViewSet(
    mixins.CreateModelMixin,
    mixins.DestroyModelMixin,
    mixins.RetrieveModelMixin,
    mixins.UpdateModelMixin,
    viewsets.GenericViewSet,
):
    """
    API endpoints to access and perform actions on rooms.
    """

    permission_classes = [IsObjectAdministrator]
    queryset = Room.objects.all()
    serializer_class = RoomSerializer

    def list(self, request, *args, **kwargs):
        """Limit listed rooms to the ones related to the authenticated user."""
        user = self.request.user
        queryset = self.filter_queryset(self.get_queryset())

        if user.is_authenticated:
            queryset = queryset.filter(
                Q(is_public=True) | Q(users=user) | Q(groups__user_accesses__user=user)
            )
        else:
            queryset = queryset.filter(is_public=True)

        page = self.paginate_queryset(queryset)
        if page is not None:
            serializer = self.get_serializer(page, many=True)
            return self.get_paginated_response(serializer.data)

        serializer = self.get_serializer(queryset, many=True)
        return Response(serializer.data)

    def perform_create(self, serializer):
        """Set the current user as administrators of the newly created room."""
        room = serializer.save()
        RoomUserAccess.objects.create(
            room=room, user=self.request.user, is_administrator=True
        )

    @action(
        methods=["post"],
        detail=True,
        url_path="users",
        permission_classes=[permissions.IsAuthenticated],
    )
    # pylint: disable=unused-argument,invalid-name
    def users(self, request, pk=None):
        """Adds a user in a room."""
        room = self.get_object()
        serializer = RoomUserAccessSerializer(
            data={
                "room": room.id,
                "user": request.data.get("user"),
                "is_administrator": request.data.get("is_administrator"),
            },
            context={"request": request},
        )
        serializer.is_valid(raise_exception=True)
        serializer.save()
        headers = self.get_success_headers(serializer.data)
        return Response(serializer.data, status=201, headers=headers)

    @action(
        methods=["get", "put", "delete"],
        detail=True,
        url_path="users/(?P<user_pk>[^/.]+)",
        permission_classes=[IsRoomAdministrator],
    )
    # pylint: disable=unused-argument,invalid-name
    def user(self, request, user_pk, pk=None):
        """Get, update, or delete a user of a room."""
        room = self.get_object()
        room_user_access = RoomUserAccess.objects.get(room=room, user__pk=user_pk)

        if request.method == "DELETE":
            room_user_access.delete()
            return Response(status=204)

        if request.method == "GET":
            serializer = RoomUserAccessSerializer(room_user_access)
            return Response(serializer.data)

        if request.method == "PUT":
            serializer = RoomUserAccessSerializer(
                room_user_access,
                data={
                    "room": room.id,
                    "user": user_pk,
                    "is_administrator": request.data.get("is_administrator"),
                },
                context={"request": request},
            )
            serializer.is_valid(raise_exception=True)
            serializer.save()
            return Response(serializer.data)

        return Response(status=405)

    @action(
        methods=["post"],
        detail=True,
        url_path="groups",
        permission_classes=[permissions.IsAuthenticated],
    )
    # pylint: disable=unused-argument,invalid-name
    def groups(self, request, pk=None):
        """Adds a group in a room."""
        room = self.get_object()
        serializer = RoomGroupAccessSerializer(
            data={
                "room": room.id,
                "group": request.data.get("group"),
                "is_administrator": request.data.get("is_administrator"),
            },
            context={"request": request},
        )
        serializer.is_valid(raise_exception=True)
        serializer.save()
        headers = self.get_success_headers(serializer.data)
        return Response(serializer.data, status=201, headers=headers)

    @action(
        methods=["get", "put", "delete"],
        detail=True,
        url_path="groups/(?P<group_pk>[^/.]+)",
        permission_classes=[IsRoomAdministrator],
    )
    # pylint: disable=unused-argument,invalid-name
    def group(self, request, group_pk, pk=None):
        """Get, update, or delete a group of a room."""
        room = self.get_object()
        room_group_access = RoomGroupAccess.objects.get(room=room, group__pk=group_pk)

        if request.method == "DELETE":
            room_group_access.delete()
            return Response(status=204)

        if request.method == "GET":
            serializer = RoomGroupAccessSerializer(room_group_access)
            return Response(serializer.data)

        if request.method == "PUT":
            serializer = RoomGroupAccessSerializer(
                room_group_access,
                data={
                    "room": room.id,
                    "group": group_pk,
                    "is_administrator": request.data.get("is_administrator"),
                },
                context={"request": request},
            )
            serializer.is_valid(raise_exception=True)
            serializer.save()
            return Response(serializer.data)

        return Response(status=405)
