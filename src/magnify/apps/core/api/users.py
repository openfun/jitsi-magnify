"""Magnify users API endpoints"""
from django.contrib.auth import authenticate
from django.core.cache import cache
from django.db.models import Q
from django.utils.text import slugify

from rest_framework import decorators as drf_decorators
from rest_framework import exceptions as drf_exceptions
from rest_framework import mixins, permissions, response, viewsets

from .. import models
from .. import permissions as magnify_permissions
from .. import serializers


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

    permission_classes = [magnify_permissions.IsSelf]
    queryset = models.User.objects.all()

    def get_serializer_class(self):
        """
        Return the serializer class. Creation is a special case because we received the
        password in 2 repeated fields.
        """
        if self.action == "create":
            return serializers.RegistrationSerializer

        return serializers.UserSerializer

    def list(self, request, *args, **kwargs):
        """Limit listed users by a query with throttle protection."""
        user = self.request.user
        query = self.request.GET.get("q", "")
        queryset = self.filter_queryset(self.get_queryset()).filter(
            Q(username=slugify(query)) | Q(email=query.lower())
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
                raise drf_exceptions.Throttled()

        serializer = self.get_serializer(queryset, many=True)
        return response.Response(serializer.data)

    @staticmethod
    @drf_decorators.action(
        methods=["get"],
        detail=False,
    )
    # pylint: disable=invalid-name
    def me(request):
        """Return the logged-in user."""
        if not request.user.is_authenticated:
            return response.Response({"msg": "User is anonymous"}, status=401)

        serializer = serializers.UserSerializer(
            instance=request.user, context={"request": request}
        )
        return response.Response(serializer.data, status=200)

    @staticmethod
    @drf_decorators.action(
        methods=["post"],
        detail=False,
    )
    def login(request):
        """Endpoint to login."""
        if "username" not in request.data or "password" not in request.data:
            return response.Response({"msg": "Credentials missing"}, status=400)

        user = authenticate(
            request,
            username=request.data["username"],
            password=request.data["password"],
        )
        if user is not None:
            serializer = serializers.RegistrationSerializer(instance=user)
            return response.Response(serializer.data, status=200)

        return response.Response({"msg": "Invalid credentials"}, status=401)

    @staticmethod
    @drf_decorators.action(
        methods=["post"],
        detail=False,
        url_path="change-password",
        permission_classes=[permissions.IsAuthenticated],
    )
    def change_password(request):
        """Endpoint to change once's password."""
        serializer = serializers.PasswordChangeSerializer(
            context={"request": request}, data=request.data
        )
        serializer.is_valid(raise_exception=True)

        user = request.user
        user.set_password(serializer.validated_data["new_password"])
        user.save()
        return response.Response(status=204)
