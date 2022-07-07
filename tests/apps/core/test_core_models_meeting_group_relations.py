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

    def test_models_meeting_group_relations_str_normal(self):
        """The str representation should consist in the meeting and group names."""
        relation = MeetingGroupFactory(
            meeting__name="my meeting", group__name="teachers", is_administrator=False
        )
        self.assertEqual(str(relation), "My meeting / Teachers")

    def test_models_meeting_group_relations_str_admin(self):
        """The str representation for an admin group should include the mention."""
        relation = MeetingGroupFactory(
            meeting__name="my meeting", group__name="teachers", is_administrator=True
        )
        self.assertEqual(str(relation), "My meeting / Teachers (admin)")

    def test_models_meeting_group_relations_unique(self):
        """Meeting group relations should be unique."""
        relation = MeetingGroupFactory()

        with self.assertRaises(ValidationError) as context:
            MeetingGroupFactory(group=relation.group, meeting=relation.meeting)

        self.assertEqual(
            context.exception.messages,
            ["Meeting group relation with this Group and Meeting already exists."],
        )
