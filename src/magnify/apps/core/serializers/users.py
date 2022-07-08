"""Serializers for the core Magnify app."""
from django.contrib.auth.hashers import make_password

from rest_framework import serializers

from magnify.apps.core import models


class UserSerializer(serializers.ModelSerializer):
    """Serialize User model for the API."""

    class Meta:
        model = models.User
        fields = ["id", "email", "name", "username"]
        read_only_fields = ["id", "email", "username"]

    def to_representation(self, instance):
        """Remove private fields for user instances other than the logged-in user."""
        result = super().to_representation(instance)

        # remove "email" field if instance is not the logged-in user
        if self.context["request"].user != instance:
            return {"id": result["id"], "username": result["username"]}

        return result


class RegistrationSerializer(serializers.ModelSerializer):
    """Serializer to register a new user."""

    class Meta:
        model = models.User
        fields = ["email", "name", "username", "password"]
        extra_kwargs = {"password": {"write_only": True}}

    def save(self, *args, **kwargs):
        """Create the user then set the passsword."""
        kwargs["password"] = make_password(self.validated_data["password"])
        return super().save(*args, **kwargs)


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
