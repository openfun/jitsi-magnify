"""
Tests for RoomGroups API endpoints in Magnify's core app.
"""
import random

from rest_framework.test import APITestCase
from rest_framework_simplejwt.tokens import AccessToken

from magnify.apps.core.factories import (
    GroupFactory,
    RoomFactory,
    RoomGroupFactory,
    UserFactory,
)
from magnify.apps.core.models import RoomGroup


class RoomGroupsApiTestCase(APITestCase):
    """Test requests on magnify's core app RoomGroup API endpoint."""

    def test_api_room_group_relations_list_anonymous(self):
        """Anonymous users should not be allowed to list room group relations."""
        RoomGroupFactory()

        response = self.client.get("/api/room-group-relations/")
        self.assertEqual(response.status_code, 401)
        self.assertEqual(
            response.json(), {"detail": "Authentication credentials were not provided."}
        )

    def test_api_room_group_relations_list_authenticated(self):
        """
        Authenticated users should not be allowed to list room group relations.
        """
        user = UserFactory()
        group = GroupFactory(members=[user])
        jwt_token = AccessToken.for_user(user)

        other_user = UserFactory()
        other_group = GroupFactory(members=[other_user])

        RoomGroupFactory(room__is_public=False)
        RoomGroupFactory(room__is_public=True)
        RoomGroupFactory(room__is_public=False, room__groups=[group])
        RoomGroupFactory(room__is_public=False, room__users=[user])
        RoomGroupFactory(room__is_public=False, room__groups=[other_group])
        RoomGroupFactory(room__is_public=False, room__users=[other_user])

        response = self.client.get(
            "/api/room-group-relations/", HTTP_AUTHORIZATION=f"Bearer {jwt_token}"
        )

        self.assertEqual(response.status_code, 405)
        self.assertEqual(response.json(), {"detail": 'Method "GET" not allowed.'})

    def test_api_room_group_relations_retrieve_anonymous(self):
        """
        Anonymous users should not be allowed to retrieve a room group relation.
        """
        relation = RoomGroupFactory()
        response = self.client.get(f"/api/room-group-relations/{relation.id!s}/")

        self.assertEqual(response.status_code, 401)
        self.assertEqual(
            response.json(), {"detail": "Authentication credentials were not provided."}
        )

    def test_api_room_group_relations_retrieve_authenticated(self):
        """
        Authenticated users should not be allowed to retrieve a room group relation
        """
        relation = RoomGroupFactory()

        user = UserFactory()
        jwt_token = AccessToken.for_user(user)

        response = self.client.get(
            f"/api/room-group-relations/{relation.id!s}/",
            HTTP_AUTHORIZATION=f"Bearer {jwt_token}",
        )
        self.assertEqual(response.status_code, 403)

        self.assertEqual(
            response.json(),
            {"detail": "You do not have permission to perform this action."},
        )

    def test_api_room_group_relations_retrieve_administrator_direct(self):
        """
        A user who is a direct administrator of a room should be allowed to retrieve the
        associated room group relations
        """
        user = UserFactory()
        relation = RoomGroupFactory(room__users=[(user, True)])

        jwt_token = AccessToken.for_user(user)

        with self.assertNumQueries(4):
            response = self.client.get(
                f"/api/room-group-relations/{relation.id!s}/",
                HTTP_AUTHORIZATION=f"Bearer {jwt_token}",
            )
        self.assertEqual(response.status_code, 200)

        self.assertEqual(
            response.json(),
            {
                "id": str(relation.id),
                "group": str(relation.group.id),
                "room": str(relation.room.id),
                "is_administrator": relation.is_administrator,
            },
        )

    def test_api_room_group_relations_retrieve_administrator_via_group(self):
        """
        A user who is administrator of a room via a group should be allowed to see related users
        and groups.
        """
        administrator = UserFactory()
        group = GroupFactory(members=[administrator])
        relation = RoomGroupFactory(room__groups=[(group, True)])

        jwt_token = AccessToken.for_user(administrator)

        response = self.client.get(
            f"/api/room-group-relations/{relation.id!s}/",
            HTTP_AUTHORIZATION=f"Bearer {jwt_token}",
        )
        self.assertEqual(response.status_code, 200)

        self.assertEqual(
            response.json(),
            {
                "id": str(relation.id),
                "group": str(relation.group.id),
                "room": str(relation.room.id),
                "is_administrator": relation.is_administrator,
            },
        )

    def test_api_room_group_relations_create_anonymous(self):
        """Anonymous users should not be allowed to create room group relations."""
        group = GroupFactory()
        room = RoomFactory()
        is_administrator = random.choice([True, False])

        response = self.client.post(
            "/api/room-group-relations/",
            {
                "room": str(room.id),
                "group": str(group.id),
                "is_administrator": is_administrator,
            },
        )
        self.assertEqual(response.status_code, 401)
        self.assertEqual(
            response.json(), {"detail": "Authentication credentials were not provided."}
        )
        self.assertFalse(RoomGroup.objects.exists())

    def test_api_room_group_relations_create_authenticated(self):
        """Authenticated users should not be allowed to create room group relations."""
        user = UserFactory()
        room = RoomFactory()
        group = GroupFactory()
        is_administrator = random.choice([True, False])

        jwt_token = AccessToken.for_user(user)

        response = self.client.post(
            "/api/room-group-relations/",
            {
                "room": str(room.id),
                "group": str(group.id),
                "is_administrator": is_administrator,
            },
            HTTP_AUTHORIZATION=f"Bearer {jwt_token}",
        )
        self.assertEqual(response.status_code, 400)
        self.assertEqual(
            response.json(),
            {"room": ["You must be administrator of a room to add relations to it."]},
        )
        self.assertFalse(RoomGroup.objects.exists())

    def test_api_room_group_relations_create_administrator_users(self):
        """
        Direct administrators of a room should be allowed to create a room/group relation
        in this room.
        """
        user = UserFactory()
        room = RoomFactory(users=[(user, True)])
        group = GroupFactory()
        is_administrator = random.choice([True, False])

        jwt_token = AccessToken.for_user(user)

        self.assertFalse(RoomGroup.objects.exists())
        response = self.client.post(
            "/api/room-group-relations/",
            {
                "room": str(room.id),
                "group": str(group.id),
                "is_administrator": is_administrator,
            },
            HTTP_AUTHORIZATION=f"Bearer {jwt_token}",
        )
        self.assertEqual(response.status_code, 201)
        self.assertEqual(RoomGroup.objects.count(), 1)
        self.assertTrue(RoomGroup.objects.filter(group=group).exists())

    def test_api_room_group_relations_create_administrator_groups(self):
        """
        Users who are administrators of a room via a group should be allowed to create a room
        group relation in it."""
        user = UserFactory()
        group = GroupFactory(members=[user])
        room = RoomFactory(groups=[(group, True)])
        other_group = GroupFactory()
        is_administrator = random.choice([True, False])

        jwt_token = AccessToken.for_user(user)

        self.assertEqual(RoomGroup.objects.count(), 1)
        response = self.client.post(
            "/api/room-group-relations/",
            {
                "room": str(room.id),
                "group": str(other_group.id),
                "is_administrator": is_administrator,
            },
            HTTP_AUTHORIZATION=f"Bearer {jwt_token}",
        )
        self.assertEqual(response.status_code, 201)
        self.assertEqual(RoomGroup.objects.count(), 2)
        self.assertTrue(RoomGroup.objects.filter(group=other_group).exists())

    def test_api_room_group_relations_update_authenticated(self):
        """Authenticated users should not be allowed to update a room group relation."""
        user = UserFactory()
        relation = RoomGroupFactory()
        is_administrator = relation.is_administrator
        jwt_token = AccessToken.for_user(user)

        response = self.client.put(
            f"/api/room-group-relations/{relation.id!s}/",
            {
                "group": str(relation.group.id),
                "room": str(relation.room.id),
                "is_administrator": not is_administrator,
            },
            HTTP_AUTHORIZATION=f"Bearer {jwt_token}",
        )
        self.assertEqual(response.status_code, 403)
        relation.refresh_from_db()
        self.assertEqual(relation.is_administrator, is_administrator)

    def test_api_room_group_relations_update_administrator_users(self):
        """
        Direct administrators of a room should be allowed to update its related
        room group relations.
        """
        user = UserFactory()
        relation = RoomGroupFactory(room__users=[(user, True)])
        is_administrator = relation.is_administrator
        jwt_token = AccessToken.for_user(user)

        response = self.client.put(
            f"/api/room-group-relations/{relation.id!s}/",
            {
                "group": str(relation.group.id),
                "room": str(relation.room.id),
                "is_administrator": not is_administrator,
            },
            HTTP_AUTHORIZATION=f"Bearer {jwt_token}",
        )

        self.assertEqual(response.status_code, 200)
        relation.refresh_from_db()
        self.assertEqual(relation.is_administrator, not is_administrator)

    def test_api_room_group_relations_update_administrator_groups(self):
        """Users who are administrators of a room via a group should be allowed to update it."""
        user = UserFactory()
        group = GroupFactory(members=[user])
        relation = RoomGroupFactory(room__groups=[(group, True)])
        is_administrator = relation.is_administrator
        jwt_token = AccessToken.for_user(user)

        response = self.client.put(
            f"/api/room-group-relations/{relation.id!s}/",
            {
                "group": str(relation.group.id),
                "room": str(relation.room.id),
                "is_administrator": not is_administrator,
            },
            HTTP_AUTHORIZATION=f"Bearer {jwt_token}",
        )
        self.assertEqual(response.status_code, 200)
        relation.refresh_from_db()
        self.assertEqual(relation.is_administrator, not is_administrator)

    def test_api_room_group_relations_update_administrator_of_another(self):
        """
        Being administrator of a room should not grant authorization to update another room's
        room/user relation.
        """
        user = UserFactory()
        RoomFactory(users=[(user, True)])
        relation = RoomGroupFactory()
        is_administrator = relation.is_administrator
        jwt_token = AccessToken.for_user(user)

        response = self.client.put(
            f"/api/room-group-relations/{relation.id!s}/",
            {
                "group": str(relation.group.id),
                "room": str(relation.room.id),
                "is_administrator": not is_administrator,
            },
            HTTP_AUTHORIZATION=f"Bearer {jwt_token}",
        )
        self.assertEqual(response.status_code, 403)
        relation.refresh_from_db()
        self.assertEqual(relation.is_administrator, is_administrator)

    def test_api_room_group_relations_delete_anonymous(self):
        """Anonymous users should not be allowed to destroy a room."""
        relation = RoomGroupFactory()

        response = self.client.delete(
            f"/api/room-group-relations/{relation.id!s}/",
        )

        self.assertEqual(response.status_code, 401)
        self.assertEqual(RoomGroup.objects.count(), 1)

    def test_api_room_group_relations_delete_authenticated(self):
        """
        Authenticated users should not be allowed to delete a room group relation for a room in
        which they are not administrator.
        """
        relation = RoomGroupFactory()
        user = UserFactory()
        jwt_token = AccessToken.for_user(user)

        response = self.client.delete(
            f"/api/room-group-relations/{relation.id!s}/",
            HTTP_AUTHORIZATION=f"Bearer {jwt_token}",
        )

        self.assertEqual(response.status_code, 403)
        self.assertEqual(RoomGroup.objects.count(), 1)

    def test_api_room_group_relations_delete_administrator_users(self):
        """
        Authenticated users should be able to delete a room group relation for a room in which
        they are directly administrator.
        """
        user = UserFactory()
        room = RoomFactory(users=[(user, True)])
        relation = RoomGroupFactory(room=room)

        jwt_token = AccessToken.for_user(user)

        self.assertEqual(RoomGroup.objects.count(), 1)
        self.assertTrue(RoomGroup.objects.filter(group=relation.group).exists())
        response = self.client.delete(
            f"/api/room-group-relations/{relation.id}/",
            HTTP_AUTHORIZATION=f"Bearer {jwt_token}",
        )

        self.assertEqual(response.status_code, 204)
        self.assertFalse(RoomGroup.objects.filter(group=relation.group).exists())

    def test_api_room_group_relations_delete_administrator_groups(self):
        """
        Authenticated users should be able to delete a room group relation for a room in which
        they are administrator via a group.
        """
        user = UserFactory()
        group = GroupFactory(members=[user])
        relation = RoomGroupFactory(room__groups=[(group, True)])

        jwt_token = AccessToken.for_user(user)

        self.assertEqual(RoomGroup.objects.count(), 2)
        self.assertTrue(RoomGroup.objects.filter(group=relation.group).exists())
        response = self.client.delete(
            f"/api/room-group-relations/{relation.id}/",
            HTTP_AUTHORIZATION=f"Bearer {jwt_token}",
        )

        self.assertEqual(response.status_code, 204)
        self.assertEqual(RoomGroup.objects.count(), 1)
        self.assertFalse(RoomGroup.objects.filter(group=relation.group).exists())
