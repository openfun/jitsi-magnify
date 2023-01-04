"""Meeting serializers for the core Magnify app."""
from django.utils.translation import gettext_lazy as _

from rest_framework import exceptions, serializers
from timezone_field.rest_framework import TimeZoneSerializerField

from magnify.apps.core import models
from magnify.apps.core.utils import generate_token

from .. import forms
from .groups import LiteGroupSerializer
from .users import UserSerializer


class MeetingAccessSerializer(serializers.ModelSerializer):
    """Serialize Meeting to User/Group relations for the API."""

    class Meta:
        model = models.MeetingAccess
        fields = ["id", "user", "group", "meeting"]
        read_only_fields = ["id"]

    def validate_meeting(self, meeting):
        """The logged-in user must be owner of the meeting."""
        request = self.context.get("request", None)
        user = getattr(request, "user", None)

        if not (user and user.is_authenticated and meeting.owner == user):
            raise exceptions.PermissionDenied(
                _("You must be owner of a meeting to add accesses to it.")
            )

        return meeting


class NestedMeetingAccessSerializer(MeetingAccessSerializer):
    """Serialize Room accesses for the API with full nested user."""

    user = UserSerializer(read_only=True)
    group = LiteGroupSerializer(read_only=True)


class MeetingSerializer(serializers.ModelSerializer):
    """Serialize Meeting model for the API."""

    timezone = TimeZoneSerializerField(use_pytz=False, required=False)

    class Meta:
        model = models.Meeting
        fields = [
            "id",
            "frequency",
            "is_public",
            "monthly_type",
            "name",
            "nb_occurrences",
            "owner",
            "recurrence",
            "room",
            "start",
            "end",
            "recurring_until",
            "timezone",
            "weekdays",
        ]
        read_only_fields = ["id", "owner"]
        extra_kwargs = {"recurring_until": {"required": False}}

    def to_representation(self, instance):
        """Add occurrences when precalculated."""
        output = super().to_representation(instance)

        request = self.context.get("request")
        if not request:
            return output

        user = request.user
        is_owner = user == instance.owner

        if is_owner or instance.is_guest(user):
            guests_serializer = NestedMeetingAccessSerializer(
                instance.accesses.select_related("user", "group").all(),
                context=self.context,
                many=True,
            )
            output["guests"] = guests_serializer.data

        output["jitsi"] = {
            "meeting": instance.jitsi_name,
            "token": generate_token(user, instance.jitsi_name, is_admin=is_owner),
        }

        # Retrieve meeting occurrences if requested in query string
        filter_form = forms.MeetingFilterForm(data=request.query_params)
        if filter_form.is_valid():
            # Compute occurrences for time range
            filter_from = filter_form.cleaned_data["from"]
            filter_to = filter_form.cleaned_data["to"]
            output["occurrences"] = {
                "from": filter_from,
                "to": filter_to,
                "dates": instance.get_occurrences(filter_from, filter_to),
            }

        return output
