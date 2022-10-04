"""Serializers for the core Magnify app."""
from django.db.models import Q
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
                    Q(group__administrators=request.user)
                    | Q(group__members=request.user),
                    is_administrator=True,
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

    class Meta:
        model = models.Room
        fields = ["id", "name", "slug"]
        read_only_fields = ["id", "slug"]

    def to_representation(self, instance):
        """
        Add users and groups only for administrator users.
        Add Jitsi credentials for public instance or related users/groups
        """
        output = super().to_representation(instance)
        request = self.context.get("request")

        if not request:
            return output
        user = request.user

        if instance.is_public or (
            user.is_authenticated
            and (
                instance.user_accesses.filter(user=user)
                or instance.group_accesses.filter(
                    Q(group__members=user) | Q(group__administrators=user)
                )
            )
        ):
            output["jitsi"] = {
                "room": instance.jitsi_name,
                "token": generate_token(user, instance.jitsi_name),
            }

        if is_admin := instance.is_administrator(request.user):
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
        output["is_administrable"] = is_admin

        return output
