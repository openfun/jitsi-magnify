"""Authentication for Magnify's core app."""
from django.conf import settings
from django.utils.translation import gettext_lazy as _

from rest_framework_simplejwt.authentication import JWTAuthentication
from rest_framework_simplejwt.exceptions import InvalidToken
from rest_framework_simplejwt.settings import api_settings


class DelegatedJWTAuthentication(JWTAuthentication):
    """Override JWTAuthentication to create missing users on the fly."""

    def get_user(self, validated_token):
        """
        Return the user related to the given validated token, creating it if necessary.
        """
        try:
            user_id = validated_token[api_settings.USER_ID_CLAIM]
        except KeyError as exc:
            raise InvalidToken(
                _("Token contained no recognizable user identification")
            ) from exc

        defaults = {
            field: validated_token[oidc_field]
            for field, oidc_field in settings.JWT_USER_FIELDS_SYNC.items()
            if oidc_field in validated_token
        }

        # Check audience for known device client
        is_device = validated_token.get("aud") in getattr(
            settings, "JWT_USER_DEVICE_AUDIENCES", []
        )

        # Update or create the user
        defaults.update({"password": "!", "is_active": True, "is_device": is_device})
        user, _created = self.user_model.objects.update_or_create(
            **{api_settings.USER_ID_FIELD: user_id}, defaults=defaults
        )

        return user
