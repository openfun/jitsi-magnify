"""
Unit tests for the MeetingUserAccess model
"""
from django.core.exceptions import ValidationError
from django.test import TestCase

from magnify.apps.core.factories import MeetingUserFactory


class MeetingUserAccessModelsTestCase(TestCase):
    """
    Unit test suite to validate the behavior of the MeetingUserAccess model
    """

    def test_models_meeting_user_access_str_normal(self):
        """The str representation should consist in the meeting and user names."""
        access = MeetingUserFactory(
            meeting__name="my meeting", user__name="François", role="member"
        )
        self.assertEqual(str(access), "My meeting / François (Member)")

    def test_models_meeting_user_access_str_admin(self):
        """The str representation for an admin user should include the mention."""
        access = MeetingUserFactory(
            meeting__name="my meeting", user__name="François", role="administrator"
        )
        self.assertEqual(str(access), "My meeting / François (Admin)")

    def test_models_meeting_user_access_str_owner(self):
        """The str representation for an admin user should include the mention."""
        access = MeetingUserFactory(
            meeting__name="my meeting", user__name="François", role="owner"
        )
        self.assertEqual(str(access), "My meeting / François (Owner)")

    def test_models_meeting_user_access_unique(self):
        """Meeting user accesses should be unique."""
        access = MeetingUserFactory()

        with self.assertRaises(ValidationError) as context:
            MeetingUserFactory(user=access.user, meeting=access.meeting)

        self.assertEqual(
            context.exception.messages,
            ["Meeting user access with this User and Meeting already exists."],
        )
