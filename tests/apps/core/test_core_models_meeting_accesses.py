"""
Unit tests for the MeetingAccess model with user
"""
from django.core.exceptions import ValidationError
from django.test import TestCase

from magnify.apps.core.factories import (
    GroupMeetingAccessFactory,
    UserMeetingAccessFactory,
)


class MeetingAccessesModelsTestCase(TestCase):
    """Unit test suite to validate the behavior of the MeetingAccess model."""

    def test_models_meeting_accesses_user_str(self):
        """The str representation should consist in the user name and meeting ID."""
        access = UserMeetingAccessFactory(user__name="François")
        self.assertEqual(
            str(access),
            f"François is guest in meeting {access.meeting.id!s}",
        )

    def test_models_meeting_accesses_user_unique(self):
        """Meeting user accesses should be unique."""
        access = UserMeetingAccessFactory()

        with self.assertRaises(ValidationError) as context:
            UserMeetingAccessFactory(user=access.user, meeting=access.meeting)

        self.assertEqual(
            context.exception.messages,
            ["This user is already declared as a guest for this meeting."],
        )

    def test_models_meeting_accesses_group_str(self):
        """The str representation should consist in the group name and meeting ID."""
        access = GroupMeetingAccessFactory(group__name="teachers")
        self.assertEqual(
            str(access),
            f"Users in group teachers are guests in meeting {access.meeting_id!s}",
        )

    def test_models_meeting_accesses_group_unique(self):
        """Meeting group accesses should be unique."""
        access = GroupMeetingAccessFactory()

        with self.assertRaises(ValidationError) as context:
            GroupMeetingAccessFactory(group=access.group, meeting=access.meeting)

        self.assertEqual(
            context.exception.messages,
            ["This group is already declared as a guest for this meeting."],
        )
