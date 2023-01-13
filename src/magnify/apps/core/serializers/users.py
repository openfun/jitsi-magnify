"""Serializers for the core Magnify app."""
from django.contrib.auth.hashers import make_password

from rest_framework import serializers
from timezone_field.rest_framework import TimeZoneSerializerField

from magnify.apps.core import models, utils


class UserSerializer(serializers.ModelSerializer):
    """Serialize User model for the API."""

    timezone = TimeZoneSerializerField(use_pytz=False, required=False)

    class Meta:
        model = models.User
        fields = ["id", "email", "language", "name", "timezone", "username"]
        read_only_fields = ["id", "email"]

    def to_representation(self, instance):
        """Remove private fields for user instances other than the logged-in user."""
        result = super().to_representation(instance)

        # remove "email" field if instance is not the logged-in user
        if self.context["request"].user != instance:
            del result["email"]

        return result


class RegistrationSerializer(serializers.ModelSerializer):
    """Serializer to register a new user."""

    class Meta:
        model = models.User
        fields = ["id", "email", "language", "name", "username", "password"]
        extra_kwargs = {"password": {"write_only": True}}

    def save(self, *args, **kwargs):
        """Create the user then set the passsword."""
        kwargs["password"] = make_password(self.validated_data["password"])
        return super().save(*args, **kwargs)

    def to_representation(self, instance):
        """Add authentication tokens that are required upon registration."""
        result = super().to_representation(instance)
        result["auth"] = utils.get_tokens_for_user(instance)
        return result


# pylint: disable=abstract-method
class PasswordChangeSerializer(serializers.Serializer):
    """Serializer to change password."""

    current_password = serializers.CharField(
        style={"input_type": "password"}, required=True
    )
    new_password = serializers.CharField(
        style={"input_type": "password"}, required=True
    )

    def validate_current_password(self, value):
        """Check password in the validation step."""
        if not self.context["request"].user.check_password(value):
            raise serializers.ValidationError("Password does not match")
        return value
