"""
Tests for RoomUserAccesses API endpoints in Magnify's core app.
"""
import random
from unittest import mock
from uuid import uuid4

from rest_framework.pagination import PageNumberPagination
from rest_framework.test import APITestCase
from rest_framework_simplejwt.tokens import AccessToken

from magnify.apps.core.factories import (
    GroupFactory,
    RoomFactory,
    RoomUserAccessFactory,
    UserFactory,
)
from magnify.apps.core.models import RoomUserAccess, UserRoleChoices
from magnify.apps.core.serializers import RoomUserAccessSerializer

# pylint: disable=too-many-public-methods, too-many-lines


class RoomUserAccessesApiTestCase(APITestCase):
    """Test requests on magnify's core app RoomUserAccess API endpoint."""

    # List

    def test_api_room_user_accesses_list_anonymous(self):
        """Anonymous users should not be allowed to list room user accesses."""
        RoomUserAccessFactory()

        response = self.client.get("/api/room-user-accesses/")
        self.assertEqual(response.status_code, 401)
        self.assertEqual(
            response.json(), {"detail": "Authentication credentials were not provided."}
        )

    def test_api_room_user_accesses_list_authenticated_not_related(self):
        """
        Authenticated users should not be allowed to list room user accesses for a room
        to which they are not related, be it public or private.
        """
        user = UserFactory()
        jwt_token = AccessToken.for_user(user)

        public_room = RoomFactory(is_public=True)
        RoomUserAccessFactory(room=public_room)
        RoomUserAccessFactory(room=public_room, role="member")
        RoomUserAccessFactory(room=public_room, role="administrator")
        RoomUserAccessFactory(room=public_room, role="owner")

        private_room = RoomFactory(is_public=False)
        RoomUserAccessFactory(room=private_room)
        RoomUserAccessFactory(room=private_room, role="member")
        RoomUserAccessFactory(room=private_room, role="administrator")
        RoomUserAccessFactory(room=private_room, role="owner")

        response = self.client.get(
            "/api/room-user-accesses/",
            HTTP_AUTHORIZATION=f"Bearer {jwt_token}",
        )
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.json()["results"], [])

    def test_api_room_user_accesses_list_authenticated_member(self):
        """
        Authenticated users should not be allowed to list room user accesses for a room
        in which they are a simple member be it directly or via a group.
        """
        user = UserFactory()
        group = GroupFactory(members=[user])
        jwt_token = AccessToken.for_user(user)

        public_room = RoomFactory(
            is_public=True, users=[(user, "member")], groups=[(group, "member")]
        )
        RoomUserAccessFactory(room=public_room)
        RoomUserAccessFactory(room=public_room, role="member")
        RoomUserAccessFactory(room=public_room, role="administrator")
        RoomUserAccessFactory(room=public_room, role="owner")

        private_room = RoomFactory(is_public=False, users=[(user, "member")])
        RoomUserAccessFactory(room=private_room)
        RoomUserAccessFactory(room=private_room, role="member")
        RoomUserAccessFactory(room=private_room, role="administrator")
        RoomUserAccessFactory(room=private_room, role="owner")

        response = self.client.get(
            "/api/room-user-accesses/",
            HTTP_AUTHORIZATION=f"Bearer {jwt_token}",
        )
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.json()["results"], [])

    def test_api_room_user_accesses_list_authenticated_administrator_direct(self):
        """
        Authenticated users should be allowed to list room user accesses for a room
        in which they are a direct administrator.
        """
        user = UserFactory()
        jwt_token = AccessToken.for_user(user)

        public_room = RoomFactory(is_public=True)
        public_room_accesses = (
            # Access for the logged in user
            RoomUserAccessFactory(room=public_room, user=user, role="administrator"),
            # Accesses for other users
            RoomUserAccessFactory(room=public_room),
            RoomUserAccessFactory(room=public_room, role="member"),
            RoomUserAccessFactory(room=public_room, role="administrator"),
            RoomUserAccessFactory(room=public_room, role="owner"),
        )

        private_room = RoomFactory(is_public=False)
        private_room_accesses = (
            # Access for the logged in user
            RoomUserAccessFactory(room=private_room, user=user, role="administrator"),
            # Accesses for other users
            RoomUserAccessFactory(room=private_room),
            RoomUserAccessFactory(room=private_room, role="member"),
            RoomUserAccessFactory(room=private_room, role="administrator"),
            RoomUserAccessFactory(room=private_room, role="owner"),
        )
        response = self.client.get(
            "/api/room-user-accesses/",
            HTTP_AUTHORIZATION=f"Bearer {jwt_token}",
        )
        self.assertEqual(response.status_code, 200)
        results = response.json()["results"]
        self.assertEqual(len(results), 10)
        self.assertCountEqual(
            [item["id"] for item in results],
            [str(access.id) for access in public_room_accesses + private_room_accesses],
        )

    def test_api_room_user_accesses_list_authenticated_administrator_via_group(self):
        """
        Authenticated users should be allowed to list room user accesses for a room
        in which they are administrator via a group.
        """
        user = UserFactory()
        group = GroupFactory(members=[user])
        jwt_token = AccessToken.for_user(user)

        public_room = RoomFactory(is_public=True, groups=[(group, "administrator")])
        public_room_accesses = (
            RoomUserAccessFactory(room=public_room),
            RoomUserAccessFactory(room=public_room, role="member"),
            RoomUserAccessFactory(room=public_room, role="administrator"),
            RoomUserAccessFactory(room=public_room, role="owner"),
        )

        private_room = RoomFactory(is_public=False, groups=[(group, "administrator")])
        private_room_accesses = (
            RoomUserAccessFactory(room=private_room),
            RoomUserAccessFactory(room=private_room, role="member"),
            RoomUserAccessFactory(room=private_room, role="administrator"),
            RoomUserAccessFactory(room=private_room, role="owner"),
        )
        response = self.client.get(
            "/api/room-user-accesses/",
            HTTP_AUTHORIZATION=f"Bearer {jwt_token}",
        )
        self.assertEqual(response.status_code, 200)
        results = response.json()["results"]
        self.assertEqual(len(results), 8)
        self.assertCountEqual(
            [item["id"] for item in results],
            [str(access.id) for access in public_room_accesses + private_room_accesses],
        )

    def test_api_room_user_accesses_list_authenticated_owner(self):
        """
        Authenticated users should be allowed to list room user accesses for a room
        in which they are owner.
        """
        user = UserFactory()
        jwt_token = AccessToken.for_user(user)

        public_room = RoomFactory(is_public=True)
        public_room_accesses = (
            # Access for the logged in user
            RoomUserAccessFactory(room=public_room, user=user, role="owner"),
            # Accesses for other users
            RoomUserAccessFactory(room=public_room),
            RoomUserAccessFactory(room=public_room, role="member"),
            RoomUserAccessFactory(room=public_room, role="administrator"),
            RoomUserAccessFactory(room=public_room, role="owner"),
        )
        private_room = RoomFactory(is_public=False)
        private_room_accesses = (
            # Access for the logged in user
            RoomUserAccessFactory(room=private_room, user=user, role="owner"),
            # Accesses for other users
            RoomUserAccessFactory(room=private_room),
            RoomUserAccessFactory(room=private_room, role="member"),
            RoomUserAccessFactory(room=private_room, role="administrator"),
            RoomUserAccessFactory(room=private_room, role="owner"),
        )
        response = self.client.get(
            "/api/room-user-accesses/",
            HTTP_AUTHORIZATION=f"Bearer {jwt_token}",
        )
        self.assertEqual(response.status_code, 200)
        results = response.json()["results"]
        self.assertEqual(len(results), 10)
        self.assertCountEqual(
            [item["id"] for item in results],
            [str(access.id) for access in public_room_accesses + private_room_accesses],
        )

    @mock.patch.object(PageNumberPagination, "get_page_size", return_value=2)
    def test_api_room_user_accesses_list_pagination(self, _mock_page_size):
        """Pagination should work as expected."""

        user = UserFactory()
        jwt_token = AccessToken.for_user(user)

        room = RoomFactory()
        accesses = [
            RoomUserAccessFactory(
                room=room, user=user, role=random.choice(["administrator", "owner"])
            ),
            *RoomUserAccessFactory.create_batch(2, room=room),
        ]
        access_ids = [str(access.id) for access in accesses]

        response = self.client.get(
            "/api/room-user-accesses/",
            HTTP_AUTHORIZATION=f"Bearer {jwt_token}",
        )
        self.assertEqual(response.status_code, 200)
        content = response.json()

        self.assertEqual(content["count"], 3)
        self.assertEqual(
            content["next"], "http://testserver/api/room-user-accesses/?page=2"
        )
        self.assertIsNone(content["previous"])

        self.assertEqual(len(content["results"]), 2)
        for item in content["results"]:
            access_ids.remove(item["id"])

        # Get page 2
        response = self.client.get(
            "/api/room-user-accesses/?page=2", HTTP_AUTHORIZATION=f"Bearer {jwt_token}"
        )

        self.assertEqual(response.status_code, 200)
        content = response.json()

        self.assertEqual(content["count"], 3)
        self.assertIsNone(content["next"])
        self.assertEqual(
            content["previous"], "http://testserver/api/room-user-accesses/"
        )

        self.assertEqual(len(content["results"]), 1)
        access_ids.remove(content["results"][0]["id"])
        self.assertEqual(access_ids, [])

    # Retrieve

    def test_api_room_user_accesses_retrieve_anonymous(self):
        """
        Anonymous users should not be allowed to retrieve a room user access.
        """
        access = RoomUserAccessFactory()
        response = self.client.get(
            f"/api/room-user-accesses/{access.id!s}/",
        )

        self.assertEqual(response.status_code, 401)
        self.assertEqual(
            response.json(), {"detail": "Authentication credentials were not provided."}
        )

    def test_api_room_user_accesses_retrieve_authenticated_not_related(self):
        """
        Authenticated users should not be allowed to retrieve a room user access for
        a room to which they are not related, be it public or private.
        """
        user = UserFactory()
        jwt_token = AccessToken.for_user(user)

        for is_public in [True, False]:
            room = RoomFactory(is_public=is_public)
            self.assertEqual(len(UserRoleChoices.choices), 3)

            for role, _name in UserRoleChoices.choices:
                access = RoomUserAccessFactory(room=room, role=role)
                response = self.client.get(
                    f"/api/room-user-accesses/{access.id!s}/",
                    HTTP_AUTHORIZATION=f"Bearer {jwt_token}",
                )
                self.assertEqual(response.status_code, 403)
                self.assertEqual(
                    response.json(),
                    {"detail": "You do not have permission to perform this action."},
                )

    def test_api_room_user_accesses_retrieve_authenticated_member(self):
        """
        Authenticated users should not be allowed to retrieve a room user access for a room in
        which they are a simple member, be it public or private, be it directly or via a group.
        """
        user = UserFactory()
        group = GroupFactory(members=[user])
        jwt_token = AccessToken.for_user(user)

        for is_public in [True, False]:
            room = RoomFactory(
                is_public=is_public,
                users=[(user, "member")],
                groups=[(group, "member")],
            )
            self.assertEqual(len(UserRoleChoices.choices), 3)

            for role, _name in UserRoleChoices.choices:
                access = RoomUserAccessFactory(room=room, role=role)
                response = self.client.get(
                    f"/api/room-user-accesses/{access.id!s}/",
                    HTTP_AUTHORIZATION=f"Bearer {jwt_token}",
                )
                self.assertEqual(response.status_code, 403)
                self.assertEqual(
                    response.json(),
                    {"detail": "You do not have permission to perform this action."},
                )

    def test_api_room_user_accesses_retrieve_authenticated_administrator_direct(self):
        """
        A user who is a direct administrator of a room should be allowed to retrieve the
        associated room user accesses
        """
        user = UserFactory()
        jwt_token = AccessToken.for_user(user)

        for is_public in [True, False]:
            room = RoomFactory(is_public=is_public, users=[(user, "administrator")])
            self.assertEqual(len(UserRoleChoices.choices), 3)

            for role, _name in UserRoleChoices.choices:
                access = RoomUserAccessFactory(room=room, role=role)
                response = self.client.get(
                    f"/api/room-user-accesses/{access.id!s}/",
                    HTTP_AUTHORIZATION=f"Bearer {jwt_token}",
                )

                self.assertEqual(response.status_code, 200)
                self.assertEqual(
                    response.json(),
                    {
                        "id": str(access.id),
                        "user": str(access.user.id),
                        "room": str(access.room.id),
                        "role": access.role,
                    },
                )

    def test_api_room_user_accesses_retrieve_authenticated_administrator_via_group(
        self,
    ):
        """
        A user who is administrator of a room via a group should be allowed to retrieve the
        associated room user accesses
        """
        user = UserFactory()
        group = GroupFactory(members=[user])
        jwt_token = AccessToken.for_user(user)

        for is_public in [True, False]:
            room = RoomFactory(is_public=is_public, groups=[(group, "administrator")])
            self.assertEqual(len(UserRoleChoices.choices), 3)

            for role, _name in UserRoleChoices.choices:
                access = RoomUserAccessFactory(room=room, role=role)
                response = self.client.get(
                    f"/api/room-user-accesses/{access.id!s}/",
                    HTTP_AUTHORIZATION=f"Bearer {jwt_token}",
                )

                self.assertEqual(response.status_code, 200)
                self.assertEqual(
                    response.json(),
                    {
                        "id": str(access.id),
                        "user": str(access.user.id),
                        "room": str(access.room.id),
                        "role": access.role,
                    },
                )

    def test_api_room_user_accesses_retrieve_authenticated_owner(self):
        """
        A user who is a direct owner of a room should be allowed to retrieve the
        associated room user accesses
        """
        user = UserFactory()
        jwt_token = AccessToken.for_user(user)

        for is_public in [True, False]:
            room = RoomFactory(is_public=is_public, users=[(user, "owner")])
            self.assertEqual(len(UserRoleChoices.choices), 3)

            for role, _name in UserRoleChoices.choices:
                access = RoomUserAccessFactory(room=room, role=role)
                response = self.client.get(
                    f"/api/room-user-accesses/{access.id!s}/",
                    HTTP_AUTHORIZATION=f"Bearer {jwt_token}",
                )

                self.assertEqual(response.status_code, 200)
                self.assertEqual(
                    response.json(),
                    {
                        "id": str(access.id),
                        "user": str(access.user.id),
                        "room": str(access.room.id),
                        "role": access.role,
                    },
                )

    # Create

    def test_api_room_user_accesses_create_anonymous(self):
        """Anonymous users should not be allowed to create room user accesses."""
        user = UserFactory()
        room = RoomFactory()

        response = self.client.post(
            "/api/room-user-accesses/",
            {
                "user": str(user.id),
                "room": str(room.id),
                "role": random.choice(["member", "administrator", "owner"]),
            },
        )
        self.assertEqual(response.status_code, 401)
        self.assertEqual(
            response.json(), {"detail": "Authentication credentials were not provided."}
        )
        self.assertFalse(RoomUserAccess.objects.exists())

    def test_api_room_user_accesses_create_authenticated(self):
        """Authenticated users should not be allowed to create room user accesses."""
        user, other_user = UserFactory.create_batch(2)
        room = RoomFactory()

        jwt_token = AccessToken.for_user(user)

        response = self.client.post(
            "/api/room-user-accesses/",
            {
                "user": str(other_user.id),
                "room": str(room.id),
                "role": random.choice(["member", "administrator", "owner"]),
            },
            HTTP_AUTHORIZATION=f"Bearer {jwt_token}",
        )
        self.assertEqual(response.status_code, 403)
        self.assertEqual(
            response.json(),
            {
                "detail": "You must be administrator or owner of a room to add accesses to it."
            },
        )
        self.assertFalse(RoomUserAccess.objects.filter(user=other_user).exists())

    def test_api_room_user_accesses_create_members(self):
        """
        A user who is a simple member in a room should not be allowed to create
        room user accesses in this room.
        """
        user, other_user = UserFactory.create_batch(2)
        group = GroupFactory(members=[user])
        room = RoomFactory(users=[(user, "member")], groups=[(group, "member")])

        jwt_token = AccessToken.for_user(user)

        response = self.client.post(
            "/api/room-user-accesses/",
            {
                "user": str(other_user.id),
                "room": str(room.id),
                "role": random.choice(["member", "administrator", "owner"]),
            },
            HTTP_AUTHORIZATION=f"Bearer {jwt_token}",
        )

        self.assertEqual(response.status_code, 403)
        self.assertEqual(
            response.json(),
            {
                "detail": "You must be administrator or owner of a room to add accesses to it."
            },
        )
        self.assertFalse(RoomUserAccess.objects.filter(user=other_user).exists())

    def test_api_room_user_accesses_create_administrators_except_owner_direct(self):
        """
        A user who is direct administrator in a room should be allowed to create
        room user accesses in this room for roles other than owner (which is tested in the
        subsequent test).
        """
        user, other_user = UserFactory.create_batch(2)
        room = RoomFactory(users=[(user, "administrator")])

        jwt_token = AccessToken.for_user(user)

        response = self.client.post(
            "/api/room-user-accesses/",
            {
                "user": str(other_user.id),
                "room": str(room.id),
                "role": random.choice(["member", "administrator"]),
            },
            HTTP_AUTHORIZATION=f"Bearer {jwt_token}",
        )
        self.assertEqual(response.status_code, 201)
        self.assertEqual(RoomUserAccess.objects.count(), 2)
        self.assertTrue(RoomUserAccess.objects.filter(user=other_user).exists())

    def test_api_room_user_accesses_create_administrators_except_owner_via_group(self):
        """
        A user who is administrator in a room via a group should be allowed to create
        room user accesses in this room for roles other than owner (which is tested in the
        subsequent test).
        """
        user, other_user = UserFactory.create_batch(2)
        group = GroupFactory(members=[user])
        room = RoomFactory(groups=[(group, "administrator")])

        jwt_token = AccessToken.for_user(user)

        self.assertFalse(RoomUserAccess.objects.exists())
        response = self.client.post(
            "/api/room-user-accesses/",
            {
                "user": str(other_user.id),
                "room": str(room.id),
                "role": random.choice(["member", "administrator"]),
            },
            HTTP_AUTHORIZATION=f"Bearer {jwt_token}",
        )
        self.assertEqual(response.status_code, 201)
        self.assertEqual(RoomUserAccess.objects.count(), 1)
        self.assertTrue(RoomUserAccess.objects.filter(user=other_user).exists())

    def test_api_room_user_accesses_create_administrators_owner(self):
        """
        A user who is administrator in a room be it directly or via a group should not be
        allowed to create room user accesses in this room for the owner role.
        """
        user, other_user = UserFactory.create_batch(2)
        group = GroupFactory(members=[user])
        room = RoomFactory(
            users=[(user, "administrator")], groups=[(group, "administrator")]
        )

        jwt_token = AccessToken.for_user(user)

        response = self.client.post(
            "/api/room-user-accesses/",
            {
                "user": str(other_user.id),
                "room": str(room.id),
                "role": "owner",
            },
            HTTP_AUTHORIZATION=f"Bearer {jwt_token}",
        )
        self.assertEqual(response.status_code, 403)
        self.assertFalse(RoomUserAccess.objects.filter(user=other_user).exists())

    def test_api_room_user_accesses_create_owner_all_roles(self):
        """
        A user who is owner in a room should be allowed to create
        room user accesses in this room for all roles.
        """
        user = UserFactory()
        room = RoomFactory(users=[(user, "owner")])

        jwt_token = AccessToken.for_user(user)

        for i, role in enumerate(["member", "administrator", "owner"]):
            other_user = UserFactory()
            response = self.client.post(
                "/api/room-user-accesses/",
                {
                    "user": str(other_user.id),
                    "room": str(room.id),
                    "role": role,
                },
                HTTP_AUTHORIZATION=f"Bearer {jwt_token}",
            )

            self.assertEqual(response.status_code, 201)
            self.assertEqual(RoomUserAccess.objects.count(), i + 2)
            self.assertTrue(RoomUserAccess.objects.filter(user=other_user).exists())

    # Update

    def test_api_room_user_accesses_update_anonymous(self):
        """Anonymous users should not be allowed to update a room user access."""
        access = RoomUserAccessFactory()
        old_values = RoomUserAccessSerializer(instance=access).data

        new_values = {
            "id": uuid4(),
            "room": RoomFactory().id,
            "user": UserFactory().id,
            "role": random.choice(UserRoleChoices.choices)[0],
        }

        for field, value in new_values.items():
            response = self.client.put(
                f"/api/room-user-accesses/{access.id!s}/",
                {**new_values, field: value},
            )
            self.assertEqual(response.status_code, 401)
            access.refresh_from_db()
            updated_values = RoomUserAccessSerializer(instance=access).data
            self.assertEqual(updated_values, old_values)

    def test_api_room_user_accesses_update_authenticated(self):
        """Authenticated users should not be allowed to update a room user access."""
        user = UserFactory()
        jwt_token = AccessToken.for_user(user)

        access = RoomUserAccessFactory()
        old_values = RoomUserAccessSerializer(instance=access).data

        new_values = {
            "id": uuid4(),
            "room": RoomFactory(users=[(user, "member")]).id,
            "user": UserFactory().id,
            "role": random.choice(UserRoleChoices.choices)[0],
        }

        for field, value in new_values.items():
            response = self.client.put(
                f"/api/room-user-accesses/{access.id!s}/",
                {**new_values, field: value},
                HTTP_AUTHORIZATION=f"Bearer {jwt_token}",
            )
            self.assertEqual(response.status_code, 403)
            access.refresh_from_db()
            updated_values = RoomUserAccessSerializer(instance=access).data
            self.assertEqual(updated_values, old_values)

    def test_api_room_user_accesses_update_member(self):
        """
        A user who is a simple member in a room should not be allowed to update
        a user access for this room.
        """
        user = UserFactory()
        group = GroupFactory(members=[user])
        jwt_token = AccessToken.for_user(user)

        room = RoomFactory(users=[(user, "member")], groups=[(group, "member")])
        access = RoomUserAccessFactory(room=room)
        old_values = RoomUserAccessSerializer(instance=access).data

        new_values = {
            "id": uuid4(),
            "room": RoomFactory(users=[(user, "member")]).id,
            "user": UserFactory().id,
            "role": random.choice(UserRoleChoices.choices)[0],
        }

        for field, value in new_values.items():
            response = self.client.put(
                f"/api/room-user-accesses/{access.id!s}/",
                {**old_values, field: value},
                HTTP_AUTHORIZATION=f"Bearer {jwt_token}",
            )
            self.assertEqual(response.status_code, 403)
            access.refresh_from_db()
            updated_values = RoomUserAccessSerializer(instance=access).data
            self.assertEqual(updated_values, old_values)

    def test_api_room_user_accesses_update_administrator_except_owner_direct(self):
        """
        A user who is a direct administrator in a room should be allowed to update
        a user access for this room, as long as s.he does not try to set the role to owner.
        """
        user = UserFactory()
        jwt_token = AccessToken.for_user(user)

        room = RoomFactory(users=[(user, "administrator")])
        access = RoomUserAccessFactory(
            room=room, role=random.choice(["member", "administrator"])
        )
        old_values = RoomUserAccessSerializer(instance=access).data

        new_values = {
            "id": uuid4(),
            "room": RoomFactory(users=[(user, "administrator")]).id,
            "user": UserFactory().id,
            "role": random.choice(["member", "administrator"]),
        }

        for field, value in new_values.items():
            response = self.client.put(
                f"/api/room-user-accesses/{access.id!s}/",
                {**old_values, field: value},
                HTTP_AUTHORIZATION=f"Bearer {jwt_token}",
            )
            self.assertEqual(response.status_code, 200)
            access.refresh_from_db()
            updated_values = RoomUserAccessSerializer(instance=access).data
            if field == "role":
                self.assertEqual(
                    updated_values, {**old_values, "role": new_values["role"]}
                )
            else:
                self.assertEqual(updated_values, old_values)

    def test_api_room_user_accesses_update_administrator_except_owner_via_group(self):
        """
        A user who is an administrator in a room should be allowed to update
        a user access for this room except to set the role to owner.
        """
        user = UserFactory()
        group = GroupFactory(members=[user])
        jwt_token = AccessToken.for_user(user)

        room = RoomFactory(groups=[(group, "administrator")])
        access = RoomUserAccessFactory(
            room=room, role=random.choice(["member", "administrator"])
        )
        old_values = RoomUserAccessSerializer(instance=access).data

        new_values = {
            "id": uuid4(),
            "room": RoomFactory(users=[(user, "administrator")]).id,
            "user": UserFactory().id,
            "role": random.choice(["member", "administrator"]),
        }

        for field, value in new_values.items():
            response = self.client.put(
                f"/api/room-user-accesses/{access.id!s}/",
                {**old_values, field: value},
                HTTP_AUTHORIZATION=f"Bearer {jwt_token}",
            )
            self.assertEqual(response.status_code, 200)
            access.refresh_from_db()
            updated_values = RoomUserAccessSerializer(instance=access).data
            if field == "role":
                self.assertEqual(
                    updated_values, {**old_values, "role": new_values["role"]}
                )
            else:
                self.assertEqual(updated_values, old_values)

    def test_api_room_user_accesses_update_administrator_from_owner(self):
        """
        A user who is an administrator in a room, be it directly or via a group,
        should not be allowed to update the user access of an owner for this room.
        """
        user, other_user = UserFactory.create_batch(2)
        group = GroupFactory(members=[user])
        jwt_token = AccessToken.for_user(user)

        room = RoomFactory(
            users=[(user, "administrator")], groups=[(group, "administrator")]
        )
        access = RoomUserAccessFactory(room=room, user=other_user, role="owner")
        old_values = RoomUserAccessSerializer(instance=access).data

        new_values = {
            "id": uuid4(),
            "room": RoomFactory(users=[(user, "administrator")]).id,
            "user": UserFactory().id,
            "role": random.choice(UserRoleChoices.choices)[0],
        }

        for field, value in new_values.items():
            response = self.client.put(
                f"/api/room-user-accesses/{access.id!s}/",
                {**old_values, field: value},
                HTTP_AUTHORIZATION=f"Bearer {jwt_token}",
            )
            self.assertEqual(response.status_code, 403)
            access.refresh_from_db()
            updated_values = RoomUserAccessSerializer(instance=access).data
            self.assertEqual(updated_values, old_values)

    def test_api_room_user_accesses_update_administrator_to_owner(self):
        """
        A user who is an administrator in a room, be it directly or via a group, should
        not be allowed to update the user access of another user when granting ownership.
        """
        user, other_user = UserFactory.create_batch(2)
        group = GroupFactory(members=[user])
        jwt_token = AccessToken.for_user(user)

        room = RoomFactory(
            users=[(user, "administrator")], groups=[(group, "administrator")]
        )
        access = RoomUserAccessFactory(
            room=room, user=other_user, role=random.choice(["member", "administrator"])
        )
        old_values = RoomUserAccessSerializer(instance=access).data

        new_values = {
            "id": uuid4(),
            "room": RoomFactory(users=[(user, "administrator")]).id,
            "user": UserFactory().id,
            "role": "owner",
        }

        for field, value in new_values.items():
            response = self.client.put(
                f"/api/room-user-accesses/{access.id!s}/",
                {**old_values, field: value},
                HTTP_AUTHORIZATION=f"Bearer {jwt_token}",
            )
            if field == "role":
                self.assertEqual(response.status_code, 403)
            else:
                self.assertEqual(response.status_code, 200)
            access.refresh_from_db()
            updated_values = RoomUserAccessSerializer(instance=access).data
            self.assertEqual(updated_values, old_values)

    def test_api_room_user_accesses_update_owner_except_owner(self):
        """
        A user who is an owner in a room should be allowed to update
        a user access for this room except for existing owner accesses.
        """
        user = UserFactory()
        jwt_token = AccessToken.for_user(user)

        room = RoomFactory(users=[(user, "owner")])
        access = RoomUserAccessFactory(
            room=room, role=random.choice(["member", "administrator"])
        )
        old_values = RoomUserAccessSerializer(instance=access).data

        new_values = {
            "id": uuid4(),
            "room": RoomFactory(users=[(user, "administrator")]).id,
            "user": UserFactory().id,
            "role": random.choice(UserRoleChoices.choices)[0],
        }

        for field, value in new_values.items():
            response = self.client.put(
                f"/api/room-user-accesses/{access.id!s}/",
                {**old_values, field: value},
                HTTP_AUTHORIZATION=f"Bearer {jwt_token}",
            )

            self.assertEqual(response.status_code, 200)
            access.refresh_from_db()
            updated_values = RoomUserAccessSerializer(instance=access).data

            if field == "role":
                self.assertEqual(
                    updated_values, {**old_values, "role": new_values["role"]}
                )
            else:
                self.assertEqual(updated_values, old_values)

    def test_api_room_user_accesses_update_owner_for_owners(self):
        """
        A user who is an owner in a room should not be allowed to update
        an existing owner user access for this room.
        """
        user = UserFactory()
        jwt_token = AccessToken.for_user(user)

        room = RoomFactory(users=[(user, "owner")])
        access = RoomUserAccessFactory(room=room, role="owner")
        old_values = RoomUserAccessSerializer(instance=access).data

        new_values = {
            "id": uuid4(),
            "room": RoomFactory(users=[(user, "administrator")]).id,
            "user": UserFactory().id,
            "role": random.choice(UserRoleChoices.choices)[0],
        }

        for field, value in new_values.items():
            response = self.client.put(
                f"/api/room-user-accesses/{access.id!s}/",
                {**old_values, field: value},
                HTTP_AUTHORIZATION=f"Bearer {jwt_token}",
            )
            self.assertEqual(response.status_code, 403)
            access.refresh_from_db()
            updated_values = RoomUserAccessSerializer(instance=access).data
            self.assertEqual(updated_values, old_values)

    def test_api_room_user_accesses_update_owner_self(self):
        """
        A user who is an owner in a room should be allowed to update
        her own user access provided there are other owners in the room.
        """
        user = UserFactory()
        jwt_token = AccessToken.for_user(user)

        room = RoomFactory()
        access = RoomUserAccessFactory(room=room, user=user, role="owner")
        old_values = RoomUserAccessSerializer(instance=access).data

        new_role = random.choice(["member", "administrator"])
        response = self.client.put(
            f"/api/room-user-accesses/{access.id!s}/",
            {**old_values, "role": new_role},
            HTTP_AUTHORIZATION=f"Bearer {jwt_token}",
        )

        self.assertEqual(response.status_code, 403)
        access.refresh_from_db()
        self.assertEqual(access.role, "owner")

        # Add another owner and it should now work
        RoomUserAccessFactory(room=room, role="owner")

        response = self.client.put(
            f"/api/room-user-accesses/{access.id!s}/",
            {**old_values, "role": new_role},
            HTTP_AUTHORIZATION=f"Bearer {jwt_token}",
        )

        self.assertEqual(response.status_code, 200)
        access.refresh_from_db()
        self.assertEqual(access.role, new_role)

    # Delete

    def test_api_room_user_access_delete_anonymous(self):
        """Anonymous users should not be allowed to destroy a room."""
        access = RoomUserAccessFactory()

        response = self.client.delete(
            f"/api/room-user-accesses/{access.id!s}/",
        )

        self.assertEqual(response.status_code, 401)
        self.assertEqual(RoomUserAccess.objects.count(), 1)

    def test_api_room_user_access_delete_authenticated(self):
        """
        Authenticated users should not be allowed to delete a room user access for a room in
        which they are not administrator.
        """
        access = RoomUserAccessFactory()
        user = UserFactory()
        jwt_token = AccessToken.for_user(user)

        response = self.client.delete(
            f"/api/room-user-accesses/{access.id!s}/",
            HTTP_AUTHORIZATION=f"Bearer {jwt_token}",
        )

        self.assertEqual(response.status_code, 403)
        self.assertEqual(RoomUserAccess.objects.count(), 1)

    def test_api_room_user_access_delete_members(self):
        """
        Authenticated users should not be allowed to delete a room user access for a room in
        which they are a simple member.
        """
        user = UserFactory()
        group = GroupFactory(members=[user])
        room = RoomFactory(users=[(user, "member")], groups=[(group, "member")])
        access = RoomUserAccessFactory(room=room)

        jwt_token = AccessToken.for_user(user)

        self.assertEqual(RoomUserAccess.objects.count(), 2)
        self.assertTrue(RoomUserAccess.objects.filter(user=access.user).exists())
        response = self.client.delete(
            f"/api/room-user-accesses/{access.id!s}/",
            HTTP_AUTHORIZATION=f"Bearer {jwt_token}",
        )

        self.assertEqual(response.status_code, 403)
        self.assertEqual(RoomUserAccess.objects.count(), 2)

    def test_api_room_user_access_delete_administrators_direct(self):
        """
        Users who are direct administrators in a room should be allowed to delete a user access
        from the room provided it is not ownership.
        """
        user = UserFactory()
        room = RoomFactory(users=[(user, "administrator")])
        access = RoomUserAccessFactory(
            room=room, role=random.choice(["member", "administrator"])
        )

        jwt_token = AccessToken.for_user(user)

        self.assertEqual(RoomUserAccess.objects.count(), 2)
        self.assertTrue(RoomUserAccess.objects.filter(user=access.user).exists())
        response = self.client.delete(
            f"/api/room-user-accesses/{access.id!s}/",
            HTTP_AUTHORIZATION=f"Bearer {jwt_token}",
        )

        self.assertEqual(response.status_code, 204)
        self.assertEqual(RoomUserAccess.objects.count(), 1)

    def test_api_room_user_access_delete_administrators_via_group(self):
        """
        Users who are administrators in a room via a group should be allowed to delete a
        user access from the room provided it is not ownership.
        """
        user = UserFactory()
        group = GroupFactory(members=[user])
        room = RoomFactory(groups=[(group, "administrator")])
        access = RoomUserAccessFactory(
            room=room, role=random.choice(["member", "administrator"])
        )

        jwt_token = AccessToken.for_user(user)

        self.assertEqual(RoomUserAccess.objects.count(), 1)
        self.assertTrue(RoomUserAccess.objects.filter(user=access.user).exists())
        response = self.client.delete(
            f"/api/room-user-accesses/{access.id!s}/",
            HTTP_AUTHORIZATION=f"Bearer {jwt_token}",
        )

        self.assertEqual(response.status_code, 204)
        self.assertFalse(RoomUserAccess.objects.exists())

    def test_api_room_user_access_delete_owners_except_owners(self):
        """
        Users should be able to delete the room user access of another user
        for a room in which they are direct owner except for owners.
        """
        user = UserFactory()
        room = RoomFactory(users=[(user, "owner")])
        access = RoomUserAccessFactory(
            room=room, role=random.choice(["member", "administrator"])
        )

        jwt_token = AccessToken.for_user(user)

        self.assertEqual(RoomUserAccess.objects.count(), 2)
        self.assertTrue(RoomUserAccess.objects.filter(user=access.user).exists())
        response = self.client.delete(
            f"/api/room-user-accesses/{access.id!s}/",
            HTTP_AUTHORIZATION=f"Bearer {jwt_token}",
        )

        self.assertEqual(response.status_code, 204)
        self.assertEqual(RoomUserAccess.objects.count(), 1)

    def test_api_room_user_access_delete_owners_for_owners(self):
        """
        Users should not be able to delete the room user access of another owner
        even for a room in which they are direct owner.
        """
        user = UserFactory()
        room = RoomFactory(users=[(user, "owner")])
        access = RoomUserAccessFactory(room=room, role="owner")

        jwt_token = AccessToken.for_user(user)

        self.assertEqual(RoomUserAccess.objects.count(), 2)
        self.assertTrue(RoomUserAccess.objects.filter(user=access.user).exists())
        response = self.client.delete(
            f"/api/room-user-accesses/{access.id!s}/",
            HTTP_AUTHORIZATION=f"Bearer {jwt_token}",
        )

        self.assertEqual(response.status_code, 403)
        self.assertEqual(RoomUserAccess.objects.count(), 2)

    def test_api_room_user_access_delete_owners_last_owner(self):
        """
        It should not be possible to delete the last owner access from a room
        """
        user = UserFactory()
        room = RoomFactory()
        access = RoomUserAccessFactory(room=room, user=user, role="owner")

        jwt_token = AccessToken.for_user(user)

        self.assertEqual(RoomUserAccess.objects.count(), 1)
        response = self.client.delete(
            f"/api/room-user-accesses/{access.id!s}/",
            HTTP_AUTHORIZATION=f"Bearer {jwt_token}",
        )

        self.assertEqual(response.status_code, 403)
        self.assertEqual(RoomUserAccess.objects.count(), 1)
