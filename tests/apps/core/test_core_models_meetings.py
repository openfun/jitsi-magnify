"""
Unit tests for the Meeting model
"""
from datetime import datetime
from zoneinfo import ZoneInfo

from django.core.exceptions import ValidationError
from django.test import TestCase

from magnify.apps.core.factories import MeetingFactory
from magnify.apps.core.models import Meeting


class MeetingsModelsTestCase(TestCase):
    """
    Unit test suite to validate the behavior of the Meeting model
    """

    def test_models_meetings_str(self):
        """The str representation should be the name."""
        meeting = MeetingFactory()
        self.assertEqual(str(meeting), meeting.name)

    def test_models_meetings_ordering_first(self):
        """Meetings should be returned ordered by name."""
        MeetingFactory.create_batch(3)
        meetings = Meeting.objects.all()
        self.assertGreaterEqual(meetings[0].start, meetings[1].start)
        self.assertGreaterEqual(meetings[1].start, meetings[2].start)

    def test_models_meetings_end_greater_than_start(self):
        """
        The start date can not be greater than the date of end of recurrence.
        """
        meeting = MeetingFactory(
            start=datetime(2022, 6, 26, 9, 0, tzinfo=ZoneInfo("UTC")),
            recurring_until=datetime(2022, 6, 26, 9, 1, tzinfo=ZoneInfo("UTC")),
            recurrence="daily",
        )
        self.assertEqual(meeting.recurring_until, meeting.start)

    def test_models_meetings_name_maxlength(self):
        """The name field should be less than 500 characters."""
        MeetingFactory(name="a" * 500)
        with self.assertRaises(ValidationError) as context:
            MeetingFactory(name="a" * 501)

        self.assertEqual(
            context.exception.messages,
            ["Ensure this value has at most 500 characters (it has 501)."],
        )

    def test_models_meetings_jitsi_name(self):
        """The Jitsi name should be the meeting ID stripped of all dashes."""
        meeting = MeetingFactory(id="2a76d5ee-8310-4a28-8e7f-c34dbdc4dd8a")
        self.assertEqual(meeting.jitsi_name, "2a76d5ee83104a288e7fc34dbdc4dd8a")
