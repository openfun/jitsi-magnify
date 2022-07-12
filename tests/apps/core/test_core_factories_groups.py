"""
Unit tests for the Group factory
"""
from uuid import UUID

from django.test import TestCase

from magnify.apps.core.factories import (
    GroupFactory,
    MeetingFactory,
    RoomFactory,
    UserFactory,
)


class GroupsFactoriesTestCase(TestCase):
    """
    Unit test suite to validate the behavior of the Group factory
    """

    @staticmethod
    def test_factories_groups_token():
        """The token field should be a valid UUID."""
        group = GroupFactory()
        UUID(group.token, version=4)

    def test_factories_groups_meetings(self):
        """We should be able to attach meetings to a group."""
        meetings = MeetingFactory.create_batch(2)
        group = GroupFactory(meetings=meetings)

        self.assertQuerysetEqual(group.meetings.all(), meetings, ordered=False)
        self.assertEqual(list(meetings[0].groups.all()), [group])

    def test_factories_groups_rooms(self):
        """We should be able to attach rooms to a group."""
        rooms = RoomFactory.create_batch(2)
        group = GroupFactory(rooms=rooms)

        self.assertQuerysetEqual(group.rooms.all(), rooms, ordered=False)
        self.assertEqual(list(rooms[0].groups.all()), [group])

    def test_factories_groups_members(self):
        """We should be able to attach members to a group."""
        users = UserFactory.create_batch(2)
        group = GroupFactory(members=users)

        self.assertQuerysetEqual(group.members.all(), users, ordered=False)
        self.assertEqual(list(users[0].is_member_of.all()), [group])

    def test_factories_groups_administrators(self):
        """We should be able to attach administrators to a group."""
        users = UserFactory.create_batch(2)
        group = GroupFactory(administrators=users)

        self.assertQuerysetEqual(group.administrators.all(), users, ordered=False)
        self.assertEqual(list(users[0].is_administrator_of.all()), [group])
