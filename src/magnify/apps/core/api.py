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

from .models import Room, User
from .permissions import IsObjectAdministrator, IsSelf
from .serializers import (
    PasswordChangeSerializer,
    RegistrationSerializer,
    RoomSerializer,
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
        """Limit listed rooms to the ones in which the authenticated user is administator."""
        queryset = self.filter_queryset(self.get_queryset())
        if self.request.user.is_authenticated:
            queryset = queryset.filter(administrators=self.request.user)

        page = self.paginate_queryset(queryset)
        if page is not None:
            serializer = self.get_serializer(page, many=True)
            return self.get_paginated_response(serializer.data)

        serializer = self.get_serializer(queryset, many=True)
        return Response(serializer.data)

    def perform_create(self, serializer):
        """Set the current user as administrators of the newly created room."""
        room = serializer.save()
        room.administrators.add(self.request.user)
