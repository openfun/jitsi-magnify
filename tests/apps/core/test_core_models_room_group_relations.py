"""
Unit tests for the RoomGroup model
"""
from django.core.exceptions import ValidationError
from django.test import TestCase

from magnify.apps.core.factories import RoomGroupFactory


class RoomGroupsModelsTestCase(TestCase):
    """
    Unit test suite to validate the behavior of the RoomGroup model
    """

    def test_models_room_group_relations_str_normal(self):
        """The str representation should consist in the room and group names."""
        relation = RoomGroupFactory(
            room__name="my room", group__name="teachers", is_administrator=False
        )
        self.assertEqual(str(relation), "My room / Teachers")

    def test_models_room_group_relations_str_admin(self):
        """The str representation for an admin group should include the mention."""
        relation = RoomGroupFactory(
            room__name="my room", group__name="teachers", is_administrator=True
        )
        self.assertEqual(str(relation), "My room / Teachers (admin)")

    def test_models_room_group_relations_unique(self):
        """Room group relations should be unique."""
        relation = RoomGroupFactory()

        with self.assertRaises(ValidationError) as context:
            RoomGroupFactory(group=relation.group, room=relation.room)

        self.assertEqual(
            context.exception.messages,
            ["Room group relation with this Group and Room already exists."],
        )
