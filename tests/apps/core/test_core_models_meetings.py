"""
Unit tests for the Meeting model
"""
from datetime import date

from django.core.exceptions import ValidationError
from django.db.utils import IntegrityError
from django.test import TestCase

from magnify.apps.core.factories import (
    GroupFactory,
    LabelFactory,
    MeetingFactory,
    UserFactory,
)
from magnify.apps.core.models import Meeting


class MeetingsModelsTestCase(TestCase):
    """
    Unit test suite to validate the behavior of the Meeting model
    """

    def test_models_meetings_str(self):
        """The str representation should be the name."""
        room = MeetingFactory()
        self.assertEqual(str(room), room.name)

    def test_models_meetings_ordering_first(self):
        """Meetings should be returned ordered by name."""
        MeetingFactory.create_batch(3)
        meetings = Meeting.objects.all()
        self.assertGreaterEqual(meetings[0].start, meetings[1].start)
        self.assertGreaterEqual(meetings[1].start, meetings[2].start)

    def test_models_meetings_ordering_second(self):
        """Meetings sharing the same start date should be ordered by their start time."""
        MeetingFactory.create_batch(3, start=date.today())
        meetings = Meeting.objects.all()
        self.assertGreaterEqual(meetings[0].start_time, meetings[1].start_time)
        self.assertGreaterEqual(meetings[1].start_time, meetings[2].start_time)

    def test_models_meetings_end_greater_than_start(self):
        """The start date can not be greater than the end date."""
        with self.assertRaises(IntegrityError) as context:
            MeetingFactory(start=date(2022, 6, 27), end=date(2022, 6, 26))

        self.assertIn(
            "end_greater_than_start",
            str(context.exception),
        )

    def test_models_meetings_name_maxlength(self):
        """The name field should be less than 100 characters."""
        MeetingFactory(name="a" * 500)
        with self.assertRaises(ValidationError) as context:
            MeetingFactory(name="a" * 501)

        self.assertEqual(
            context.exception.messages,
            ["Ensure this value has at most 500 characters (it has 501)."],
        )

    def test_models_meetings_users(self):
        """It should be possible to attach users to a meeting."""
        meeting = MeetingFactory()
        user = UserFactory()
        meeting.users.add(user)
        meeting.refresh_from_db()
        self.assertEqual(list(meeting.users.all()), [user])

    def test_models_meetings_groups(self):
        """It should be possible to attach groups to a meeting."""
        meeting = MeetingFactory()
        group = GroupFactory()
        meeting.groups.add(group)
        meeting.refresh_from_db()
        self.assertEqual(list(meeting.groups.all()), [group])

    def test_models_meetings_labels(self):
        """It should be possible to attach labels to a meeting."""
        meeting = MeetingFactory()
        label = LabelFactory()
        meeting.labels.add(label)
        meeting.refresh_from_db()
        self.assertEqual(list(meeting.labels.all()), [label])
