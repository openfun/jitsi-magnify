"""
Unit tests for the MeetingUser model
"""
from django.core.exceptions import ValidationError
from django.test import TestCase

from magnify.apps.core.factories import MeetingUserFactory


class MeetingUsersModelsTestCase(TestCase):
    """
    Unit test suite to validate the behavior of the MeetingUser model
    """

    def test_models_meeting_user_accesses_str_normal(self):
        """The str representation should consist in the meeting and user names."""
        access = MeetingUserFactory(
            meeting__name="my meeting", user__name="François", is_administrator=False
        )
        self.assertEqual(str(access), "My meeting / François")

    def test_models_meeting_user_accesses_str_admin(self):
        """The str representation for an admin user should include the mention."""
        access = MeetingUserFactory(
            meeting__name="my meeting", user__name="François", is_administrator=True
        )
        self.assertEqual(str(access), "My meeting / François (admin)")

    def test_models_meeting_user_accesses_unique(self):
        """Meeting user accesses should be unique."""
        access = MeetingUserFactory()

        with self.assertRaises(ValidationError) as context:
            MeetingUserFactory(user=access.user, meeting=access.meeting)

        self.assertEqual(
            context.exception.messages,
            ["Meeting user relation with this User and Meeting already exists."],
        )
