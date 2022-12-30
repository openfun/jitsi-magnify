"""Meeting serializers for the core Magnify app."""
from rest_framework import serializers

from magnify.apps.core import models
from magnify.apps.core.utils import generate_token


class MeetingSerializer(serializers.ModelSerializer):
    """Serialize Meeting model for the API."""

    jitsi = serializers.SerializerMethodField()

    class Meta:
        model = models.Meeting
        fields = [
            "id",
            "frequency",
            "groups",
            "is_public",
            "jitsi",
            "labels",
            "monthly_type",
            "name",
            "nb_occurrences",
            "recurrence",
            "room",
            "start",
            "end",
            "users",
            "recurring_until",
            "weekdays",
        ]
        read_only_fields = ["id", "token"]
        extra_kwargs = {"recurring_until": {"required": False}}

    def get_jitsi(self, obj):
        """Generate and insert the jitsi credentials in the serializer under the "jitsi" field."""
        if request := self.context.get("request"):
            return {
                "room": obj.jitsi_name,
                "token": generate_token(request.user, obj.jitsi_name),
            }
        return None

    def to_representation(self, instance):
        """Add occurrences when precalculated."""
        result = super().to_representation(instance)
        # pylint: disable=protected-access
        if occurrences := instance._occurrences:
            result["occurrences"] = occurrences
        return result
