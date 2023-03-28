"""
Tests for Rooms API endpoints in Magnify's core app: retrieve
"""
import random
from unittest import mock

from django.contrib.auth.models import AnonymousUser
from django.test.utils import override_settings

from rest_framework.test import APITestCase
from rest_framework_simplejwt.tokens import AccessToken

from magnify.apps.core.factories import (
    GroupFactory,
    GroupResourceAccessFactory,
    RoomFactory,
    UserFactory,
    UserResourceAccessFactory,
)


class RetrieveRoomsApiTestCase(APITestCase):
    """Test retrieve requests on magnify's core app API endpoints."""

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

    def test_api_rooms_retrieve_anonymous_private_pk_no_dashes(self):
        """It should be possible to get a room by its id stripped of its dashes."""
        room = RoomFactory(is_public=False)
        id_no_dashes = str(room.id).replace("-", "")

        response = self.client.get(f"/api/rooms/{id_no_dashes:s}/")

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
        """It should be possible to get a room by its slug."""
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
                    "room": str(room.id).replace("-", ""),
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

        expected_room = str(room.id).replace("-", "")
        self.assertEqual(
            response.json(),
            {
                "id": str(room.id),
                "is_administrable": False,
                "is_public": True,
                "jitsi": {
                    "room": expected_room,
                    "token": "the token",
                },
                "name": room.name,
                "slug": room.slug,
            },
        )
        mock_token.assert_called_once_with(user, expected_room, is_admin=False)

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
        expected_room = str(room.id).replace("-", "")
        self.assertEqual(
            content_dict,
            {
                "id": str(room.id),
                "is_administrable": False,
                "is_public": room.is_public,
                "jitsi": {
                    "room": expected_room,
                    "token": "the token",
                },
                "name": room.name,
                "slug": room.slug,
            },
        )
        mock_token.assert_called_once_with(user, expected_room, is_admin=False)

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
        expected_room = str(room.id).replace("-", "")
        self.assertEqual(
            content_dict,
            {
                "id": str(room.id),
                "is_administrable": False,
                "is_public": room.is_public,
                "jitsi": {
                    "room": str(room.id).replace("-", ""),
                    "token": "the token",
                },
                "name": room.name,
                "slug": room.slug,
            },
        )
        mock_token.assert_called_once_with(user, expected_room, is_admin=False)

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
        expected_room = str(room.id).replace("-", "")
        self.assertEqual(
            content_dict,
            {
                "id": str(room.id),
                "is_administrable": True,
                "is_public": room.is_public,
                "configuration": {},
                "jitsi": {
                    "room": expected_room,
                    "token": "the token",
                },
                "name": room.name,
                "slug": room.slug,
            },
        )
        mock_token.assert_called_once_with(user, expected_room, is_admin=True)

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
        expected_room = str(room.id).replace("-", "")
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
                    "room": expected_room,
                    "token": "the token",
                },
                "name": room.name,
                "slug": room.slug,
            },
        )
        mock_token.assert_called_once_with(administrator, expected_room, is_admin=True)
