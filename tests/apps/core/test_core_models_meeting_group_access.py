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
            meeting__name="my meeting", group__name="teachers", role="member"
        )
        self.assertEqual(str(access), "My meeting / Teachers (Member)")

    def test_models_meeting_group_access_str_admin(self):
        """The str representation for an admin group should include the mention."""
        access = MeetingGroupAccessFactory(
            meeting__name="my meeting", group__name="teachers", role="administrator"
        )
        self.assertEqual(str(access), "My meeting / Teachers (Admin)")

    def test_models_meeting_group_access_role_owner(self):
        """There is no "owner" role on the meeting group access model."""
        with self.assertRaises(ValidationError) as context:
            MeetingGroupAccessFactory(role="owner")

        self.assertEqual(
            context.exception.messages, ["Value 'owner' is not a valid choice."]
        )

    def test_models_meeting_group_access_unique(self):
        """Meeting group accesses should be unique."""
        access = MeetingGroupAccessFactory()

        with self.assertRaises(ValidationError) as context:
            MeetingGroupAccessFactory(group=access.group, meeting=access.meeting)

        self.assertEqual(
            context.exception.messages,
            ["Meeting group access with this Group and Meeting already exists."],
        )
