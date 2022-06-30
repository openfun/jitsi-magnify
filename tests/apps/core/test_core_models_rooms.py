"""
Unit tests for the Room model
"""
from django.core.exceptions import ValidationError
from django.test import TestCase

from magnify.apps.core.factories import LabelFactory, RoomFactory, UserFactory
from magnify.apps.core.models import Room


class RoomsModelsTestCase(TestCase):
    """
    Unit test suite to validate the behavior of the Room model
    """

    def test_models_rooms_str(self):
        """The str representation should be the name."""
        room = RoomFactory()
        self.assertEqual(str(room), room.name)

    def test_models_rooms_ordering(self):
        """Rooms should be returned ordered by name."""
        RoomFactory.create_batch(3)
        rooms = Room.objects.all()
        self.assertGreaterEqual(rooms[1].name, rooms[0].name)
        self.assertGreaterEqual(rooms[2].name, rooms[1].name)

    def test_models_rooms_name_maxlength(self):
        """The name field should be less than 100 characters."""
        RoomFactory(name="a" * 100)
        with self.assertRaises(ValidationError) as context:
            RoomFactory(name="a" * 101)

        self.assertEqual(
            context.exception.messages,
            [
                "Ensure this value has at most 100 characters (it has 101).",
                "Ensure this value has at most 100 characters (it has 101).",
            ],
        )

    def test_models_rooms_slug_unique(self):
        """Room slugs should be unique."""
        RoomFactory(name="a room!")

        with self.assertRaises(ValidationError) as context:
            RoomFactory(name="A Room!")

        self.assertEqual(
            context.exception.messages, ["Room with this Slug already exists."]
        )

    def test_models_rooms_slug_automatic(self):
        """Room slugs should be automatically populated upon saving."""
        room = Room(name="Eléphant in the room")
        room.save()
        self.assertEqual(room.slug, "elephant-in-the-room")

    def test_models_rooms_administrators(self):
        """It should be possible to attach administrators to a room."""
        room = RoomFactory()
        user = UserFactory()
        room.administrators.add(user)
        room.refresh_from_db()
        self.assertEqual(list(room.administrators.all()), [user])

    def test_models_rooms_labels(self):
        """It should be possible to attach labels to a room."""
        room = RoomFactory()
        label = LabelFactory()
        room.labels.add(label)
        room.refresh_from_db()
        self.assertEqual(list(room.labels.all()), [label])
