"""Serializers for the core Magnify app."""
from rest_framework import serializers

from magnify.apps.core import models
from magnify.apps.core.utils import generate_token


class RoomUserRelationSerializer(serializers.ModelSerializer):
    """Serialize Room to User relationship for the API."""

    class Meta:
        model = models.RoomUserRelation
        fields = ["id", "user", "room", "is_administrator"]
        read_only_fields = ["id"]


class RoomGroupRelationSerializer(serializers.ModelSerializer):
    """Serialize Room to Group relationship for the API."""

    class Meta:
        model = models.RoomGroupRelation
        fields = ["id", "group", "room", "is_administrator"]
        read_only_fields = ["id"]


class RoomSerializer(serializers.ModelSerializer):
    """Serialize Room model for the API."""

    token = serializers.SerializerMethodField()

    class Meta:
        model = models.Room
        fields = ["id", "name", "slug", "token"]
        read_only_fields = ["id", "slug"]

    def get_token(self, obj):
        """Generate and insert the token in the serializer under the "token" field."""
        return generate_token(self.context["request"].user, obj.slug)

    def to_representation(self, instance):
        """Add users and groups only for administrator users."""
        output = super().to_representation(instance)
        request = self.context.get("request")

        if request and instance.is_administrator(request.user):
            groups_serializer = RoomGroupRelationSerializer(
                instance.group_relations.all(), many=True
            )
            users_serializer = RoomUserRelationSerializer(
                instance.user_relations.all(), many=True
            )
            output.update(
                {
                    "users": users_serializer.data,
                    "groups": groups_serializer.data,
                }
            )

        return output
