"""
Unit tests for the Room model
"""
from django.contrib.auth.models import AnonymousUser
from django.core.exceptions import ValidationError
from django.test import TestCase
from django.test.utils import override_settings

from magnify.apps.core.factories import (
    GroupFactory,
    LabelFactory,
    RoomFactory,
    UserFactory,
)
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
        # Remove hyphens because postgresql is ignoring them when they sort
        self.assertGreaterEqual(
            rooms[1].name.replace("-", ""), rooms[0].name.replace("-", "")
        )
        self.assertGreaterEqual(
            rooms[2].name.replace("-", ""), rooms[1].name.replace("-", "")
        )

    def test_models_rooms_name_maxlength(self):
        """The name field should be less than 100 characters."""
        RoomFactory(name="a" * 100)
        with self.assertRaises(ValidationError) as context:
            RoomFactory(name="a" * 101)

        self.assertEqual(
            context.exception.messages,
            [
                "Ensure this value has at most 100 characters (it has 101).",
            ],
        )

    @override_settings(JITSI_ROOM_PREFIX="1-2-3")
    def test_models_rooms_name_prefix(self):
        """It should be possible to set a prefix on the Jitsi room name."""
        room = RoomFactory(id="f629e68e-e256-44fe-8ba6-a7e0849de00b")
        self.assertEqual(room.jitsi_name, "123f629e68ee25644fe8ba6a7e0849de00b")

    def test_models_rooms_slug_unique(self):
        """Room slugs should be unique."""
        RoomFactory(name="a room!")

        with self.assertRaises(ValidationError) as context:
            RoomFactory(name="A Room!")

        self.assertEqual(
            context.exception.messages, ["Room with this Slug already exists."]
        )

    def test_models_rooms_name_slug_like_uuid(self):
        """
        It should raise an error if the value of the name field leads to a slug looking
        loke a UUID . We need unicity on the union of the `id` and `slug` fields.
        """
        with self.assertRaises(ValidationError) as context:
            RoomFactory(name="918689fb-038e 4e81-bf09 efd5902c5f0b")

        self.assertEqual(
            context.exception.messages,
            ['Room name "918689fb-038e 4e81-bf09 efd5902c5f0b" is reserved.'],
        )

    def test_models_rooms_slug_automatic(self):
        """Room slugs should be automatically populated upon saving."""
        room = Room(name="Eléphant in the room")
        room.save()
        self.assertEqual(room.slug, "elephant-in-the-room")

    def test_models_rooms_users(self):
        """It should be possible to attach users to a room."""
        room = RoomFactory()
        user = UserFactory()
        room.users.add(user)
        room.refresh_from_db()
        self.assertEqual(list(room.users.all()), [user])

    def test_models_rooms_groups(self):
        """It should be possible to attach groups to a room."""
        room = RoomFactory()
        group = GroupFactory()
        room.groups.add(group)
        room.refresh_from_db()
        self.assertEqual(list(room.groups.all()), [group])

    def test_models_rooms_labels(self):
        """It should be possible to attach labels to a room."""
        room = RoomFactory()
        label = LabelFactory()
        room.labels.add(label)
        room.refresh_from_db()
        self.assertEqual(list(room.labels.all()), [label])

    def test_models_rooms_is_public_default(self):
        """A room should be public by default."""
        room = Room.objects.create(name="room")
        self.assertTrue(room.is_public)

    # Access rights methods

    def test_models_rooms_access_rights_none(self):
        """Calling access rights methods with None should return None."""
        room = RoomFactory()

        with self.assertNumQueries(0):
            self.assertIsNone(room.get_role(None))
        with self.assertNumQueries(0):
            self.assertFalse(room.is_administrator(None))
        with self.assertNumQueries(0):
            self.assertFalse(room.is_owner(None))

    def test_models_rooms_access_rights_anonymous(self):
        """Check access rights methods on the room object for an anonymous user."""
        user = AnonymousUser()
        room = RoomFactory()

        with self.assertNumQueries(0):
            self.assertIsNone(room.get_role(user))
        with self.assertNumQueries(0):
            self.assertFalse(room.is_administrator(user))
        with self.assertNumQueries(0):
            self.assertFalse(room.is_owner(user))

    def test_models_rooms_access_rights_authenticated(self):
        """Check access rights methods on the room object for an unrelated user."""
        user = UserFactory()
        room = RoomFactory()

        with self.assertNumQueries(1):
            self.assertIsNone(room.get_role(user))
        with self.assertNumQueries(1):
            self.assertFalse(room.is_administrator(user))
        with self.assertNumQueries(1):
            self.assertFalse(room.is_owner(user))

    def test_models_rooms_access_rights_member_direct(self):
        """Check access rights methods on the room object for a direct member."""
        user = UserFactory()
        room = RoomFactory(users=[(user, "member")])

        with self.assertNumQueries(1):
            self.assertEqual(room.get_role(user), "member")
        with self.assertNumQueries(1):
            self.assertFalse(room.is_administrator(user))
        with self.assertNumQueries(1):
            self.assertFalse(room.is_owner(user))

    def test_models_rooms_access_rights_administrator_direct(self):
        """The is_administrator method should return True for a direct administrator."""
        user = UserFactory()
        room = RoomFactory(users=[(user, "administrator")])

        with self.assertNumQueries(1):
            self.assertEqual(room.get_role(user), "administrator")
        with self.assertNumQueries(1):
            self.assertTrue(room.is_administrator(user))
        with self.assertNumQueries(1):
            self.assertFalse(room.is_owner(user))

    def test_models_rooms_access_rights_owner_direct(self):
        """Check access rights methods on the room object for an owner."""
        user = UserFactory()
        room = RoomFactory(users=[(user, "owner")])

        with self.assertNumQueries(1):
            self.assertEqual(room.get_role(user), "owner")
        with self.assertNumQueries(1):
            self.assertTrue(room.is_administrator(user))
        with self.assertNumQueries(1):
            self.assertTrue(room.is_owner(user))

    def test_models_rooms_access_rights_member_via_group(self):
        """Check access rights methods on the room object for a member via a group."""
        user = UserFactory()
        group = GroupFactory(members=[user])
        room = RoomFactory(groups=[(group, "member")])

        with self.assertNumQueries(1):
            self.assertEqual(room.get_role(user), "member")
        with self.assertNumQueries(1):
            self.assertFalse(room.is_administrator(user))
        with self.assertNumQueries(1):
            self.assertFalse(room.is_owner(user))

    def test_models_rooms_access_rights_administrator_via_group(self):
        """The is_administrator method should return True for an administrator via a group."""
        user = UserFactory()
        group = GroupFactory(members=[user])
        room = RoomFactory(groups=[(group, "administrator")])

        with self.assertNumQueries(1):
            self.assertEqual(room.get_role(user), "administrator")
        with self.assertNumQueries(1):
            self.assertTrue(room.is_administrator(user))
        with self.assertNumQueries(1):
            self.assertFalse(room.is_owner(user))
