"""
Tests for Rooms API endpoints in Magnify's core app: update
"""
import random

from rest_framework.test import APITestCase
from rest_framework_simplejwt.tokens import AccessToken

from magnify.apps.core.factories import GroupFactory, RoomFactory, UserFactory


class UpdateRoomsApiTestCase(APITestCase):
    """Test update requests on magnify's core app API endpoints."""

    def test_api_rooms_update_anonymous(self):
        """Anonymous users should not be allowed to update a room."""
        room = RoomFactory(name="Old name")

        response = self.client.put(
            f"/api/rooms/{room.id!s}/",
            {
                "name": "New name",
            },
        )
        self.assertEqual(response.status_code, 401)
        room.refresh_from_db()
        self.assertEqual(room.name, "Old name")
        self.assertEqual(room.slug, "old-name")

    def test_api_rooms_update_authenticated(self):
        """Authenticated users should not be allowed to update a room."""
        user = UserFactory()
        room = RoomFactory(name="Old name")
        jwt_token = AccessToken.for_user(user)

        response = self.client.put(
            f"/api/rooms/{room.id!s}/",
            {
                "name": "New name",
            },
            HTTP_AUTHORIZATION=f"Bearer {jwt_token}",
        )
        self.assertEqual(response.status_code, 403)
        room.refresh_from_db()
        self.assertEqual(room.name, "Old name")
        self.assertEqual(room.slug, "old-name")

    def test_api_rooms_update_members_direct(self):
        """
        Users who are direct members of a room but not administrators should
        not be allowed to update it.
        """
        user = UserFactory()
        room = RoomFactory(name="Old name", users=[(user, "member")])
        jwt_token = AccessToken.for_user(user)

        new_is_public = not room.is_public
        response = self.client.put(
            f"/api/rooms/{room.id!s}/",
            {
                "name": "New name",
                "slug": "should-be-ignored",
                "is_public": new_is_public,
                "configuration": {"the_key": "the_value"},
            },
            format="json",
            HTTP_AUTHORIZATION=f"Bearer {jwt_token}",
        )
        self.assertEqual(response.status_code, 403)
        room.refresh_from_db()
        self.assertEqual(room.name, "Old name")
        self.assertEqual(room.slug, "old-name")
        self.assertEqual(room.is_public, not new_is_public)
        self.assertEqual(room.configuration, {})

    def test_api_rooms_update_members_via_group(self):
        """
        User who are members of a room via a group but not administrators should
        not be allowed to update it.
        """
        user = UserFactory()
        group = GroupFactory(members=[user])
        room = RoomFactory(name="Old name", groups=[(group, "member")])
        jwt_token = AccessToken.for_user(user)

        new_is_public = not room.is_public
        response = self.client.put(
            f"/api/rooms/{room.id!s}/",
            {
                "name": "New name",
                "slug": "should-be-ignored",
                "is_public": new_is_public,
                "configuration": {"the_key": "the_value"},
            },
            format="json",
            HTTP_AUTHORIZATION=f"Bearer {jwt_token}",
        )
        self.assertEqual(response.status_code, 403)
        room.refresh_from_db()
        self.assertEqual(room.name, "Old name")
        self.assertEqual(room.slug, "old-name")
        self.assertEqual(room.is_public, not new_is_public)
        self.assertEqual(room.configuration, {})

    def test_api_rooms_update_administrators_direct(self):
        """Direct administrators or owners of a room should be allowed to update it."""
        user = UserFactory()
        room = RoomFactory(users=[(user, random.choice(["administrator", "owner"]))])
        jwt_token = AccessToken.for_user(user)

        new_is_public = not room.is_public
        response = self.client.put(
            f"/api/rooms/{room.id!s}/",
            {
                "name": "New name",
                "slug": "should-be-ignored",
                "is_public": new_is_public,
                "configuration": {"the_key": "the_value"},
            },
            format="json",
            HTTP_AUTHORIZATION=f"Bearer {jwt_token}",
        )
        self.assertEqual(response.status_code, 200)
        room.refresh_from_db()
        self.assertEqual(room.name, "New name")
        self.assertEqual(room.slug, "new-name")
        self.assertEqual(room.is_public, new_is_public)
        self.assertEqual(room.configuration, {"the_key": "the_value"})

    def test_api_rooms_update_administrators_via_group(self):
        """
        Users who are administrators of a room via a group should be allowed
        to update it.
        """
        user = UserFactory()
        group = GroupFactory(members=[user])
        room = RoomFactory(groups=[(group, "administrator")])
        jwt_token = AccessToken.for_user(user)

        new_is_public = not room.is_public
        response = self.client.put(
            f"/api/rooms/{room.id!s}/",
            {
                "name": "New name",
                "slug": "should-be-ignored",
                "is_public": new_is_public,
                "configuration": {"the_key": "the_value"},
            },
            format="json",
            HTTP_AUTHORIZATION=f"Bearer {jwt_token}",
        )
        self.assertEqual(response.status_code, 200)
        room.refresh_from_db()
        self.assertEqual(room.name, "New name")
        self.assertEqual(room.slug, "new-name")
        self.assertEqual(room.is_public, new_is_public)
        self.assertEqual(room.configuration, {"the_key": "the_value"})

    def test_api_rooms_update_administrators_of_another(self):
        """
        Being administrator or owner of a room should not grant authorization to update
        another room.
        """
        user = UserFactory()
        RoomFactory(users=[(user, random.choice(["administrator", "owner"]))])
        other_room = RoomFactory(name="Old name")
        jwt_token = AccessToken.for_user(user)

        response = self.client.put(
            f"/api/rooms/{other_room.id!s}/",
            {"name": "New name", "slug": "should-be-ignored"},
            HTTP_AUTHORIZATION=f"Bearer {jwt_token}",
        )
        self.assertEqual(response.status_code, 403)
        other_room.refresh_from_db()
        self.assertEqual(other_room.name, "Old name")
        self.assertEqual(other_room.slug, "old-name")
