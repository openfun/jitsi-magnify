"""
Unit tests for the MeetingGroupAccess model
"""
from django.core.exceptions import ValidationError
from django.test import TestCase

from magnify.apps.core.factories import MeetingGroupAccessFactory


class MeetingGroupAccessModelsTestCase(TestCase):
    """
    Unit test suite to validate the behavior of the MeetingGroupAccess model
    """

    def test_models_meeting_group_access_str_normal(self):
        """The str representation should consist in the meeting and group names."""
        access = MeetingGroupAccessFactory(
            meeting__name="my meeting", group__name="teachers", is_administrator=False
        )
        self.assertEqual(str(access), "My meeting / Teachers")

    def test_models_meeting_group_access_str_admin(self):
        """The str representation for an admin group should include the mention."""
        access = MeetingGroupAccessFactory(
            meeting__name="my meeting", group__name="teachers", is_administrator=True
        )
        self.assertEqual(str(access), "My meeting / Teachers (admin)")

    def test_models_meeting_group_access_unique(self):
        """Meeting group accesses should be unique."""
        access = MeetingGroupAccessFactory()

        with self.assertRaises(ValidationError) as context:
            MeetingGroupAccessFactory(group=access.group, meeting=access.meeting)

        self.assertEqual(
            context.exception.messages,
            ["Meeting group access with this Group and Meeting already exists."],
        )
