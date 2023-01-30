"""
Tests for Rooms API endpoints in Magnify's core app.
"""
import random
from unittest import mock

from django.contrib.auth.models import AnonymousUser
from django.test.utils import override_settings

from rest_framework.pagination import PageNumberPagination
from rest_framework.test import APITestCase
from rest_framework_simplejwt.tokens import AccessToken

from magnify.apps.core.factories import (
    GroupFactory,
    GroupResourceAccessFactory,
    RoomFactory,
    UserFactory,
    UserResourceAccessFactory,
)
from magnify.apps.core.models import Room

# pylint: disable=too-many-public-methods


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

        results = response.json()["results"]
        self.assertEqual(len(results), 1)

        self.assertEqual(
            results[0],
            {
                "id": str(room_public.id),
                "is_administrable": False,
                "is_public": True,
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
        results = response.json()["results"]
        self.assertEqual(len(results), 3)
        expected_ids = {
            str(room_public.id),
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

        rooms = RoomFactory.create_batch(3, is_public=True)
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

    def test_api_rooms_retrieve_anonymous_private_pk(self):
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
                "is_administrable": False,
                "is_public": False,
                "name": room.name,
                "slug": room.slug,
            },
        )

    def test_api_rooms_retrieve_anonymous_private_slug(self):
        """It sbhould be possible to get a room by its slug."""
        room = RoomFactory(is_public=False)
        response = self.client.get(f"/api/rooms/{room.slug!s}/")

        self.assertEqual(response.status_code, 200)
        self.assertEqual(
            response.json(),
            {
                "id": str(room.id),
                "is_administrable": False,
                "is_public": False,
                "name": room.name,
                "slug": room.slug,
            },
        )

    def test_api_rooms_retrieve_anonymous_private_slug_not_normalized(self):
        """Getting a room by a slug that is not normalized should work."""
        room = RoomFactory(name="Réunion", is_public=False)
        response = self.client.get("/api/rooms/Réunion/")

        self.assertEqual(response.status_code, 200)
        self.assertEqual(
            response.json(),
            {
                "id": str(room.id),
                "is_administrable": False,
                "is_public": False,
                "name": room.name,
                "slug": room.slug,
            },
        )

    @override_settings(ALLOW_UNREGISTERED_ROOMS=True)
    @mock.patch("magnify.apps.core.utils.generate_token", return_value="the token")
    def test_api_rooms_retrieve_anonymous_unregistered_allowed(self, mock_token):
        """
        Retrieving an unregistered room should return a Jitsi token if unregistered rooms
        are allowed.
        """
        response = self.client.get("/api/rooms/unregistered-room/")

        self.assertEqual(response.status_code, 200)
        self.assertEqual(
            response.json(),
            {
                "id": None,
                "jitsi": {
                    "room": "unregistered-room",
                    "token": "the token",
                },
            },
        )
        mock_token.assert_called_once_with(
            AnonymousUser(), "unregistered-room", is_admin=True
        )

    @override_settings(ALLOW_UNREGISTERED_ROOMS=True)
    @mock.patch("magnify.apps.core.utils.generate_token", return_value="the token")
    def test_api_rooms_retrieve_anonymous_unregistered_allowed_not_normalized(
        self, mock_token
    ):
        """
        Getting an unregistered room by a slug that is not normalized should work and use the Jitsi
        room on the slugified name.
        """
        response = self.client.get("/api/rooms/Réunion/")

        self.assertEqual(response.status_code, 200)
        self.assertEqual(
            response.json(),
            {
                "id": None,
                "jitsi": {
                    "room": "reunion",
                    "token": "the token",
                },
            },
        )
        mock_token.assert_called_once_with(AnonymousUser(), "reunion", is_admin=True)

    @override_settings(ALLOW_UNREGISTERED_ROOMS=False)
    def test_api_rooms_retrieve_anonymous_unregistered_not_allowed(self):
        """
        Retrieving an unregistered room should return a 404 if unregistered rooms are not allowed.
        """
        response = self.client.get("/api/rooms/unregistered-room/")

        self.assertEqual(response.status_code, 404)
        self.assertEqual(response.json(), {"detail": "Not found."})

    @mock.patch(
        "magnify.apps.core.serializers.rooms.generate_token", return_value="the token"
    )
    def test_api_rooms_retrieve_anonymous_public(self, mock_token):
        """
        Anonymous users should be able to retrieve a room with a token provided it is public.
        """
        room = RoomFactory(is_public=True)
        response = self.client.get(f"/api/rooms/{room.id!s}/")

        self.assertEqual(response.status_code, 200)
        self.assertEqual(
            response.json(),
            {
                "id": str(room.id),
                "is_administrable": False,
                "is_public": True,
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
        room = RoomFactory(is_public=True)

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
                "is_administrable": False,
                "is_public": True,
                "jitsi": {
                    "room": f"{room.slug:s}-{room.id!s}",
                    "token": "the token",
                },
                "name": room.name,
                "slug": room.slug,
            },
        )
        mock_token.assert_called_once_with(
            user, f"{room.slug:s}-{room.id!s}", is_admin=False
        )

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
                "is_administrable": False,
                "is_public": False,
                "name": room.name,
                "slug": room.slug,
            },
        )

    @mock.patch(
        "magnify.apps.core.serializers.rooms.generate_token", return_value="the token"
    )
    def test_api_rooms_retrieve_members_direct(self, mock_token):
        """
        Users who are direct members of a room should be allowed to see related users and groups.
        """
        user = UserFactory()
        other_user = UserFactory()
        group = GroupFactory()
        room = RoomFactory()
        user_access = UserResourceAccessFactory(resource=room, user=user, role="member")
        other_user_access = UserResourceAccessFactory(
            resource=room, user=other_user, role="member"
        )
        group_access = GroupResourceAccessFactory(resource=room, group=group)
        jwt_token = AccessToken.for_user(user)

        with self.assertNumQueries(4):
            response = self.client.get(
                f"/api/rooms/{room.id!s}/", HTTP_AUTHORIZATION=f"Bearer {jwt_token}"
            )
        self.assertEqual(response.status_code, 200)
        content_dict = response.json()
        # Access objects order is uncertain and we don't care
        self.assertCountEqual(
            content_dict.pop("accesses"),
            [
                {
                    "id": str(user_access.id),
                    "group": None,
                    "user": {
                        "id": str(user_access.user.id),
                        # Email is visible only by self
                        "email": user_access.user.email,
                        "is_device": False,
                        "language": user_access.user.language,
                        "name": user_access.user.name,
                        "timezone": user_access.user.timezone.key,
                        "username": user_access.user.username,
                    },
                    "resource": str(room.id),
                    "role": user_access.role,
                },
                {
                    "id": str(other_user_access.id),
                    "group": None,
                    "user": {
                        "id": str(other_user_access.user.id),
                        "is_device": False,
                        "language": other_user_access.user.language,
                        "name": other_user_access.user.name,
                        "timezone": other_user_access.user.timezone.key,
                        "username": other_user_access.user.username,
                    },
                    "resource": str(room.id),
                    "role": other_user_access.role,
                },
                {
                    "id": str(group_access.id),
                    "group": {
                        "id": str(group.id),
                        "name": group.name,
                    },
                    "user": None,
                    "resource": str(room.id),
                    "role": group_access.role,
                },
            ],
        )
        self.assertEqual(
            content_dict,
            {
                "id": str(room.id),
                "is_administrable": False,
                "is_public": room.is_public,
                "jitsi": {
                    "room": f"{room.slug:s}-{room.id!s}",
                    "token": "the token",
                },
                "name": room.name,
                "slug": room.slug,
            },
        )
        mock_token.assert_called_once_with(
            user, f"{room.slug:s}-{room.id!s}", is_admin=False
        )

    @mock.patch(
        "magnify.apps.core.serializers.rooms.generate_token", return_value="the token"
    )
    def test_api_rooms_retrieve_members_via_group(self, mock_token):
        """
        Users who are members of a room via a group should be allowed to see related
        users and groups.
        """
        user = UserFactory()
        group = GroupFactory(members=[user])
        other_user = UserFactory()
        other_group = GroupFactory()
        room = RoomFactory()
        group_access = GroupResourceAccessFactory(
            resource=room, group=group, role="member"
        )
        other_user_access = UserResourceAccessFactory(
            resource=room, user=other_user, role="member"
        )
        other_group_access = GroupResourceAccessFactory(
            resource=room, group=other_group
        )
        jwt_token = AccessToken.for_user(user)

        with self.assertNumQueries(4):
            response = self.client.get(
                f"/api/rooms/{room.id!s}/", HTTP_AUTHORIZATION=f"Bearer {jwt_token}"
            )
        self.assertEqual(response.status_code, 200)
        content_dict = response.json()
        # Access objects order is uncertain and we don't care
        self.assertCountEqual(
            content_dict.pop("accesses"),
            [
                {
                    "id": str(other_user_access.id),
                    "group": None,
                    "role": other_user_access.role,
                    "resource": str(room.id),
                    "user": {
                        "id": str(other_user_access.user.id),
                        "is_device": False,
                        "language": other_user_access.user.language,
                        "name": other_user_access.user.name,
                        "timezone": other_user_access.user.timezone.key,
                        "username": other_user_access.user.username,
                    },
                },
                {
                    "id": str(group_access.id),
                    "group": {
                        "id": str(group.id),
                        "name": group.name,
                    },
                    "role": group_access.role,
                    "resource": str(room.id),
                    "user": None,
                },
                {
                    "id": str(other_group_access.id),
                    "group": {
                        "id": str(other_group.id),
                        "name": other_group.name,
                    },
                    "role": other_group_access.role,
                    "resource": str(room.id),
                    "user": None,
                },
            ],
        )
        self.assertEqual(
            content_dict,
            {
                "id": str(room.id),
                "is_administrable": False,
                "is_public": room.is_public,
                "jitsi": {
                    "room": f"{room.slug:s}-{room.id!s}",
                    "token": "the token",
                },
                "name": room.name,
                "slug": room.slug,
            },
        )
        mock_token.assert_called_once_with(
            user, f"{room.slug:s}-{room.id!s}", is_admin=False
        )

    @mock.patch(
        "magnify.apps.core.serializers.rooms.generate_token", return_value="the token"
    )
    def test_api_rooms_retrieve_administrators_direct(self, mock_token):
        """
        A user who is a direct administrator or owner of a room should be allowed to see related
        users and groups.
        """
        user = UserFactory()
        other_user = UserFactory()
        group = GroupFactory()
        room = RoomFactory()
        user_access = UserResourceAccessFactory(
            resource=room, user=user, role=random.choice(["administrator", "owner"])
        )
        other_user_access = UserResourceAccessFactory(
            resource=room, user=other_user, role="member"
        )
        group_access = GroupResourceAccessFactory(resource=room, group=group)
        jwt_token = AccessToken.for_user(user)

        with self.assertNumQueries(4):
            response = self.client.get(
                f"/api/rooms/{room.id!s}/", HTTP_AUTHORIZATION=f"Bearer {jwt_token}"
            )
        self.assertEqual(response.status_code, 200)
        content_dict = response.json()
        # Access objects order is uncertain and we don't care
        self.assertCountEqual(
            content_dict.pop("accesses"),
            [
                {
                    "id": str(other_user_access.id),
                    "group": None,
                    "user": {
                        "id": str(other_user_access.user.id),
                        "is_device": False,
                        "language": other_user_access.user.language,
                        "name": other_user_access.user.name,
                        "timezone": other_user_access.user.timezone.key,
                        "username": other_user_access.user.username,
                    },
                    "resource": str(room.id),
                    "role": other_user_access.role,
                },
                {
                    "id": str(user_access.id),
                    "group": None,
                    "user": {
                        "id": str(user_access.user.id),
                        # Email is visible only by self
                        "email": user_access.user.email,
                        "is_device": False,
                        "language": user_access.user.language,
                        "name": user_access.user.name,
                        "timezone": user_access.user.timezone.key,
                        "username": user_access.user.username,
                    },
                    "resource": str(room.id),
                    "role": user_access.role,
                },
                {
                    "id": str(group_access.id),
                    "group": {
                        "id": str(group.id),
                        "name": group.name,
                    },
                    "user": None,
                    "resource": str(room.id),
                    "role": group_access.role,
                },
            ],
        )
        self.assertEqual(
            content_dict,
            {
                "id": str(room.id),
                "is_administrable": True,
                "is_public": room.is_public,
                "configuration": {},
                "jitsi": {
                    "room": f"{room.slug:s}-{room.id!s}",
                    "token": "the token",
                },
                "name": room.name,
                "slug": room.slug,
            },
        )
        mock_token.assert_called_once_with(
            user, f"{room.slug:s}-{room.id!s}", is_admin=True
        )

    @mock.patch(
        "magnify.apps.core.serializers.rooms.generate_token", return_value="the token"
    )
    def test_api_rooms_retrieve_administrators_via_group(self, mock_token):
        """
        A user who is administrator of a room via a group should be allowed to see
        related users and groups.
        """
        user = UserFactory()
        administrator = UserFactory()
        group = GroupFactory(members=[administrator])
        room = RoomFactory(
            users=[(user, "member")],
            groups=[(group, "administrator")],
        )

        jwt_token = AccessToken.for_user(administrator)

        response = self.client.get(
            f"/api/rooms/{room.id!s}/", HTTP_AUTHORIZATION=f"Bearer {jwt_token}"
        )
        self.assertEqual(response.status_code, 200)

        access1, access2 = room.accesses.all()
        self.assertCountEqual(
            response.json(),
            {
                "id": str(room.id),
                "accesses": [
                    {
                        "id": str(access1.id),
                        "group": None,
                        "user": {
                            "id": str(user.id),
                            "is_device": False,
                            "language": user.language,
                            "name": user.name,
                            "username": user.username,
                        },
                        "resource": str(room.id),
                        "role": "member",
                    },
                    {
                        "id": str(access2.id),
                        "group": {
                            "id": str(group.id),
                            "name": group.name,
                        },
                        "user": None,
                        "resource": str(room.id),
                        "role": "administrator",
                    },
                ],
                "is_administrable": True,
                "is_public": room.is_public,
                "configuration": {},
                "jitsi": {
                    "room": f"{room.slug:s}-{room.id!s}",
                    "token": "the token",
                },
                "name": room.name,
                "slug": room.slug,
            },
        )
        mock_token.assert_called_once_with(
            administrator, f"{room.slug:s}-{room.id!s}", is_admin=True
        )

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
