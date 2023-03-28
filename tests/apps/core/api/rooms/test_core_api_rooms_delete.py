"""
Tests for Rooms API endpoints in Magnify's core app: delete
"""
from rest_framework.test import APITestCase
from rest_framework_simplejwt.tokens import AccessToken

from magnify.apps.core.factories import GroupFactory, RoomFactory, UserFactory
from magnify.apps.core.models import Room


class DeleteRoomsApiTestCase(APITestCase):
    """Test delete requests on magnify's core app API endpoints."""

    def test_api_rooms_delete_anonymous(self):
        """Anonymous users should not be allowed to destroy a room."""
        room = RoomFactory()

        response = self.client.delete(
            f"/api/rooms/{room.id!s}/",
        )

        self.assertEqual(response.status_code, 401)
        self.assertEqual(Room.objects.count(), 1)

    def test_api_rooms_delete_authenticated(self):
        """
        Authenticated users should not be allowed to delete a room to which they are not
        related.
        """
        room = RoomFactory()
        user = UserFactory()
        jwt_token = AccessToken.for_user(user)

        response = self.client.delete(
            f"/api/rooms/{room.id!s}/", HTTP_AUTHORIZATION=f"Bearer {jwt_token}"
        )

        self.assertEqual(response.status_code, 403)
        self.assertEqual(Room.objects.count(), 1)

    def test_api_rooms_delete_members(self):
        """
        Authenticated users should not be allowed to delete a room for which they are
        only a member.
        """
        user = UserFactory()
        room = RoomFactory(
            users=[(user, "member")]
        )  # as user declared in the room but not administrator
        jwt_token = AccessToken.for_user(user)

        response = self.client.delete(
            f"/api/rooms/{room.id}/", HTTP_AUTHORIZATION=f"Bearer {jwt_token}"
        )

        self.assertEqual(response.status_code, 403)
        self.assertEqual(Room.objects.count(), 1)

    def test_api_rooms_delete_administrators_direct(self):
        """
        Authenticated users should not be allowed to delete a room for which they are
        administrator.
        """
        user = UserFactory()
        room = RoomFactory(users=[(user, "administrator")])
        jwt_token = AccessToken.for_user(user)

        response = self.client.delete(
            f"/api/rooms/{room.id}/", HTTP_AUTHORIZATION=f"Bearer {jwt_token}"
        )

        self.assertEqual(response.status_code, 403)
        self.assertEqual(Room.objects.count(), 1)

    def test_api_rooms_delete_administrators_via_group(self):
        """
        Authenticated users should not be able to delete a room for which they are administrator
        via a group.
        """
        user = UserFactory()
        group = GroupFactory(members=[user])
        room = RoomFactory(groups=[(group, "administrator")])
        jwt_token = AccessToken.for_user(user)

        response = self.client.delete(
            f"/api/rooms/{room.id!s}/", HTTP_AUTHORIZATION=f"Bearer {jwt_token}"
        )

        self.assertEqual(response.status_code, 403)
        self.assertEqual(Room.objects.count(), 1)

    def test_api_rooms_delete_owners(self):
        """
        Authenticated users should be able to delete a room for which they are directly
        owner.
        """
        user = UserFactory()
        room = RoomFactory(users=[(user, "owner")])
        jwt_token = AccessToken.for_user(user)

        response = self.client.delete(
            f"/api/rooms/{room.id}/", HTTP_AUTHORIZATION=f"Bearer {jwt_token}"
        )

        self.assertEqual(response.status_code, 204)
        self.assertFalse(Room.objects.exists())
