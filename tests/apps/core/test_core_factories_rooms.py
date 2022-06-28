"""
Unit tests for the Room factory
"""
from django.test import TestCase

from magnify.apps.core.factories import (
    GroupFactory,
    LabelFactory,
    RoomFactory,
    UserFactory,
)


class RoomsFactoriesTestCase(TestCase):
    """
    Unit test suite to validate the behavior of the Room factory
    """

    def test_factories_rooms_slug(self):
        """The slug field should be populated from the name field."""
        room = RoomFactory(name="A Full Name")
        self.assertEqual(room.slug, "a-full-name")

    def test_factories_rooms_administrators(self):
        """We should be able to attach administrators to a room."""
        users = UserFactory.create_batch(2)
        room = RoomFactory(administrators=users)
        self.assertQuerysetEqual(room.administrators.all(), users, ordered=False)

    def test_factories_rooms_labels(self):
        """We should be able to attach labels to a room."""
        labels = LabelFactory.create_batch(2)
        room = RoomFactory(labels=labels)
        self.assertQuerysetEqual(room.labels.all(), labels, ordered=False)

    def test_factories_rooms_groups(self):
        """We should be able to attach groups to a room."""
        groups = GroupFactory.create_batch(2)
        room = RoomFactory(groups=groups)
        self.assertQuerysetEqual(room.groups.all(), groups, ordered=False)
