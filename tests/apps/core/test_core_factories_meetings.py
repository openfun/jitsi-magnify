"""
Unit tests for the Meeting factory
"""
from django.test import TestCase
from django.utils import timezone

from magnify.apps.core.factories import GroupFactory, MeetingFactory, UserFactory
from magnify.apps.core.models import MeetingAccess


class MeetingsFactoriesTestCase(TestCase):
    """
    Unit test suite to validate the behavior of the Meeting factory
    """

    def test_factories_meetings_start_future(self):
        """The start date should be in the future."""
        meeting = MeetingFactory()
        self.assertGreaterEqual(meeting.start, timezone.now())

    def test_factories_meetings_recurring_until_greater_than_start(self):
        """The date of end of recurrence should be greater than the start date."""
        meeting = MeetingFactory()
        self.assertGreaterEqual(meeting.recurring_until, meeting.start)

    def test_factories_meetings_users(self):
        """We should be able to attach users to a meeting."""
        users = UserFactory.create_batch(2)
        MeetingFactory(users=users)
        self.assertQuerySetEqual(
            [access.user for access in MeetingAccess.objects.all()],
            users,
            ordered=False,
        )

    def test_factories_meetings_groups(self):
        """We should be able to attach groups to a meeting."""
        groups = GroupFactory.create_batch(2)
        MeetingFactory(groups=groups)
        self.assertQuerySetEqual(
            [access.group for access in MeetingAccess.objects.all()],
            groups,
            ordered=False,
        )
