"""
Unit tests for the RoomGroupAccess model
"""
from django.core.exceptions import ValidationError
from django.test import TestCase

from magnify.apps.core.factories import RoomGroupAccessFactory


class RoomGroupAccessAccessesModelsTestCase(TestCase):
    """
    Unit test suite to validate the behavior of the RoomGroupAccess model
    """

    def test_models_room_group_accesses_str_member(self):
        """The str representation should consist in the room and group names."""
        access = RoomGroupAccessFactory(
            room__name="my room", group__name="teachers", role="member"
        )
        self.assertEqual(str(access), "My room / Teachers (Member)")

    def test_models_room_group_accesses_str_admin(self):
        """The str representation for an admin group should include the mention."""
        access = RoomGroupAccessFactory(
            room__name="my room", group__name="teachers", role="administrator"
        )
        self.assertEqual(str(access), "My room / Teachers (Admin)")

    def test_models_room_group_access_role_owner(self):
        """There is no "owner" role on the room group access model."""
        with self.assertRaises(ValidationError) as context:
            RoomGroupAccessFactory(role="owner")

        self.assertEqual(
            context.exception.messages, ["Value 'owner' is not a valid choice."]
        )

    def test_models_room_group_accesses_unique(self):
        """Room group accesses should be unique."""
        access = RoomGroupAccessFactory()

        with self.assertRaises(ValidationError) as context:
            RoomGroupAccessFactory(group=access.group, room=access.room)

        self.assertEqual(
            context.exception.messages,
            ["Room group access with this Group and Room already exists."],
        )
