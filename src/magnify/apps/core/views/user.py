"""View to manage users"""

from django.contrib.auth.password_validation import validate_password
from django.core.exceptions import ValidationError
from django.db import IntegrityError
from django.utils.translation import gettext_lazy as _

from rest_framework import viewsets
from rest_framework.permissions import BasePermission, IsAuthenticated
from rest_framework.views import Response

from magnify.apps.core.models import User
from magnify.apps.core.serializers import UserSerializer


class CustomUserPermission(BasePermission):
    """
    Allows permissions depending on the request
    """

    def has_permission(self, request, view):
        if request.method in ("DELETE", "PUT"):
            return request.user == view.get_object()
        if request.method == "GET":
            return IsAuthenticated() and not request.user.is_anonymous
        if request.method == "POST":
            return True
        return False


class UserViewSet(viewsets.ModelViewSet):
    """Set of views for user model"""

    lookup_field = "id"
    queryset = User.objects.all()
    serializer_class = UserSerializer

    permission_classes = (CustomUserPermission,)

    def create(self, request, *args, **kwargs):
        """
        Create a new user (needs to be overridden to verify and hash the password).
        """
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        try:
            validate_password(request.data["password"])
        except ValidationError as error:
            return Response({"password": error.messages}, status=400)
        try:
            new_user = User(
                username=serializer.validated_data["username"],
                email=serializer.validated_data["email"],
                password=request.data["password"],
                name=serializer.validated_data["name"],
            )
            new_user.full_clean()
        except ValidationError as error:
            errors = {key: _(value[0]) for key, value in error.message_dict.items()}
            return Response(errors, status=400)
        except IntegrityError as error:
            if "username" in str(error):
                return Response(
                    {"username": _("User already exists with this username")},
                    status=400,
                )
            if "email" in str(error):
                return Response(
                    {"email": _("User already exists with this email")}, status=400
                )
            return Response({"unknown": str(error)}, status=400)
        new_user = User.objects.create_user(
            username=serializer.validated_data["username"],
            email=serializer.validated_data["email"],
            password=request.data["password"],
            name=serializer.validated_data["name"],
        )
        return Response(serializer.data, status=201)

    def retrieve_me(self, request):
        """
        Retrieve the current user.
        """
        return Response(self.get_serializer(request.user).data)

    def change_password(self, request, *args, **kwargs):
        """
        Change a user's password.
        """
        user = self.get_object()
        if "old_password" not in request.data:
            return Response({"old_password": _("This field is required")}, status=400)
        if "new_password" not in request.data:
            return Response({"new_password": _("This field is required")}, status=400)
        if not user.check_password(request.data["old_password"]):
            return Response(
                {"old_password": _("Old password is not correct")}, status=400
            )
        try:
            validate_password(request.data["new_password"])
            user.set_password(request.data["new_password"])
            user.save()
            return Response(self.get_serializer(request.user).data)
        except ValidationError as error:
            return Response(error, status=400)

    def update_avatar(self, request, *args, **kwargs):
        """
        Update a user's avatar.
        """
        user = self.get_object()
        serializer = self.get_serializer(user, data=request.data)
        serializer.is_valid(raise_exception=True)
        user.avatar = request.data["avatar"]
        user.save()
        return Response(self.get_serializer(request.user).data)
