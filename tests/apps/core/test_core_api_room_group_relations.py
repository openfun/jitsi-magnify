"""
Tests for RoomGroupAccessAccesses API endpoints in Magnify's core app.
"""
import random

from rest_framework.test import APITestCase
from rest_framework_simplejwt.tokens import AccessToken

from magnify.apps.core.factories import (
    GroupFactory,
    RoomFactory,
    RoomGroupAccessFactory,
    UserFactory,
)
from magnify.apps.core.models import RoomGroupAccess


class RoomGroupAccessAccessesApiTestCase(APITestCase):
    """Test requests on magnify's core app RoomGroupAccess API endpoint."""

    def test_api_room_group_accesses_list_anonymous(self):
        """Anonymous users should not be allowed to list room group accesses."""
        access = RoomGroupAccessFactory()

        response = self.client.get(f"/api/rooms/{access.room.id!s}/groups/")
        self.assertEqual(response.status_code, 401)
        self.assertEqual(
            response.json(), {"detail": "Authentication credentials were not provided."}
        )

    def test_api_room_group_accesses_list_authenticated(self):
        """
        Authenticated users should not be allowed to list room group accesses.
        """
        user = UserFactory()
        group = GroupFactory(members=[user])
        jwt_token = AccessToken.for_user(user)

        other_user = UserFactory()
        other_group = GroupFactory(members=[other_user])

        for access in [
            RoomGroupAccessFactory(room__is_public=False),
            RoomGroupAccessFactory(room__is_public=True),
            RoomGroupAccessFactory(room__is_public=False, room__groups=[group]),
            RoomGroupAccessFactory(room__is_public=False, room__users=[user]),
            RoomGroupAccessFactory(room__is_public=False, room__groups=[other_group]),
            RoomGroupAccessFactory(room__is_public=False, room__users=[other_user]),
        ]:
            response = self.client.get(
                f"/api/rooms/{access.room.id!s}/groups/",
                HTTP_AUTHORIZATION=f"Bearer {jwt_token}",
            )

            self.assertEqual(response.status_code, 405)
            self.assertEqual(response.json(), {"detail": 'Method "GET" not allowed.'})

    def test_api_room_group_accesses_retrieve_anonymous(self):
        """
        Anonymous users should not be allowed to retrieve a room group access.
        """
        access = RoomGroupAccessFactory()
        response = self.client.get(
            f"/api/rooms/{access.room.id!s}/groups/{access.group.id!s}/",
        )

        self.assertEqual(response.status_code, 401)
        self.assertEqual(
            response.json(), {"detail": "Authentication credentials were not provided."}
        )

    def test_api_room_group_accesses_retrieve_authenticated(self):
        """
        Authenticated users should not be allowed to retrieve a room group access
        """
        access = RoomGroupAccessFactory()

        user = UserFactory()
        jwt_token = AccessToken.for_user(user)

        response = self.client.get(
            f"/api/rooms/{access.room.id!s}/groups/{access.group.id!s}/",
            HTTP_AUTHORIZATION=f"Bearer {jwt_token}",
        )
        self.assertEqual(response.status_code, 403)

        self.assertEqual(
            response.json(),
            {"detail": "You do not have permission to perform this action."},
        )

    def test_api_room_group_accesses_retrieve_administrator_direct(self):
        """
        A user who is a direct administrator of a room should be allowed to retrieve the
        associated room group accesses
        """
        user = UserFactory()
        access = RoomGroupAccessFactory(room__users=[(user, True)])

        jwt_token = AccessToken.for_user(user)

        with self.assertNumQueries(4):
            response = self.client.get(
                f"/api/rooms/{access.room.id!s}/groups/{access.group.id!s}/",
                HTTP_AUTHORIZATION=f"Bearer {jwt_token}",
            )
        self.assertEqual(response.status_code, 200)

        self.assertEqual(
            response.json(),
            {
                "id": str(access.id),
                "group": str(access.group.id),
                "room": str(access.room.id),
                "is_administrator": access.is_administrator,
            },
        )

    def test_api_room_group_accesses_retrieve_administrator_via_group(self):
        """
        A user who is administrator of a room via a group should be allowed to see related users
        and groups.
        """
        administrator = UserFactory()
        group = GroupFactory(members=[administrator])
        access = RoomGroupAccessFactory(room__groups=[(group, True)])

        jwt_token = AccessToken.for_user(administrator)

        response = self.client.get(
            f"/api/rooms/{access.room.id!s}/groups/{access.group.id!s}/",
            HTTP_AUTHORIZATION=f"Bearer {jwt_token}",
        )
        self.assertEqual(response.status_code, 200)

        self.assertEqual(
            response.json(),
            {
                "id": str(access.id),
                "group": str(access.group.id),
                "room": str(access.room.id),
                "is_administrator": access.is_administrator,
            },
        )

    def test_api_room_group_accesses_create_anonymous(self):
        """Anonymous users should not be allowed to create room group accesses."""
        group = GroupFactory()
        room = RoomFactory()
        is_administrator = random.choice([True, False])

        response = self.client.post(
            f"/api/rooms/{room.id!s}/groups/",
            {
                "group": str(group.id),
                "is_administrator": is_administrator,
            },
        )
        self.assertEqual(response.status_code, 401)
        self.assertEqual(
            response.json(), {"detail": "Authentication credentials were not provided."}
        )
        self.assertFalse(RoomGroupAccess.objects.exists())

    def test_api_room_group_accesses_create_authenticated(self):
        """Authenticated users should not be allowed to create room group accesses."""
        user = UserFactory()
        room = RoomFactory()
        group = GroupFactory()
        is_administrator = random.choice([True, False])

        jwt_token = AccessToken.for_user(user)

        response = self.client.post(
            f"/api/rooms/{room.id!s}/groups/",
            {
                "group": str(group.id),
                "is_administrator": is_administrator,
            },
            HTTP_AUTHORIZATION=f"Bearer {jwt_token}",
        )
        self.assertEqual(response.status_code, 400)
        self.assertEqual(
            response.json(),
            {"room": ["You must be administrator of a room to add accesses to it."]},
        )
        self.assertFalse(RoomGroupAccess.objects.exists())

    def test_api_room_group_accesses_create_administrator_users(self):
        """
        Direct administrators of a room should be allowed to create a room/group access
        in this room.
        """
        user = UserFactory()
        room = RoomFactory(users=[(user, True)])
        group = GroupFactory()
        is_administrator = random.choice([True, False])

        jwt_token = AccessToken.for_user(user)

        self.assertFalse(RoomGroupAccess.objects.exists())
        response = self.client.post(
            f"/api/rooms/{room.id!s}/groups/",
            {
                "group": str(group.id),
                "is_administrator": is_administrator,
            },
            HTTP_AUTHORIZATION=f"Bearer {jwt_token}",
        )
        self.assertEqual(response.status_code, 201)
        self.assertEqual(RoomGroupAccess.objects.count(), 1)
        self.assertTrue(RoomGroupAccess.objects.filter(group=group).exists())

    def test_api_room_group_accesses_create_administrator_groups(self):
        """
        Users who are administrators of a room via a group should be allowed to create a room
        group access in it."""
        user = UserFactory()
        group = GroupFactory(members=[user])
        room = RoomFactory(groups=[(group, True)])
        other_group = GroupFactory()
        is_administrator = random.choice([True, False])

        jwt_token = AccessToken.for_user(user)

        self.assertEqual(RoomGroupAccess.objects.count(), 1)
        response = self.client.post(
            f"/api/rooms/{room.id!s}/groups/",
            {
                "group": str(other_group.id),
                "is_administrator": is_administrator,
            },
            HTTP_AUTHORIZATION=f"Bearer {jwt_token}",
        )
        self.assertEqual(response.status_code, 201)
        self.assertEqual(RoomGroupAccess.objects.count(), 2)
        self.assertTrue(RoomGroupAccess.objects.filter(group=other_group).exists())

    def test_api_room_group_accesses_update_authenticated(self):
        """Authenticated users should not be allowed to update a room group access."""
        user = UserFactory()
        access = RoomGroupAccessFactory()
        is_administrator = access.is_administrator
        jwt_token = AccessToken.for_user(user)

        response = self.client.put(
            f"/api/rooms/{access.room.id!s}/groups/{access.group.id!s}/",
            {
                "is_administrator": not is_administrator,
            },
            HTTP_AUTHORIZATION=f"Bearer {jwt_token}",
        )
        self.assertEqual(response.status_code, 403)
        access.refresh_from_db()
        self.assertEqual(access.is_administrator, is_administrator)

    def test_api_room_group_accesses_update_administrator_users(self):
        """
        Direct administrators of a room should be allowed to update its related
        room group accesses.
        """
        user = UserFactory()
        access = RoomGroupAccessFactory(room__users=[(user, True)])
        is_administrator = access.is_administrator
        jwt_token = AccessToken.for_user(user)

        response = self.client.put(
            f"/api/rooms/{access.room.id!s}/groups/{access.group.id!s}/",
            {
                "is_administrator": not is_administrator,
            },
            HTTP_AUTHORIZATION=f"Bearer {jwt_token}",
        )

        self.assertEqual(response.status_code, 200)
        access.refresh_from_db()
        self.assertEqual(access.is_administrator, not is_administrator)

    def test_api_room_group_accesses_update_administrator_groups(self):
        """Users who are administrators of a room via a group should be allowed to update it."""
        user = UserFactory()
        group = GroupFactory(members=[user])
        access = RoomGroupAccessFactory(room__groups=[(group, True)])
        is_administrator = access.is_administrator
        jwt_token = AccessToken.for_user(user)

        response = self.client.put(
            f"/api/rooms/{access.room.id!s}/groups/{access.group.id!s}/",
            {
                "is_administrator": not is_administrator,
            },
            HTTP_AUTHORIZATION=f"Bearer {jwt_token}",
        )
        self.assertEqual(response.status_code, 200)
        access.refresh_from_db()
        self.assertEqual(access.is_administrator, not is_administrator)

    def test_api_room_group_accesses_update_administrator_of_another(self):
        """
        Being administrator of a room should not grant authorization to update another room's
        room/user access.
        """
        user = UserFactory()
        RoomFactory(users=[(user, True)])
        access = RoomGroupAccessFactory()
        is_administrator = access.is_administrator
        jwt_token = AccessToken.for_user(user)

        response = self.client.put(
            f"/api/rooms/{access.room.id!s}/groups/{access.group.id!s}/",
            {
                "is_administrator": not is_administrator,
            },
            HTTP_AUTHORIZATION=f"Bearer {jwt_token}",
        )
        self.assertEqual(response.status_code, 403)
        access.refresh_from_db()
        self.assertEqual(access.is_administrator, is_administrator)

    def test_api_room_group_accesses_delete_anonymous(self):
        """Anonymous users should not be allowed to destroy a room."""
        access = RoomGroupAccessFactory()

        response = self.client.delete(
            f"/api/rooms/{access.room.id!s}/groups/{access.group.id!s}/",
        )

        self.assertEqual(response.status_code, 401)
        self.assertEqual(RoomGroupAccess.objects.count(), 1)

    def test_api_room_group_accesses_delete_authenticated(self):
        """
        Authenticated users should not be allowed to delete a room group access for a room in
        which they are not administrator.
        """
        access = RoomGroupAccessFactory()
        user = UserFactory()
        jwt_token = AccessToken.for_user(user)

        response = self.client.delete(
            f"/api/rooms/{access.room.id!s}/groups/{access.group.id!s}/",
            HTTP_AUTHORIZATION=f"Bearer {jwt_token}",
        )

        self.assertEqual(response.status_code, 403)
        self.assertEqual(RoomGroupAccess.objects.count(), 1)

    def test_api_room_group_accesses_delete_administrator_users(self):
        """
        Authenticated users should be able to delete a room group access for a room in which
        they are directly administrator.
        """
        user = UserFactory()
        room = RoomFactory(users=[(user, True)])
        access = RoomGroupAccessFactory(room=room)

        jwt_token = AccessToken.for_user(user)

        self.assertEqual(RoomGroupAccess.objects.count(), 1)
        self.assertTrue(RoomGroupAccess.objects.filter(group=access.group).exists())
        response = self.client.delete(
            f"/api/rooms/{access.room.id!s}/groups/{access.group.id!s}/",
            HTTP_AUTHORIZATION=f"Bearer {jwt_token}",
        )

        self.assertEqual(response.status_code, 204)
        self.assertFalse(RoomGroupAccess.objects.filter(group=access.group).exists())

    def test_api_room_group_accesses_delete_administrator_groups(self):
        """
        Authenticated users should be able to delete a room group access for a room in which
        they are administrator via a group.
        """
        user = UserFactory()
        group = GroupFactory(members=[user])
        access = RoomGroupAccessFactory(room__groups=[(group, True)])

        jwt_token = AccessToken.for_user(user)

        self.assertEqual(RoomGroupAccess.objects.count(), 2)
        self.assertTrue(RoomGroupAccess.objects.filter(group=access.group).exists())
        response = self.client.delete(
            f"/api/rooms/{access.room.id!s}/groups/{access.group.id!s}/",
            HTTP_AUTHORIZATION=f"Bearer {jwt_token}",
        )

        self.assertEqual(response.status_code, 204)
        self.assertEqual(RoomGroupAccess.objects.count(), 1)
        self.assertFalse(RoomGroupAccess.objects.filter(group=access.group).exists())
