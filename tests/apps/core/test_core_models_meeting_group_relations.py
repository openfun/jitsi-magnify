"""
Unit tests for the MeetingGroup model
"""
from django.core.exceptions import ValidationError
from django.test import TestCase

from magnify.apps.core.factories import MeetingGroupFactory


class MeetingGroupsModelsTestCase(TestCase):
    """
    Unit test suite to validate the behavior of the MeetingGroup model
    """

    def test_models_meeting_group_accesses_str_normal(self):
        """The str representation should consist in the meeting and group names."""
        access = MeetingGroupFactory(
            meeting__name="my meeting", group__name="teachers", is_administrator=False
        )
        self.assertEqual(str(access), "My meeting / Teachers")

    def test_models_meeting_group_accesses_str_admin(self):
        """The str representation for an admin group should include the mention."""
        access = MeetingGroupFactory(
            meeting__name="my meeting", group__name="teachers", is_administrator=True
        )
        self.assertEqual(str(access), "My meeting / Teachers (admin)")

    def test_models_meeting_group_accesses_unique(self):
        """Meeting group accesses should be unique."""
        access = MeetingGroupFactory()

        with self.assertRaises(ValidationError) as context:
            MeetingGroupFactory(group=access.group, meeting=access.meeting)

        self.assertEqual(
            context.exception.messages,
            ["Meeting group relation with this Group and Meeting already exists."],
        )
