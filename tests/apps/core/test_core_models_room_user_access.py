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

    def test_models_room_user_accesses_str_member(self):
        """The str representation should consist in the room and user names."""
        access = RoomUserAccessFactory(
            room__name="my room", user__name="François", role="member"
        )
        self.assertEqual(str(access), "My room / François (Member)")

    def test_models_room_user_accesses_str_admin(self):
        """The str representation for an admin user should include the mention."""
        access = RoomUserAccessFactory(
            room__name="my room", user__name="François", role="administrator"
        )
        self.assertEqual(str(access), "My room / François (Administrator)")

    def test_models_room_user_accesses_str_owner(self):
        """The str representation for an admin user should include the mention."""
        access = RoomUserAccessFactory(
            room__name="my room", user__name="François", role="owner"
        )
        self.assertEqual(str(access), "My room / François (Owner)")

    def test_models_room_user_accesses_unique(self):
        """Room user accesses should be unique."""
        access = RoomUserAccessFactory()

        with self.assertRaises(ValidationError) as context:
            RoomUserAccessFactory(user=access.user, room=access.room)

        self.assertEqual(
            context.exception.messages,
            ["Room user access with this User and Room already exists."],
        )
