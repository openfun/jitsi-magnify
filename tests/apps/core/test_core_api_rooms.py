"""
Tests for Rooms API endpoints in Magnify's core app.
"""
from unittest import mock

from rest_framework.test import APITestCase
from rest_framework_simplejwt.tokens import AccessToken

from magnify.apps.core.factories import GroupFactory, RoomFactory, UserFactory
from magnify.apps.core.models import Room


class RoomsApiTestCase(APITestCase):
    """Test requests on magnify's core app API endpoints."""

    @mock.patch(
        "magnify.apps.core.serializers.rooms.generate_token", return_value="the token"
    )
    def test_api_rooms_list_anonymous(self, mock_token):
        """Anonymous users should only be allowed to list public rooms."""
        RoomFactory(is_public=False)
        room_public = RoomFactory(is_public=True)

        response = self.client.get("/api/rooms/")
        self.assertEqual(response.status_code, 200)

        results = response.json()
        self.assertEqual(len(results), 1)

        self.assertEqual(
            results[0],
            {
                "id": str(room_public.id),
                "jitsi": {
                    "room": f"{room_public.slug:s}-{room_public.id!s}",
                    "token": "the token",
                },
                "name": room_public.name,
                "slug": room_public.slug,
            },
        )
        mock_token.assert_called_once()

    def test_api_rooms_list_authenticated(self):
        """
        Authenticated users should be able to list rooms that are public
        or to which they are related directly or via a group.
        """
        user = UserFactory()
        group = GroupFactory(members=[user])
        jwt_token = AccessToken.for_user(user)

        other_user = UserFactory()
        other_group = GroupFactory(members=[other_user])

        RoomFactory(is_public=False)
        room_public = RoomFactory(is_public=True)
        room_group_access_accesses = RoomFactory(is_public=False, groups=[group])
        room_user_accesses = RoomFactory(is_public=False, users=[user])
        RoomFactory(is_public=False, groups=[other_group])
        RoomFactory(is_public=False, users=[other_user])

        response = self.client.get(
            "/api/rooms/", HTTP_AUTHORIZATION=f"Bearer {jwt_token}"
        )

        self.assertEqual(response.status_code, 200)
        results = response.json()
        self.assertEqual(len(results), 3)
        expected_ids = {
            str(room_public.id),
            str(room_group_access_accesses.id),
            str(room_user_accesses.id),
        }
        results_id = {r["id"] for r in results}
        self.assertEqual(expected_ids, results_id)

    def test_api_rooms_retrieve_anonymous_private(self):
        """
        Anonymous users should be allowed to retrieve a private room but should not be
        given any token.
        """
        room = RoomFactory(is_public=False)
        response = self.client.get(f"/api/rooms/{room.id!s}/")

        self.assertEqual(response.status_code, 200)
        self.assertEqual(
            response.json(),
            {
                "id": str(room.id),
                "name": room.name,
                "slug": room.slug,
            },
        )

    @mock.patch(
        "magnify.apps.core.serializers.rooms.generate_token", return_value="the token"
    )
    def test_api_rooms_retrieve_anonymous_public(self, mock_token):
        """
        Anonymous users should be able to retrieve a room provded it is public.
        """
        room = RoomFactory(is_public=True)
        response = self.client.get(f"/api/rooms/{room.id!s}/")

        self.assertEqual(response.status_code, 200)
        self.assertEqual(
            response.json(),
            {
                "id": str(room.id),
                "jitsi": {
                    "room": f"{room.slug:s}-{room.id!s}",
                    "token": "the token",
                },
                "name": room.name,
                "slug": room.slug,
            },
        )
        mock_token.assert_called_once()

    @mock.patch(
        "magnify.apps.core.serializers.rooms.generate_token", return_value="the token"
    )
    def test_api_rooms_retrieve_authenticated_public(self, mock_token):
        """
        Authenticated users should be allowed to retrieve a room and get a token for a room to
        which they are not related, provided the room is public.
        They should not see related users and groups.
        """
        room = RoomFactory()

        user = UserFactory()
        jwt_token = AccessToken.for_user(user)

        response = self.client.get(
            f"/api/rooms/{room.id!s}/", HTTP_AUTHORIZATION=f"Bearer {jwt_token}"
        )
        self.assertEqual(response.status_code, 200)

        self.assertEqual(
            response.json(),
            {
                "id": str(room.id),
                "jitsi": {
                    "room": f"{room.slug:s}-{room.id!s}",
                    "token": "the token",
                },
                "name": room.name,
                "slug": room.slug,
            },
        )
        mock_token.assert_called_once_with(user, f"{room.slug:s}-{room.id!s}")

    def test_api_rooms_retrieve_authenticated(self):
        """
        Authenticated users should be allowed to retrieve a private room to which they
        are not related but should not be given any token.
        """
        room = RoomFactory(is_public=False)

        user = UserFactory()
        jwt_token = AccessToken.for_user(user)

        response = self.client.get(
            f"/api/rooms/{room.id!s}/", HTTP_AUTHORIZATION=f"Bearer {jwt_token}"
        )
        self.assertEqual(response.status_code, 200)

        self.assertEqual(
            response.json(),
            {
                "id": str(room.id),
                "name": room.name,
                "slug": room.slug,
            },
        )

    @mock.patch(
        "magnify.apps.core.serializers.rooms.generate_token", return_value="the token"
    )
    def test_api_rooms_retrieve_administrator_direct(self, mock_token):
        """
        A user who is a direct administrator of a room should be allowed to see related users
        and groups.
        """
        user = UserFactory()
        group = GroupFactory()
        room = RoomFactory(users=[(user, True)], groups=[group])

        jwt_token = AccessToken.for_user(user)

        with self.assertNumQueries(5):
            response = self.client.get(
                f"/api/rooms/{room.id!s}/", HTTP_AUTHORIZATION=f"Bearer {jwt_token}"
            )
        self.assertEqual(response.status_code, 200)

        user_access = room.user_accesses.first()
        group_access = room.group_accesses.first()
        self.assertEqual(
            response.json(),
            {
                "groups": [
                    {
                        "id": str(group_access.id),
                        "group": str(group.id),
                        "room": str(room.id),
                        "is_administrator": group_access.is_administrator,
                    }
                ],
                "users": [
                    {
                        "id": str(user_access.id),
                        "user": str(user.id),
                        "room": str(room.id),
                        "is_administrator": user_access.is_administrator,
                    }
                ],
                "id": str(room.id),
                "jitsi": {
                    "room": f"{room.slug:s}-{room.id!s}",
                    "token": "the token",
                },
                "name": room.name,
                "slug": room.slug,
            },
        )
        mock_token.assert_called_once_with(
            user,
            f"{room.slug:s}-{room.id!s}",
        )

    @mock.patch(
        "magnify.apps.core.serializers.rooms.generate_token", return_value="the token"
    )
    def test_api_rooms_retrieve_administrator_via_group(self, mock_token):
        """
        A user who is administrator of a room via a group should be allowed to see related users
        and groups.
        """
        user = UserFactory()
        administrator = UserFactory()
        group = GroupFactory(members=[administrator])
        room = RoomFactory(users=[(user, False)], groups=[(group, True)])

        jwt_token = AccessToken.for_user(administrator)

        response = self.client.get(
            f"/api/rooms/{room.id!s}/", HTTP_AUTHORIZATION=f"Bearer {jwt_token}"
        )
        self.assertEqual(response.status_code, 200)

        user_access = room.user_accesses.first()
        group_access = room.group_accesses.first()
        self.assertEqual(
            response.json(),
            {
                "groups": [
                    {
                        "id": str(group_access.id),
                        "group": str(group.id),
                        "room": str(room.id),
                        "is_administrator": group_access.is_administrator,
                    }
                ],
                "users": [
                    {
                        "id": str(user_access.id),
                        "user": str(user.id),
                        "room": str(room.id),
                        "is_administrator": user_access.is_administrator,
                    }
                ],
                "id": str(room.id),
                "jitsi": {
                    "room": f"{room.slug:s}-{room.id!s}",
                    "token": "the token",
                },
                "name": room.name,
                "slug": room.slug,
            },
        )
        mock_token.assert_called_once_with(administrator, f"{room.slug:s}-{room.id!s}")

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
        self.assertTrue(
            room.user_accesses.filter(is_administrator=True, user=user).exists()
        )

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

    def test_api_rooms_update_administrator_users(self):
        """Direct administrators of a room should be allowed to update it."""
        user = UserFactory()
        room = RoomFactory(users=[(user, True)])
        jwt_token = AccessToken.for_user(user)

        response = self.client.put(
            f"/api/rooms/{room.id!s}/",
            {"name": "New name", "slug": "should-be-ignored"},
            HTTP_AUTHORIZATION=f"Bearer {jwt_token}",
        )
        self.assertEqual(response.status_code, 200)
        room.refresh_from_db()
        self.assertEqual(room.name, "New name")
        self.assertEqual(room.slug, "new-name")

    def test_api_rooms_update_administrator_groups(self):
        """Users who are administrators of a room via a group should be allowed to update it."""
        user = UserFactory()
        group = GroupFactory(members=[user])
        room = RoomFactory(groups=[(group, True)])
        jwt_token = AccessToken.for_user(user)

        response = self.client.put(
            f"/api/rooms/{room.id!s}/",
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
        RoomFactory(users=[(user, True)])
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
        Authenticated users should not be allowed to delete a room for which they are not
        administrator.
        """
        room = RoomFactory()
        user = UserFactory()
        jwt_token = AccessToken.for_user(user)

        response = self.client.delete(
            f"/api/rooms/{room.id!s}/", HTTP_AUTHORIZATION=f"Bearer {jwt_token}"
        )

        self.assertEqual(response.status_code, 403)
        self.assertEqual(Room.objects.count(), 1)

    def test_api_rooms_delete_administrator_users(self):
        """
        Authenticated users should be able to delete a room for which they are directly
        administrator.
        """
        user = UserFactory()
        room = RoomFactory(users=[(user, True)])
        jwt_token = AccessToken.for_user(user)

        response = self.client.delete(
            f"/api/rooms/{room.id}/", HTTP_AUTHORIZATION=f"Bearer {jwt_token}"
        )

        self.assertEqual(response.status_code, 204)
        self.assertFalse(Room.objects.exists())

    def test_api_rooms_delete_administrator_groups(self):
        """
        Authenticated users should be able to delete a room for which they are administrator
        via a group.
        """
        user = UserFactory()
        group = GroupFactory(members=[user])
        room = RoomFactory(groups=[(group, True)])
        jwt_token = AccessToken.for_user(user)

        response = self.client.delete(
            f"/api/rooms/{room.id!s}/", HTTP_AUTHORIZATION=f"Bearer {jwt_token}"
        )

        self.assertEqual(response.status_code, 204)
        self.assertFalse(Room.objects.exists())
