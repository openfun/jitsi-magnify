"""Serializers for the core Magnify app."""
from rest_framework import serializers

from magnify.apps.core import models
from magnify.apps.core.utils import generate_token


class RoomSerializer(serializers.ModelSerializer):
    """Serialize Room model for the API."""

    token = serializers.SerializerMethodField()

    class Meta:
        model = models.Room
        fields = ["administrators", "id", "name", "slug", "token"]
        read_only_fields = ["id", "slug"]

    def get_token(self, obj):
        """Generate and insert the token in the serializer under the "token" field."""
        return generate_token(self.context["request"].user, obj.slug)
