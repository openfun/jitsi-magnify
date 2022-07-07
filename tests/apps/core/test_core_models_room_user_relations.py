"""
Unit tests for the RoomUser model
"""
from django.core.exceptions import ValidationError
from django.test import TestCase

from magnify.apps.core.factories import RoomUserFactory


class RoomUsersModelsTestCase(TestCase):
    """
    Unit test suite to validate the behavior of the RoomUser model
    """

    def test_models_room_user_relations_str_normal(self):
        """The str representation should consist in the room and user names."""
        relation = RoomUserFactory(
            room__name="my room", user__name="François", is_administrator=False
        )
        self.assertEqual(str(relation), "My room / François")

    def test_models_room_user_relations_str_admin(self):
        """The str representation for an admin user should include the mention."""
        relation = RoomUserFactory(
            room__name="my room", user__name="François", is_administrator=True
        )
        self.assertEqual(str(relation), "My room / François (admin)")

    def test_models_room_user_relations_unique(self):
        """Room user relations should be unique."""
        relation = RoomUserFactory()

        with self.assertRaises(ValidationError) as context:
            RoomUserFactory(user=relation.user, room=relation.room)

        self.assertEqual(
            context.exception.messages,
            ["Room user relation with this User and Room already exists."],
        )
