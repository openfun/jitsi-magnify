"""Serializers for the core Magnify app."""
from django.utils.translation import gettext_lazy as _

from rest_framework import exceptions, serializers

from magnify.apps.core import models
from magnify.apps.core.utils import generate_token

from .groups import GroupSerializer
from .users import UserSerializer


class RoomAccessSerializerMixin:
    """
    A serializer mixin to share controling that the logged-in user submitting a room access object
    is administrator on the targeted room.
    """

    # pylint: disable=too-many-boolean-expressions
    def validate(self, data):
        """
        Check access rights specific to writing (create/update)
        """
        request = self.context.get("request", None)
        user = getattr(request, "user", None)
        if (
            # Update
            self.instance
            and (
                data["role"] == models.RoleChoices.OWNER
                and not self.instance.room.is_owner(user)
                or self.instance.role == models.RoleChoices.OWNER
                and not self.instance.user == user
            )
        ) or (
            # Create
            not self.instance
            and data.get("role") == models.RoleChoices.OWNER
            and not data["room"].is_owner(user)
        ):
            raise exceptions.PermissionDenied(
                "Only owners of a room can assign other users as owners."
            )
        return data

    def validate_room(self, room):
        """The logged-in user must be administrator in the room (directly or via a group)."""
        request = self.context.get("request", None)
        user = getattr(request, "user", None)

        if not (user and user.is_authenticated and room.is_administrator(user)):
            raise exceptions.PermissionDenied(
                _("You must be administrator or owner of a room to add accesses to it.")
            )

        return room


class RoomUserAccessSerializer(RoomAccessSerializerMixin, serializers.ModelSerializer):
    """Serialize Room to User accesses for the API."""

    class Meta:
        model = models.RoomUserAccess
        fields = ["id", "user", "room", "role"]
        read_only_fields = ["id"]

    def update(self, instance, validated_data):
        """Make user and room field readonly but only on update."""
        validated_data.pop("room", None)
        validated_data.pop("user", None)
        return super().update(instance, validated_data)


class NestedRoomUserAccessSerializer(RoomUserAccessSerializer):
    """Serialize Room to User accesses for the API with full nested user."""

    user = UserSerializer(read_only=True)


class RoomGroupAccessSerializer(RoomAccessSerializerMixin, serializers.ModelSerializer):
    """Serialize Room to Group accesses for the API."""

    class Meta:
        model = models.RoomGroupAccess
        fields = ["id", "group", "room", "role"]
        read_only_fields = ["id"]

    def update(self, instance, validated_data):
        """Make group and room field readonly but only on update."""
        validated_data.pop("room", None)
        validated_data.pop("group", None)
        return super().update(instance, validated_data)


class NestedRoomGroupAccessSerializer(RoomGroupAccessSerializer):
    """Serialize Room to Group accesses for the API with full nested info."""

    group = GroupSerializer(read_only=True)


class RoomSerializer(serializers.ModelSerializer):
    """Serialize Room model for the API."""

    class Meta:
        model = models.Room
        fields = ["id", "name", "slug", "configuration", "is_public"]
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
        role = instance.get_role(user)
        is_admin = models.RoleChoices.check_administrator_role(role)

        if role is not None:
            groups_serializer = RoomGroupAccessSerializer(
                instance.group_accesses.select_related("room", "group").all(),
                context=self.context,
                many=True,
            )
            users_serializer = NestedRoomUserAccessSerializer(
                instance.user_accesses.select_related("room", "user").all(),
                context=self.context,
                many=True,
            )
            output.update(
                {
                    "user_accesses": users_serializer.data,
                    "group_accesses": groups_serializer.data,
                }
            )

        if not is_admin:
            del output["configuration"]

        if role is not None or instance.is_public:
            output["jitsi"] = {
                "room": instance.jitsi_name,
                "token": generate_token(user, instance.jitsi_name, is_admin=is_admin),
            }
        output["is_administrable"] = is_admin

        return output
