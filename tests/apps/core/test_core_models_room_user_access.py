"""
Unit tests for the RoomUserAccess model
"""
from django.core.exceptions import ValidationError
from django.test import TestCase

from magnify.apps.core.factories import RoomUserAccessFactory


class RoomUserAccessesModelsTestCase(TestCase):
    """
    Unit test suite to validate the behavior of the RoomUserAccess model
    """

    def test_models_room_user_accesses_str_normal(self):
        """The str representation should consist in the room and user names."""
        access = RoomUserAccessFactory(
            room__name="my room", user__name="François", is_administrator=False
        )
        self.assertEqual(str(access), "My room / François")

    def test_models_room_user_accesses_str_admin(self):
        """The str representation for an admin user should include the mention."""
        access = RoomUserAccessFactory(
            room__name="my room", user__name="François", is_administrator=True
        )
        self.assertEqual(str(access), "My room / François (admin)")

    def test_models_room_user_accesses_unique(self):
        """Room user accesses should be unique."""
        access = RoomUserAccessFactory()

        with self.assertRaises(ValidationError) as context:
            RoomUserAccessFactory(user=access.user, room=access.room)

        self.assertEqual(
            context.exception.messages,
            ["Room user access with this User and Room already exists."],
        )
