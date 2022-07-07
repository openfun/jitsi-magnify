"""
Unit tests for the Meeting factory
"""
from datetime import date

from django.test import TestCase

from magnify.apps.core.factories import (
    GroupFactory,
    LabelFactory,
    MeetingFactory,
    UserFactory,
)


class MeetingsFactoriesTestCase(TestCase):
    """
    Unit test suite to validate the behavior of the Meeting factory
    """

    def test_factories_meetings_start_future(self):
        """The start date should be in the future."""
        meeting = MeetingFactory()
        self.assertGreaterEqual(meeting.start, date.today())

    def test_factories_meetings_end_greater_than_start(self):
        """The end date picked should be greater than the start date."""
        meeting = MeetingFactory()
        self.assertGreaterEqual(meeting.end, meeting.start)

    def test_factories_meetings_users(self):
        """We should be able to attach users to a meeting."""
        users = UserFactory.create_batch(2)
        meeting = MeetingFactory(users=users)
        self.assertQuerysetEqual(meeting.users.all(), users, ordered=False)

    def test_factories_meetings_labels(self):
        """We should be able to attach labels to a meeting."""
        labels = LabelFactory.create_batch(2)
        meeting = MeetingFactory(labels=labels)
        self.assertQuerysetEqual(meeting.labels.all(), labels, ordered=False)

    def test_factories_meetings_groups(self):
        """We should be able to attach groups to a meeting."""
        groups = GroupFactory.create_batch(2)
        meeting = MeetingFactory(groups=groups)
        self.assertQuerysetEqual(meeting.groups.all(), groups, ordered=False)
