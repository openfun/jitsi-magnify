"""
Unit tests for the Group model
"""
from django.core.exceptions import ValidationError
from django.test import TestCase

from magnify.apps.core.factories import (
    GroupFactory,
    LabelFactory,
    MeetingFactory,
    RoomFactory,
    UserFactory,
)
from magnify.apps.core.models import Group


class GroupsModelsTestCase(TestCase):
    """
    Unit test suite to validate the behavior of the Group model
    """

    def test_models_groups_str(self):
        """The str representation should be the name."""
        group = GroupFactory()
        self.assertEqual(str(group), group.name)

    def test_models_groups_ordering(self):
        """Groups should be returned ordered by name."""
        GroupFactory.create_batch(3)
        groups = Group.objects.all()
        self.assertGreaterEqual(groups[1].name, groups[0].name)
        self.assertGreaterEqual(groups[2].name, groups[1].name)

    def test_models_groups_name_maxlength(self):
        """The name field should be less than 100 characters."""
        GroupFactory(name="a" * 100)
        with self.assertRaises(ValidationError) as context:
            GroupFactory(name="a" * 101)

        self.assertEqual(
            context.exception.messages,
            ["Ensure this value has at most 100 characters (it has 101)."],
        )

    def test_models_groups_members(self):
        """It should be possible to attach members to a group."""
        group = GroupFactory()
        user = UserFactory()
        group.members.add(user)
        group.refresh_from_db()
        self.assertEqual(list(group.members.all()), [user])

    def test_models_groups_meetings(self):
        """It should be possible to attach meetings to a group."""
        group = GroupFactory()
        meeting = MeetingFactory()
        group.meetings.add(meeting)
        group.refresh_from_db()
        self.assertEqual(list(group.meetings.all()), [meeting])

    def test_models_groups_rooms(self):
        """It should be possible to attach rooms to a group."""
        group = GroupFactory()
        room = RoomFactory()
        group.rooms.add(room)
        group.refresh_from_db()
        self.assertEqual(list(group.rooms.all()), [room])

    def test_models_groups_labels(self):
        """It should be possible to attach labels to a group."""
        group = GroupFactory()
        label = LabelFactory()
        group.labels.add(label)
        group.refresh_from_db()
        self.assertEqual(list(group.labels.all()), [label])
