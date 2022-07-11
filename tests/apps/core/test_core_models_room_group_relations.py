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

    def test_models_room_group_accesses_str_normal(self):
        """The str representation should consist in the room and group names."""
        access = RoomGroupAccessFactory(
            room__name="my room", group__name="teachers", is_administrator=False
        )
        self.assertEqual(str(access), "My room / Teachers")

    def test_models_room_group_accesses_str_admin(self):
        """The str representation for an admin group should include the mention."""
        access = RoomGroupAccessFactory(
            room__name="my room", group__name="teachers", is_administrator=True
        )
        self.assertEqual(str(access), "My room / Teachers (admin)")

    def test_models_room_group_accesses_unique(self):
        """Room group accesses should be unique."""
        access = RoomGroupAccessFactory()

        with self.assertRaises(ValidationError) as context:
            RoomGroupAccessFactory(group=access.group, room=access.room)

        self.assertEqual(
            context.exception.messages,
            ["Room group access with this Group and Room already exists."],
        )
