"""Serializers for the core Magnify app."""
from django.utils.translation import gettext_lazy as _

from rest_framework import serializers

from magnify.apps.core import models
from magnify.apps.core.utils import generate_token


class RoomAccessSerializerMixin:
    """
    A serializer mix to share controling that the logged-in user submitting a room access object
    is administrator on the targeted room.
    """

    def validate_room(self, room):
        """The logged-in user must be administrator in the room (directly or via a group)."""
        request = self.context.get("request", None)

        is_administrator = (
            request
            and request.user
            and request.user.is_authenticated
            and (
                room.user_accesses.filter(is_administrator=True, user=request.user)
                or room.group_accesses.filter(
                    is_administrator=True, group__user_accesses__user=request.user
                )
            )
        )
        if not is_administrator:
            raise serializers.ValidationError(
                _("You must be administrator of a room to add accesses to it.")
            )

        return room


class RoomUserAccessSerializer(RoomAccessSerializerMixin, serializers.ModelSerializer):
    """Serialize Room to User accesses for the API."""

    class Meta:
        model = models.RoomUserAccess
        fields = ["id", "user", "room", "is_administrator"]
        read_only_fields = ["id"]


class RoomGroupAccessSerializer(RoomAccessSerializerMixin, serializers.ModelSerializer):
    """Serialize Room to Group accesses for the API."""

    class Meta:
        model = models.RoomGroupAccess
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
            groups_serializer = RoomGroupAccessSerializer(
                instance.group_accesses.all(), many=True
            )
            users_serializer = RoomUserAccessSerializer(
                instance.user_accesses.all(), many=True
            )
            output.update(
                {
                    "users": users_serializer.data,
                    "groups": groups_serializer.data,
                }
            )

        return output
