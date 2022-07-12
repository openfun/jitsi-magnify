"""Serialier for the Group model."""
from django.utils.translation import gettext_lazy as _

from rest_framework import serializers

from magnify.apps.core import models


class GroupSerializer(serializers.ModelSerializer):
    """Serialize Group model for the API."""

    class Meta:
        model = models.Group
        fields = ["id", "administrators", "members", "name"]
        read_only_fields = ["id"]

    @staticmethod
    def validate_administrators(administrators):
        """The administrators field must never be null."""
        if not administrators:
            raise serializers.ValidationError(
                _("The group must have at least one administrator.")
            )
        return administrators
