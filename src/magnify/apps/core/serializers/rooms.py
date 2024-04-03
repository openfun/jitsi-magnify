"""Serializers for the core Magnify app."""
import random
import string
from django.utils.translation import gettext_lazy as _

from rest_framework import exceptions, serializers

from magnify.apps.core import models
from magnify.apps.core.utils import generate_token

from .groups import LiteGroupSerializer
from .users import UserSerializer


class ResourceAccessSerializerMixin:
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
                and not self.instance.resource.is_owner(user)
                or self.instance.role == models.RoleChoices.OWNER
                and not self.instance.user == user
            )
        ) or (
            # Create
            not self.instance
            and data.get("role") == models.RoleChoices.OWNER
            and not data["resource"].is_owner(user)
        ):
            raise exceptions.PermissionDenied(
                "Only owners of a room can assign other users as owners."
            )
        return data

    def validate_resource(self, resource):
        """The logged-in user must be administrator of the resource (directly or via a group)."""
        request = self.context.get("request", None)
        user = getattr(request, "user", None)

        if not (user and user.is_authenticated and resource.is_administrator(user)):
            raise exceptions.PermissionDenied(
                _("You must be administrator or owner of a room to add accesses to it.")
            )

        return resource


class ResourceAccessSerializer(
    ResourceAccessSerializerMixin, serializers.ModelSerializer
):
    """Serialize Room to User accesses for the API."""

    class Meta:
        model = models.ResourceAccess
        fields = ["id", "user", "group", "resource", "role"]
        read_only_fields = ["id"]

    def update(self, instance, validated_data):
        """Make "user", "group" and "resource" fields readonly but only on update."""
        validated_data.pop("resource", None)
        validated_data.pop("user", None)
        validated_data.pop("group", None)
        return super().update(instance, validated_data)


class NestedResourceAccessSerializer(ResourceAccessSerializer):
    """Serialize Room accesses for the API with full nested user."""

    user = UserSerializer(read_only=True)
    group = LiteGroupSerializer(read_only=True)


class RoomSerializer(serializers.ModelSerializer):
    """Serialize Room model for the API."""

    class Meta:
        model = models.Room
        fields = ["id", "name", "slug", "configuration", "is_public"]
        read_only_fields = ["id", "slug"]

    def to_representation(self, instance):
        """
        Add users and groups only for administrator users.
        Add LiveKit credentials for public instance or related users/groups
        """
        output = super().to_representation(instance)
        request = self.context.get("request")

        if not request:
            return output

        user = request.user

        role = instance.get_role(user)

        is_admin = models.RoleChoices.check_administrator_role(role)

        if role is not None:
            access_serializer = NestedResourceAccessSerializer(
                instance.accesses.select_related("resource", "group", "user").all(),
                context=self.context,
                many=True,
            )
            output["accesses"] = access_serializer.data

        if not is_admin:
            del output["configuration"]

        if role is not None or instance.is_public:
            output["livekit"] = {
                "room": instance.livekit_name,
                "token": generate_token(user, instance.livekit_name, request.GET.get("guest"), is_admin=is_admin, is_temp_room=False),
            }
        output["is_administrable"] = is_admin
        output["start_with_audio_muted"] = instance.configuration["startWithAudioMuted"]
        output["start_with_video_muted"] = instance.configuration["startWithVideoMuted"]
        return output
