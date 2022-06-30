"""
Tests for Rooms API endpoints in Magnify's core app.
"""
from unittest import mock

from rest_framework.test import APITestCase
from rest_framework_simplejwt.tokens import AccessToken

from magnify.apps.core.factories import RoomFactory, UserFactory
from magnify.apps.core.models import Room


class RoomsApiTestCase(APITestCase):
    """Test requests on magnify's core app API endpoints."""

    def test_api_rooms_list_anonymous(self):
        """Anonymous users should not be allowed to list rooms."""
        RoomFactory.create_batch(2)
        response = self.client.get("/api/rooms/")
        self.assertEqual(response.status_code, 401)
        self.assertEqual(
            response.json(), {"detail": "Authentication credentials were not provided."}
        )

    def test_api_rooms_list_authenticated(self):
        """Authenticated users should be able to list rooms in which they are administrators."""
        user = UserFactory()
        rooms = RoomFactory.create_batch(2, administrators=[user])
        RoomFactory()
        jwt_token = AccessToken.for_user(user)

        response = self.client.get(
            "/api/rooms/", HTTP_AUTHORIZATION=f"Bearer {jwt_token}"
        )

        self.assertEqual(response.status_code, 200)
        results = response.json()
        self.assertEqual(len(results), 2)
        expected_ids = {r.id for r in rooms}
        results_id = {r["id"] for r in results}
        self.assertEqual(expected_ids, results_id)

    def test_api_rooms_retrieve_anonymous(self):
        """Anonymous users should not be allowed to retrieve a room."""
        room = RoomFactory()
        response = self.client.get(f"/api/rooms/{room.id}/")

        self.assertEqual(response.status_code, 401)
        self.assertEqual(
            response.json(), {"detail": "Authentication credentials were not provided."}
        )

    @mock.patch(
        "magnify.apps.core.serializers.rooms.generate_token", return_value="the token"
    )
    def test_api_rooms_retrieve_authenticated(self, mock_token):
        """Authenticated users should be allowed to retrieve a room and get a token."""
        admin = UserFactory()
        room = RoomFactory(administrators=[admin])
        user = UserFactory()
        jwt_token = AccessToken.for_user(user)

        response = self.client.get(
            f"/api/rooms/{room.id}/", HTTP_AUTHORIZATION=f"Bearer {jwt_token}"
        )
        self.assertEqual(response.status_code, 200)
        self.assertEqual(
            response.json(),
            {
                "administrators": [admin.id],
                "id": room.id,
                "name": room.name,
                "slug": room.slug,
                "token": "the token",
            },
        )
        mock_token.assert_called_once_with(user, room.slug)

    def test_api_rooms_create_anonymous(self):
        """Anonymous users should not be allowed to create rooms."""
        response = self.client.post(
            "/api/rooms/",
            {
                "name": "my room",
            },
        )

        self.assertEqual(response.status_code, 401)

    def test_api_rooms_create_authenticated(self):
        """
        Authenticated users should be able to create rooms and should automatically be declared
        as administrators of the newly created room.
        """
        user = UserFactory()
        jwt_token = AccessToken.for_user(user)

        response = self.client.post(
            "/api/rooms/",
            {
                "name": "my room",
            },
            HTTP_AUTHORIZATION=f"Bearer {jwt_token}",
        )

        self.assertEqual(response.status_code, 201)
        room = Room.objects.get()
        self.assertEqual(room.administrators.get(), user)

    def test_api_rooms_create_authenticated_existing_slug(self):
        """
        A user trying to create a room with a name that translates to a slug that already exists
        should receive a 400 error.
        """
        RoomFactory(name="my room")
        user = UserFactory()
        jwt_token = AccessToken.for_user(user)

        response = self.client.post(
            "/api/rooms/",
            {
                "name": "My Room!",
            },
            HTTP_AUTHORIZATION=f"Bearer {jwt_token}",
        )

        self.assertEqual(response.status_code, 400)
        self.assertEqual(
            response.json(), {"slug": ["Room with this Slug already exists."]}
        )

    def test_api_rooms_update_authenticated(self):
        """Authenticated users should not be allowed to update it."""
        user = UserFactory()
        room = RoomFactory(name="Old name")
        jwt_token = AccessToken.for_user(user)

        response = self.client.put(
            f"/api/rooms/{room.id}/",
            {
                "name": "New name",
            },
            HTTP_AUTHORIZATION=f"Bearer {jwt_token}",
        )
        self.assertEqual(response.status_code, 403)
        room.refresh_from_db()
        self.assertEqual(room.name, "Old name")
        self.assertEqual(room.slug, "old-name")

    def test_api_rooms_update_administrator(self):
        """Administrators of a room should be allowed to update it."""
        user = UserFactory()
        room = RoomFactory(administrators=[user])
        jwt_token = AccessToken.for_user(user)

        response = self.client.put(
            f"/api/rooms/{room.id}/",
            {"name": "New name", "slug": "should-be-ignored"},
            HTTP_AUTHORIZATION=f"Bearer {jwt_token}",
        )
        self.assertEqual(response.status_code, 200)
        room.refresh_from_db()
        self.assertEqual(room.name, "New name")
        self.assertEqual(room.slug, "new-name")

    def test_api_rooms_update_administrator_of_another(self):
        """Being administrator of a room should not grant authorization to update another room."""
        user = UserFactory()
        RoomFactory(administrators=[user])
        other_room = RoomFactory(name="Old name")
        jwt_token = AccessToken.for_user(user)

        response = self.client.put(
            f"/api/rooms/{other_room.id}/",
            {"name": "New name", "slug": "should-be-ignored"},
            HTTP_AUTHORIZATION=f"Bearer {jwt_token}",
        )
        self.assertEqual(response.status_code, 403)
        other_room.refresh_from_db()
        self.assertEqual(other_room.name, "Old name")
        self.assertEqual(other_room.slug, "old-name")

    def test_api_rooms_delete_anonymous(self):
        """Anonymous users should not be allowed to destroy a room."""
        room = RoomFactory()

        response = self.client.delete(
            f"/api/rooms/{room.id}/",
        )

        self.assertEqual(response.status_code, 401)
        self.assertEqual(Room.objects.count(), 1)

    def test_api_rooms_delete_authenticated(self):
        """
        Authenticated users should not be allowed to delete a room for which they are not
        administrator.
        """
        room = RoomFactory()
        user = UserFactory()
        jwt_token = AccessToken.for_user(user)

        response = self.client.delete(
            f"/api/rooms/{room.id}/", HTTP_AUTHORIZATION=f"Bearer {jwt_token}"
        )

        self.assertEqual(response.status_code, 403)
        self.assertEqual(Room.objects.count(), 1)

    def test_api_rooms_delete_administrator(self):
        """
        Authenticated users should be able to delete a room for which they are administrator.
        """
        user = UserFactory()
        room = RoomFactory(administrators=[user])
        jwt_token = AccessToken.for_user(user)

        response = self.client.delete(
            f"/api/rooms/{room.id}/", HTTP_AUTHORIZATION=f"Bearer {jwt_token}"
        )

        self.assertEqual(response.status_code, 204)
        self.assertFalse(Room.objects.exists())
