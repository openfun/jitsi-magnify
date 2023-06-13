"""
Tests for Rooms API endpoints in Magnify's core app: list
"""
from unittest import mock

from rest_framework.pagination import PageNumberPagination
from rest_framework.test import APITestCase
from rest_framework_simplejwt.tokens import AccessToken

from magnify.apps.core.factories import GroupFactory, RoomFactory, UserFactory


class ListRoomsApiTestCase(APITestCase):
    """Test list requests on magnify's core app API endpoints."""

    def test_api_rooms_list_anonymous(self):
        """Anonymous users should not be able to list rooms."""
        RoomFactory(is_public=False)
        RoomFactory(is_public=True)

        response = self.client.get("/api/rooms/")
        self.assertEqual(response.status_code, 200)

        results = response.json()["results"]
        self.assertEqual(len(results), 0)

    def test_api_rooms_list_authenticated(self):
        """
        Authenticated users listing rooms, should only see the rooms to which they are
        related directly or via a group.
        """
        user = UserFactory()
        group = GroupFactory(members=[user])
        jwt_token = AccessToken.for_user(user)

        other_user = UserFactory()
        other_group = GroupFactory(members=[other_user])

        RoomFactory(is_public=False)
        RoomFactory(is_public=True)
        room_group_access_accesses = RoomFactory(is_public=False, groups=[group])
        room_user_accesses = RoomFactory(is_public=False, users=[user])
        RoomFactory(is_public=False, groups=[other_group])
        RoomFactory(is_public=False, users=[other_user])

        response = self.client.get(
            "/api/rooms/", HTTP_AUTHORIZATION=f"Bearer {jwt_token}"
        )

        self.assertEqual(response.status_code, 200)
        results = response.json()["results"]
        self.assertEqual(len(results), 2)
        expected_ids = {
            str(room_group_access_accesses.id),
            str(room_user_accesses.id),
        }
        results_id = {result["id"] for result in results}
        self.assertEqual(expected_ids, results_id)

    @mock.patch.object(PageNumberPagination, "get_page_size", return_value=2)
    def test_api_rooms_list_pagination(self, _mock_page_size):
        """Pagination should work as expected."""
        user = UserFactory()
        jwt_token = AccessToken.for_user(user)

        rooms = RoomFactory.create_batch(3, users=[user])
        room_ids = [str(room.id) for room in rooms]

        response = self.client.get(
            "/api/rooms/", HTTP_AUTHORIZATION=f"Bearer {jwt_token}"
        )

        self.assertEqual(response.status_code, 200)
        content = response.json()
        self.assertEqual(content["count"], 3)
        self.assertEqual(content["next"], "http://testserver/api/rooms/?page=2")
        self.assertIsNone(content["previous"])

        self.assertEqual(len(content["results"]), 2)
        for item in content["results"]:
            room_ids.remove(item["id"])

        # Get page 2
        response = self.client.get(
            "/api/rooms/?page=2", HTTP_AUTHORIZATION=f"Bearer {jwt_token}"
        )

        self.assertEqual(response.status_code, 200)
        content = response.json()

        self.assertEqual(content["count"], 3)
        self.assertIsNone(content["next"])
        self.assertEqual(content["previous"], "http://testserver/api/rooms/")

        self.assertEqual(len(content["results"]), 1)
        room_ids.remove(content["results"][0]["id"])
        self.assertEqual(room_ids, [])

    def test_api_rooms_list_authenticated_distinct(self):
        """A public room with several related users should only be listed once."""
        user = UserFactory()
        other_user = UserFactory()
        jwt_token = AccessToken.for_user(user)

        room = RoomFactory(is_public=True, users=[user, other_user])

        response = self.client.get(
            "/api/rooms/", HTTP_AUTHORIZATION=f"Bearer {jwt_token}"
        )

        self.assertEqual(response.status_code, 200)
        content = response.json()
        self.assertEqual(len(content["results"]), 1)
        self.assertEqual(content["results"][0]["id"], str(room.id))
