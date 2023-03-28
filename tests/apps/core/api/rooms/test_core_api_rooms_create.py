"""
Tests for Rooms API endpoints in Magnify's core app: create
"""
from rest_framework.test import APITestCase
from rest_framework_simplejwt.tokens import AccessToken

from magnify.apps.core.factories import RoomFactory, UserFactory
from magnify.apps.core.models import Room


class CreateRoomsApiTestCase(APITestCase):
    """Test create requests on magnify's core app API endpoints."""

    def test_api_rooms_create_anonymous(self):
        """Anonymous users should not be allowed to create rooms."""
        response = self.client.post(
            "/api/rooms/",
            {
                "name": "my room",
            },
        )

        self.assertEqual(response.status_code, 401)
        self.assertFalse(Room.objects.exists())

    def test_api_rooms_create_authenticated(self):
        """
        Authenticated users should be able to create rooms and should automatically be declared
        as owner of the newly created room.
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
        self.assertEqual(room.name, "my room")
        self.assertEqual(room.slug, "my-room")
        self.assertTrue(room.accesses.filter(role="owner", user=user).exists())

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
