"""Meeting serializers for the core Magnify app."""
from datetime import date

from rest_framework import serializers

from magnify.apps.core import models
from magnify.apps.core.utils import generate_token


class MeetingSerializer(serializers.ModelSerializer):
    """Serialize Meeting model for the API."""

    token = serializers.SerializerMethodField()
    occurrences = serializers.SerializerMethodField()

    class Meta:
        model = models.Meeting
        fields = [
            "id",
            "expected_duration",
            "frequency",
            "groups",
            "is_public",
            "labels",
            "monthly_type",
            "name",
            "nb_occurrences",
            "occurrences",
            "recurrence",
            "room",
            "start",
            "start_time",
            "token",
            "users",
            "recurring_until",
            "weekdays",
        ]
        read_only_fields = ["id", "token"]
        extra_kwargs = {"recurring_until": {"required": False}}

    def get_token(self, obj):
        """Generate and insert the token in the serializer under the "token" field."""
        if request := self.context.get("request"):
            return generate_token(request.user, f"{obj.room.slug:s}-{obj.id!s}")
        return ""

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
