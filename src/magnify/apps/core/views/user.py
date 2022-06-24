"""View to manage users"""

from django.contrib.auth.password_validation import validate_password
from django.core.exceptions import ValidationError
from django.db import IntegrityError
from django.utils.translation import gettext_lazy as _

from drf_yasg.utils import swagger_auto_schema
from rest_framework.permissions import IsAuthenticated
from rest_framework.views import APIView, Response

from magnify.apps.core.models import User
from magnify.apps.core.serializers import (
    UserCreateResponseErrorSerializer,
    UserCreateResponseSuccessSerializer,
    UserCreateSerializer,
)


class UserView(APIView):
    """
    View for a user.
    """

    permission_classes = (IsAuthenticated,)

    def get(self, request, user_id):
        """
        Get a user's information.
        """
        try:
            user = User.objects.get(id=user_id)
            return Response(user.username)
        except User.DoesNotExist:
            return Response("User does not exist", status=404)


class UserCreateView(APIView):
    """
    View for creating a user
    """

    @swagger_auto_schema(
        request_body=UserCreateSerializer,
        responses={
            201: UserCreateResponseSuccessSerializer,
            400: UserCreateResponseErrorSerializer,
        },
    )
    def post(self, request):
        """
        Create a user.
        """
        # Password validation must be handled elsewhere
        # because the ValidationError is not of the same type
        try:
            # Password validators are to be found in settings
            validate_password(request.data.get("password"))
        except ValidationError as error:
            return Response({"password": message for message in error}, status=400)
        try:
            new_user = User(
                username=request.data.get("username"),
                email=request.data.get("email"),
                password=request.data.get("password"),
                name=request.data.get("name"),
            )
            # Run verificators on new instance
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
            request.data.get("username"),
            request.data.get("email"),
            request.data.get("password"),
            name=request.data.get("name"),
        )
        return Response(new_user.id, status=201)
