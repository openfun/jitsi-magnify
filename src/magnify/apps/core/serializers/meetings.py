"""Meeting serializers for the core Magnify app."""
from datetime import date

from rest_framework import serializers

from magnify.apps.core import models
from magnify.apps.core.utils import generate_token


class MeetingSerializer(serializers.ModelSerializer):
    """Serialize Meeting model for the API."""

    jitsi = serializers.SerializerMethodField()
    occurrences = serializers.SerializerMethodField()

    class Meta:
        model = models.Meeting
        fields = [
            "id",
            "expected_duration",
            "frequency",
            "groups",
            "is_public",
            "jitsi",
            "labels",
            "monthly_type",
            "name",
            "nb_occurrences",
            "occurrences",
            "recurrence",
            "room",
            "start",
            "start_time",
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

    @staticmethod
    def get_occurrences(obj):
        """Generate the list of occurrences from recurrence settings."""
        try:
            # pylint: disable=protected-access
            return obj._occurrences
        except AttributeError:
            today = date.today()
            return {
                "start": today,
                "end": today,
                "dates": obj.get_occurrences(today),
            }
