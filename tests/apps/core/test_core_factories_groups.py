"""
Unit tests for the Group factory
"""
import random
from uuid import UUID

from django.test import TestCase

from magnify.apps.core.factories import (
    GroupFactory,
    MeetingFactory,
    RoomFactory,
    UserFactory,
)
from magnify.apps.core.models import Membership


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

        self.assertQuerysetEqual(group.related_meetings.all(), meetings, ordered=False)
        self.assertEqual(list(meetings[0].groups.all()), [group])

    def test_factories_groups_rooms(self):
        """We should be able to attach rooms to a group."""
        rooms = RoomFactory.create_batch(2)
        group = GroupFactory(rooms=rooms)

        self.assertQuerysetEqual(group.related_rooms.all(), rooms, ordered=False)
        self.assertEqual(list(rooms[0].groups.all()), [group])

    def test_factories_groups_members(self):
        """We should be able to attach members to a group."""
        users = UserFactory.create_batch(2)
        group = GroupFactory(members=users)

        self.assertQuerysetEqual(group.members.all(), users, ordered=False)
        self.assertEqual(list(users[0].is_member_of.all()), [group])

    def test_factories_groups_administrators(self):
        """We should be able to attach members as administrators to a group."""
        users = UserFactory.create_batch(3)
        administrator_statuses = [random.choice([True, False]) for u in users]
        group = GroupFactory(members=zip(users, administrator_statuses))

        self.assertQuerysetEqual(group.members.all(), users, ordered=False)
        for i, _user in enumerate(users):
            self.assertEqual(list(users[i].is_member_of.all()), [group])

        for i, membership in enumerate(Membership.objects.all()):
            self.assertEqual(membership.is_administrator, administrator_statuses[i])
