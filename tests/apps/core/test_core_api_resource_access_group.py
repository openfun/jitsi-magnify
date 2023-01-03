"""
Tests for room accesses API endpoints in Magnify's core app.
"""
import random
from unittest import mock
from uuid import uuid4

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
from magnify.apps.core.models import ResourceAccess
from magnify.apps.core.serializers import ResourceAccessSerializer

GROUP_ROLE_CHOICES = ["member", "administrator"]


# pylint: disable=too-many-public-methods
class RoomGroupAccessAccessesApiTestCase(APITestCase):
    """Test requests on magnify's core app RoomGroupAccess API endpoint."""

    # List

    def test_api_room_group_accesses_list_anonymous(self):
        """Anonymous users should not be allowed to list room group accesses."""
        GroupResourceAccessFactory()

        response = self.client.get("/api/resource-accesses/")
        self.assertEqual(response.status_code, 401)
        self.assertEqual(
            response.json(), {"detail": "Authentication credentials were not provided."}
        )

    def test_api_room_group_accesses_list_authenticated(self):
        """
        Authenticated users should not be allowed to list room group accesses for a room
        to which they are not related, be it public or private.
        """
        user = UserFactory()
        jwt_token = AccessToken.for_user(user)

        public_room = RoomFactory(is_public=True)
        GroupResourceAccessFactory(resource=public_room)
        GroupResourceAccessFactory(resource=public_room, role="member")
        GroupResourceAccessFactory(resource=public_room, role="administrator")

        private_room = RoomFactory(is_public=False)
        GroupResourceAccessFactory(resource=private_room)
        GroupResourceAccessFactory(resource=private_room, role="member")
        GroupResourceAccessFactory(resource=private_room, role="administrator")

        response = self.client.get(
            "/api/resource-accesses/",
            HTTP_AUTHORIZATION=f"Bearer {jwt_token}",
        )
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.json()["results"], [])

    def test_api_room_group_accesses_list_members(self):
        """
        Authenticated users should not be allowed to list room group accesses for
        a room in which they are members, directly or via a group.
        """
        user = UserFactory()
        group = GroupFactory(members=[user])
        jwt_token = AccessToken.for_user(user)

        public_room = RoomFactory(
            is_public=True, users=[(user, "member")], groups=[(group, "member")]
        )
        GroupResourceAccessFactory(resource=public_room)
        GroupResourceAccessFactory(resource=public_room, role="member")
        GroupResourceAccessFactory(resource=public_room, role="administrator")

        private_room = RoomFactory(
            is_public=False, users=[(user, "member")], groups=[(group, "member")]
        )
        GroupResourceAccessFactory(resource=private_room)
        GroupResourceAccessFactory(resource=private_room, role="member")
        GroupResourceAccessFactory(resource=private_room, role="administrator")

        response = self.client.get(
            "/api/resource-accesses/",
            HTTP_AUTHORIZATION=f"Bearer {jwt_token}",
        )
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.json()["results"], [])

    def test_api_room_group_accesses_list_administrators_direct(self):
        """
        Authenticated users should be allowed to list room group accesses for a room
        in which they are direct administrator.
        """
        user = UserFactory()
        jwt_token = AccessToken.for_user(user)

        public_room = RoomFactory(is_public=True)
        public_room_accesses = (
            UserResourceAccessFactory(
                resource=public_room, user=user, role="administrator"
            ),
            GroupResourceAccessFactory(resource=public_room),
            GroupResourceAccessFactory(resource=public_room, role="member"),
            GroupResourceAccessFactory(resource=public_room, role="administrator"),
        )

        private_room = RoomFactory(is_public=False)
        private_room_accesses = (
            UserResourceAccessFactory(
                resource=private_room, user=user, role="administrator"
            ),
            GroupResourceAccessFactory(resource=private_room),
            GroupResourceAccessFactory(resource=private_room, role="member"),
            GroupResourceAccessFactory(resource=private_room, role="administrator"),
        )

        response = self.client.get(
            "/api/resource-accesses/",
            HTTP_AUTHORIZATION=f"Bearer {jwt_token}",
        )
        self.assertEqual(response.status_code, 200)
        results = response.json()["results"]
        self.assertCountEqual(
            [item["id"] for item in results],
            [str(access.id) for access in public_room_accesses + private_room_accesses],
        )

    def test_api_room_group_accesses_list_administrators_via_group(self):
        """
        Authenticated users should be allowed to list room group accesses for a room
        in which they are administrator via a group.
        """
        user = UserFactory()
        group = GroupFactory(members=[user])
        jwt_token = AccessToken.for_user(user)

        public_room = RoomFactory(is_public=True)
        public_room_accesses = (
            # Access for the group in which the logged in user is
            GroupResourceAccessFactory(
                resource=public_room, group=group, role="administrator"
            ),
            # Accesses for other groups
            GroupResourceAccessFactory(resource=public_room),
            GroupResourceAccessFactory(resource=public_room, role="member"),
            GroupResourceAccessFactory(resource=public_room, role="administrator"),
        )

        private_room = RoomFactory(is_public=False)
        private_room_accesses = (
            # Access for the group in which the logged in user is
            GroupResourceAccessFactory(
                resource=private_room, group=group, role="administrator"
            ),
            # Accesses for other groups
            GroupResourceAccessFactory(resource=private_room),
            GroupResourceAccessFactory(resource=private_room, role="member"),
            GroupResourceAccessFactory(resource=private_room, role="administrator"),
        )

        response = self.client.get(
            "/api/resource-accesses/",
            HTTP_AUTHORIZATION=f"Bearer {jwt_token}",
        )
        self.assertEqual(response.status_code, 200)
        results = response.json()["results"]
        self.assertEqual(len(results), 8)
        self.assertCountEqual(
            [item["id"] for item in results],
            [str(access.id) for access in public_room_accesses + private_room_accesses],
        )

    def test_api_room_group_accesses_list_owners(self):
        """
        Authenticated users should be allowed to list room group accesses for a room
        in which they are owner.
        """
        user = UserFactory()
        jwt_token = AccessToken.for_user(user)

        public_room = RoomFactory(is_public=True)
        public_room_accesses = (
            UserResourceAccessFactory(resource=public_room, user=user, role="owner"),
            GroupResourceAccessFactory(resource=public_room),
            GroupResourceAccessFactory(resource=public_room, role="member"),
            GroupResourceAccessFactory(resource=public_room, role="administrator"),
        )
        private_room = RoomFactory(is_public=False)
        private_room_accesses = (
            UserResourceAccessFactory(resource=private_room, user=user, role="owner"),
            GroupResourceAccessFactory(resource=private_room),
            GroupResourceAccessFactory(resource=private_room, role="member"),
            GroupResourceAccessFactory(resource=private_room, role="administrator"),
        )
        response = self.client.get(
            "/api/resource-accesses/",
            HTTP_AUTHORIZATION=f"Bearer {jwt_token}",
        )
        self.assertEqual(response.status_code, 200)
        results = response.json()["results"]
        self.assertCountEqual(
            sorted([item["id"] for item in results]),
            sorted(
                [
                    str(access.id)
                    for access in public_room_accesses + private_room_accesses
                ]
            ),
        )

    @mock.patch.object(PageNumberPagination, "get_page_size", return_value=2)
    def test_api_room_group_accesses_list_pagination(self, _mock_page_size):
        """Pagination should work as expected."""

        user = UserFactory()
        group = GroupFactory(members=[user])
        jwt_token = AccessToken.for_user(user)

        room = RoomFactory()
        accesses = [
            GroupResourceAccessFactory(
                resource=room, group=group, role="administrator"
            ),
            *GroupResourceAccessFactory.create_batch(2, resource=room),
        ]
        access_ids = [str(access.id) for access in accesses]

        response = self.client.get(
            "/api/resource-accesses/",
            HTTP_AUTHORIZATION=f"Bearer {jwt_token}",
        )
        self.assertEqual(response.status_code, 200)
        content = response.json()

        self.assertEqual(content["count"], 3)
        self.assertEqual(
            content["next"], "http://testserver/api/resource-accesses/?page=2"
        )
        self.assertIsNone(content["previous"])

        self.assertEqual(len(content["results"]), 2)
        for item in content["results"]:
            access_ids.remove(item["id"])

        # Get page 2
        response = self.client.get(
            "/api/resource-accesses/?page=2", HTTP_AUTHORIZATION=f"Bearer {jwt_token}"
        )

        self.assertEqual(response.status_code, 200)
        content = response.json()

        self.assertEqual(content["count"], 3)
        self.assertIsNone(content["next"])
        self.assertEqual(
            content["previous"], "http://testserver/api/resource-accesses/"
        )

        self.assertEqual(len(content["results"]), 1)
        access_ids.remove(content["results"][0]["id"])
        self.assertEqual(access_ids, [])

    # Retrieve

    def test_api_room_group_accesses_retrieve_anonymous(self):
        """
        Anonymous users should not be allowed to retrieve a room group access.
        """
        access = GroupResourceAccessFactory()
        response = self.client.get(
            f"/api/resource-accesses/{access.id!s}/",
        )

        self.assertEqual(response.status_code, 401)
        self.assertEqual(
            response.json(), {"detail": "Authentication credentials were not provided."}
        )

    def test_api_room_group_accesses_retrieve_authenticated(self):
        """
        Authenticated users should not be allowed to retrieve a room group access for
        a room to which they are not related, be it public or private.
        """
        user = UserFactory()
        jwt_token = AccessToken.for_user(user)

        for is_public in [True, False]:
            room = RoomFactory(is_public=is_public)

            for role in GROUP_ROLE_CHOICES:
                access = GroupResourceAccessFactory(resource=room, role=role)
                response = self.client.get(
                    f"/api/resource-accesses/{access.id!s}/",
                    HTTP_AUTHORIZATION=f"Bearer {jwt_token}",
                )
                self.assertEqual(response.status_code, 403)
                self.assertEqual(
                    response.json(),
                    {"detail": "You do not have permission to perform this action."},
                )

    def test_api_room_group_accesses_retrieve_members(self):
        """
        Authenticated users should not be allowed to retrieve a room group access for
        a room in which they are a simple member, be it public or private, be it directly
        or via a group.
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

            for role in GROUP_ROLE_CHOICES:
                access = GroupResourceAccessFactory(resource=room, role=role)
                response = self.client.get(
                    f"/api/resource-accesses/{access.id!s}/",
                    HTTP_AUTHORIZATION=f"Bearer {jwt_token}",
                )
                self.assertEqual(response.status_code, 403)
                self.assertEqual(
                    response.json(),
                    {"detail": "You do not have permission to perform this action."},
                )

    def test_api_room_group_accesses_retrieve_administrators_direct(self):
        """
        A user who is a direct administrator of a room should be allowed to retrieve the
        associated room group accesses.
        """
        user = UserFactory()
        jwt_token = AccessToken.for_user(user)

        for is_public in [True, False]:
            room = RoomFactory(is_public=is_public, users=[(user, "administrator")])

            for role in GROUP_ROLE_CHOICES:
                access = GroupResourceAccessFactory(resource=room, role=role)
                response = self.client.get(
                    f"/api/resource-accesses/{access.id!s}/",
                    HTTP_AUTHORIZATION=f"Bearer {jwt_token}",
                )

                self.assertEqual(response.status_code, 200)
                self.assertEqual(
                    response.json(),
                    {
                        "id": str(access.id),
                        "user": None,
                        "group": str(access.group.id),
                        "resource": str(access.resource_id),
                        "role": access.role,
                    },
                )

    def test_api_room_group_accesses_retrieve_administrators_via_group(self):
        """
        A user who is administrator of a room via a group should be allowed to retrieve the
        associated room group accesses.
        """
        user = UserFactory()
        group = GroupFactory(members=[user])
        jwt_token = AccessToken.for_user(user)

        for is_public in [True, False]:
            room = RoomFactory(is_public=is_public, groups=[(group, "administrator")])

            for role in GROUP_ROLE_CHOICES:
                access = GroupResourceAccessFactory(resource=room, role=role)
                response = self.client.get(
                    f"/api/resource-accesses/{access.id!s}/",
                    HTTP_AUTHORIZATION=f"Bearer {jwt_token}",
                )

                self.assertEqual(response.status_code, 200)
                self.assertEqual(
                    response.json(),
                    {
                        "id": str(access.id),
                        "user": None,
                        "group": str(access.group.id),
                        "resource": str(access.resource_id),
                        "role": access.role,
                    },
                )

    def test_api_room_group_accesses_retrieve_owners(self):
        """
        A user who is a direct owner of a room should be allowed to retrieve the
        associated room group accesses
        """
        user = UserFactory()
        jwt_token = AccessToken.for_user(user)

        for is_public in [True, False]:
            room = RoomFactory(is_public=is_public, users=[(user, "owner")])

            for role in GROUP_ROLE_CHOICES:
                access = GroupResourceAccessFactory(resource=room, role=role)
                response = self.client.get(
                    f"/api/resource-accesses/{access.id!s}/",
                    HTTP_AUTHORIZATION=f"Bearer {jwt_token}",
                )

                self.assertEqual(response.status_code, 200)
                self.assertEqual(
                    response.json(),
                    {
                        "id": str(access.id),
                        "user": None,
                        "group": str(access.group.id),
                        "resource": str(access.resource_id),
                        "role": access.role,
                    },
                )

    # Create

    def test_api_room_group_accesses_create_anonymous(self):
        """Anonymous users should not be allowed to create room group accesses."""
        group = GroupFactory()
        room = RoomFactory()

        response = self.client.post(
            "/api/resource-accesses/",
            {
                "group": str(group.id),
                "resource": str(room.resource_id),
                "role": random.choice(GROUP_ROLE_CHOICES),
            },
            format="json",
        )
        self.assertEqual(response.status_code, 401)
        self.assertEqual(
            response.json(), {"detail": "Authentication credentials were not provided."}
        )
        self.assertFalse(ResourceAccess.objects.exists())

    def test_api_room_group_accesses_create_authenticated(self):
        """Authenticated users should not be allowed to create room group accesses."""
        user = UserFactory()
        group = GroupFactory(administrators=[user])
        room = RoomFactory()

        jwt_token = AccessToken.for_user(user)

        response = self.client.post(
            "/api/resource-accesses/",
            {
                "group": str(group.id),
                "resource": str(room.resource_id),
                "role": random.choice(GROUP_ROLE_CHOICES),
            },
            format="json",
            HTTP_AUTHORIZATION=f"Bearer {jwt_token}",
        )
        self.assertEqual(response.status_code, 403)
        self.assertEqual(
            response.json(),
            {
                "detail": "You must be administrator or owner of a room to add accesses to it."
            },
        )
        self.assertFalse(ResourceAccess.objects.filter(group=group).exists())

    def test_api_room_group_accesses_create_members(self):
        """
        A user who is a simple member in a room, be it directly or via a group, should not be
        allowed to create room group accesses in this room.
        """
        user = UserFactory()
        group = GroupFactory(administrators=[user])
        room = RoomFactory(users=[(user, "member")], groups=[(group, "member")])

        jwt_token = AccessToken.for_user(user)

        self.assertEqual(ResourceAccess.objects.count(), 2)
        response = self.client.post(
            "/api/resource-accesses/",
            {
                "group": str(group.id),
                "resource": str(room.resource_id),
                "role": random.choice(GROUP_ROLE_CHOICES),
            },
            format="json",
            HTTP_AUTHORIZATION=f"Bearer {jwt_token}",
        )

        self.assertEqual(response.status_code, 403)
        self.assertEqual(
            response.json(),
            {
                "detail": "You must be administrator or owner of a room to add accesses to it."
            },
        )
        self.assertEqual(ResourceAccess.objects.count(), 2)

    def test_api_room_group_accesses_create_administrators_direct(self):
        """
        A user who is a direct administrator in a room should be allowed to create
        room group accesses in this room for any existing role provided
        s.he is administrator of the related group.
        """
        user = UserFactory()
        group = GroupFactory(members=[user])
        room = RoomFactory(users=[(user, "administrator")])

        jwt_token = AccessToken.for_user(user)

        role = random.choice(GROUP_ROLE_CHOICES)
        response = self.client.post(
            "/api/resource-accesses/",
            {
                "group": str(group.id),
                "resource": str(room.resource_id),
                "role": role,
            },
            format="json",
            HTTP_AUTHORIZATION=f"Bearer {jwt_token}",
        )

        self.assertEqual(response.status_code, 403)
        self.assertFalse(ResourceAccess.objects.filter(group__isnull=False).exists())

        # Now add the user as administrator of the group and it should work
        group.administrators.add(user)
        response = self.client.post(
            "/api/resource-accesses/",
            {
                "group": str(group.id),
                "resource": str(room.resource_id),
                "role": role,
            },
            format="json",
            HTTP_AUTHORIZATION=f"Bearer {jwt_token}",
        )
        self.assertEqual(response.status_code, 201)
        self.assertEqual(ResourceAccess.objects.count(), 2)
        self.assertTrue(ResourceAccess.objects.filter(group=group).exists())

    def test_api_room_group_accesses_create_administrators_via_group(self):
        """
        A user who is an administrator via a group in a room should be allowed to
        create room group accesses in this room for any existing role, provided
        s.he is administrator of the related group.
        """
        user = UserFactory()
        group_admin = GroupFactory(members=[user])
        room = RoomFactory(groups=[(group_admin, "administrator")])

        jwt_token = AccessToken.for_user(user)

        group = GroupFactory(members=[user])
        role = random.choice(GROUP_ROLE_CHOICES)

        self.assertEqual(ResourceAccess.objects.count(), 1)
        response = self.client.post(
            "/api/resource-accesses/",
            {
                "group": str(group.id),
                "resource": str(room.resource_id),
                "role": role,
            },
            format="json",
            HTTP_AUTHORIZATION=f"Bearer {jwt_token}",
        )
        self.assertEqual(response.status_code, 403)
        self.assertEqual(ResourceAccess.objects.count(), 1)

        # Now add the user as administrator of the group and it should work
        group.administrators.add(user)
        response = self.client.post(
            "/api/resource-accesses/",
            {
                "group": str(group.id),
                "resource": str(room.resource_id),
                "role": role,
            },
            format="json",
            HTTP_AUTHORIZATION=f"Bearer {jwt_token}",
        )
        self.assertEqual(response.status_code, 201)
        self.assertEqual(ResourceAccess.objects.count(), 2)
        self.assertTrue(ResourceAccess.objects.filter(group=group).exists())

    def test_api_room_group_accesses_create_owners_owner(self):
        """
        A user who is owner in a room, be it directly or via a group, should not
        be allowed to create accesses for a group in this room with the owner role
        as it does not exist for groups.
        """
        user = UserFactory()
        group = GroupFactory(administrators=[user])
        room = RoomFactory(users=[(user, "owner")])

        jwt_token = AccessToken.for_user(user)

        self.assertEqual(ResourceAccess.objects.count(), 1)
        response = self.client.post(
            "/api/resource-accesses/",
            {
                "group": str(group.id),
                "resource": str(room.resource_id),
                "role": "owner",
            },
            format="json",
            HTTP_AUTHORIZATION=f"Bearer {jwt_token}",
        )

        self.assertEqual(response.status_code, 400)
        self.assertEqual(
            response.json(),
            {"__all__": ["The 'owner' role can not be assigned to a group."]},
        )
        self.assertEqual(ResourceAccess.objects.count(), 1)

    def test_api_room_group_accesses_create_owners_roles(self):
        """
        A user who is an owner of a room should be allowed to create
        room group accesses in this room for all roles provided
        s.he is an administrator of the related group.
        """
        user = UserFactory()
        group = GroupFactory()
        room = RoomFactory(users=[(user, "owner")])

        jwt_token = AccessToken.for_user(user)

        role = random.choice(GROUP_ROLE_CHOICES)
        response = self.client.post(
            "/api/resource-accesses/",
            {
                "group": str(group.id),
                "resource": str(room.resource_id),
                "role": role,
            },
            format="json",
            HTTP_AUTHORIZATION=f"Bearer {jwt_token}",
        )
        self.assertEqual(response.status_code, 403)
        self.assertFalse(ResourceAccess.objects.filter(group=group).exists())

        # Now add the user as administrator of the group and it should work
        group.administrators.add(user)
        response = self.client.post(
            "/api/resource-accesses/",
            {
                "group": str(group.id),
                "resource": str(room.resource_id),
                "role": role,
            },
            format="json",
            HTTP_AUTHORIZATION=f"Bearer {jwt_token}",
        )
        self.assertEqual(response.status_code, 201)
        self.assertEqual(ResourceAccess.objects.count(), 2)
        self.assertTrue(ResourceAccess.objects.filter(group=group).exists())

    # Update

    def test_api_room_group_accesses_update_anonymous(self):
        """Anonymous users should not be allowed to update a room group access."""
        access = GroupResourceAccessFactory()
        old_values = ResourceAccessSerializer(instance=access).data

        new_values = {
            "id": uuid4(),
            "resource": RoomFactory().id,
            "group": GroupFactory().id,
            "role": random.choice(GROUP_ROLE_CHOICES),
        }

        for field, value in new_values.items():
            response = self.client.put(
                f"/api/resource-accesses/{access.id!s}/",
                {**old_values, field: value},
                format="json",
            )
            self.assertEqual(response.status_code, 401)
            access.refresh_from_db()
            updated_values = ResourceAccessSerializer(instance=access).data
            self.assertEqual(updated_values, old_values)

    def test_api_room_group_accesses_update_authenticated(self):
        """Authenticated users should not be allowed to update a room group access."""
        user = UserFactory()
        jwt_token = AccessToken.for_user(user)

        access = GroupResourceAccessFactory()
        old_values = ResourceAccessSerializer(instance=access).data

        new_values = {
            "id": uuid4(),
            "resource": RoomFactory(users=[(user, "member")]).id,
            "group": GroupFactory(administrators=[user]).id,
            "role": random.choice(GROUP_ROLE_CHOICES),
        }

        for field, value in new_values.items():
            response = self.client.put(
                f"/api/resource-accesses/{access.id!s}/",
                {**old_values, field: value},
                format="json",
                HTTP_AUTHORIZATION=f"Bearer {jwt_token}",
            )

            self.assertEqual(response.status_code, 403)
            access.refresh_from_db()
            updated_values = ResourceAccessSerializer(instance=access).data
            self.assertEqual(updated_values, old_values)

    def test_api_room_group_accesses_update_members(self):
        """
        A user who is a simple member in a room should not be allowed to update
        a group access for this room.
        """
        user = UserFactory()
        group = GroupFactory(members=[user])
        jwt_token = AccessToken.for_user(user)

        room = RoomFactory(users=[(user, "member")], groups=[(group, "member")])
        access = GroupResourceAccessFactory(
            resource=room, group__administrators=[user], role="member"
        )
        old_values = ResourceAccessSerializer(instance=access).data

        new_values = {
            "id": uuid4(),
            "resource": RoomFactory(users=[(user, "member")]).id,
            "group": GroupFactory(administrators=[user]).id,
            "role": random.choice(GROUP_ROLE_CHOICES),
        }

        for field, value in new_values.items():
            response = self.client.put(
                f"/api/resource-accesses/{access.id!s}/",
                {**old_values, field: value},
                format="json",
                HTTP_AUTHORIZATION=f"Bearer {jwt_token}",
            )

            self.assertEqual(response.status_code, 403)
            access.refresh_from_db()
            updated_values = ResourceAccessSerializer(instance=access).data
            self.assertEqual(updated_values, old_values)

    def test_api_room_group_accesses_update_administrators_or_owners_direct(self):
        """
        A user who is a direct administrator or owner in a room should be allowed to update
        a group access for this room even if s.he has no administrator rights
        on the group (restriction only applies for creating accesses).
        """
        user = UserFactory()
        jwt_token = AccessToken.for_user(user)

        room = RoomFactory(users=[(user, random.choice(["administrator", "owner"]))])
        access = GroupResourceAccessFactory(resource=room, role="member")
        old_values = ResourceAccessSerializer(instance=access).data

        new_group = GroupFactory()
        new_values = {
            "id": uuid4(),
            "resource": RoomFactory(users=[(user, "administrator")]).id,
            "group": new_group.id,
            "role": random.choice(GROUP_ROLE_CHOICES),
        }

        for field, value in new_values.items():
            response = self.client.put(
                f"/api/resource-accesses/{access.id!s}/",
                {**old_values, field: value},
                format="json",
                HTTP_AUTHORIZATION=f"Bearer {jwt_token}",
            )

            self.assertEqual(response.status_code, 200)
            access.refresh_from_db()
            updated_values = ResourceAccessSerializer(instance=access).data

            # Only the "role" fied can be updated
            if field == "role":
                self.assertEqual(
                    updated_values, {**old_values, "role": new_values["role"]}
                )
            else:
                self.assertEqual(updated_values, old_values)

    def test_api_room_group_accesses_update_administrators_via_group(self):
        """
        A user who is an administrator in a room, directly or via a group, should be allowed
        to update a group access for this room even if s.he has no administrator rights
        on the group (restriction only applies for creating accesses).
        """
        user = UserFactory()
        group = GroupFactory(members=[user])
        jwt_token = AccessToken.for_user(user)

        room = RoomFactory(groups=[(group, "administrator")])
        access = GroupResourceAccessFactory(resource=room, role="member")
        old_values = ResourceAccessSerializer(instance=access).data

        new_group = GroupFactory()
        new_values = {
            "id": uuid4(),
            "resource": RoomFactory(users=[(user, "administrator")]).id,
            "group": new_group.id,
            "role": random.choice(GROUP_ROLE_CHOICES),
        }

        for field, value in new_values.items():
            response = self.client.put(
                f"/api/resource-accesses/{access.id!s}/",
                {**old_values, field: value},
                format="json",
                HTTP_AUTHORIZATION=f"Bearer {jwt_token}",
            )

            self.assertEqual(response.status_code, 200)
            access.refresh_from_db()
            updated_values = ResourceAccessSerializer(instance=access).data
            if field == "role":
                self.assertEqual(
                    updated_values, {**old_values, "role": new_values["role"]}
                )
            else:
                self.assertEqual(updated_values, old_values)

    # Delete

    def test_api_room_group_accesses_delete_anonymous(self):
        """Anonymous users should not be allowed to destroy a room group access."""
        access = GroupResourceAccessFactory()

        response = self.client.delete(
            f"/api/resource-accesses/{access.id!s}/",
        )

        self.assertEqual(response.status_code, 401)
        self.assertEqual(ResourceAccess.objects.count(), 1)

    def test_api_room_group_accesses_delete_authenticated(self):
        """
        Authenticated users should not be allowed to delete a room group access for a room
        to which they are not related.
        """
        access = GroupResourceAccessFactory()
        user = UserFactory()
        jwt_token = AccessToken.for_user(user)

        response = self.client.delete(
            f"/api/resource-accesses/{access.id!s}/",
            HTTP_AUTHORIZATION=f"Bearer {jwt_token}",
        )

        self.assertEqual(response.status_code, 403)
        self.assertEqual(ResourceAccess.objects.count(), 1)

    def test_api_room_group_accesses_delete_members(self):
        """
        Authenticated users should not be allowed to delete a room group access for a room in
        which they are a simple member, be it directly or via a group.
        """
        user = UserFactory()
        group = GroupFactory(members=[user])
        room = RoomFactory(users=[(user, "member")], groups=[(group, "member")])
        access = GroupResourceAccessFactory(resource=room)

        jwt_token = AccessToken.for_user(user)

        self.assertEqual(ResourceAccess.objects.count(), 3)
        response = self.client.delete(
            f"/api/resource-accesses/{access.id!s}/",
            HTTP_AUTHORIZATION=f"Bearer {jwt_token}",
        )

        self.assertEqual(response.status_code, 403)
        self.assertEqual(ResourceAccess.objects.count(), 3)
        self.assertTrue(ResourceAccess.objects.filter(group=access.group).exists())

    def test_api_room_group_accesses_delete_administrators_direct(self):
        """
        Users who are direct administrators in a room should be allowed to delete a user access
        from the room.
        """
        user = UserFactory()
        room = RoomFactory(users=[(user, "administrator")])
        access = GroupResourceAccessFactory(resource=room)

        jwt_token = AccessToken.for_user(user)

        self.assertEqual(ResourceAccess.objects.count(), 2)
        self.assertTrue(ResourceAccess.objects.filter(group=access.group).exists())
        response = self.client.delete(
            f"/api/resource-accesses/{access.id!s}/",
            HTTP_AUTHORIZATION=f"Bearer {jwt_token}",
        )

        self.assertEqual(response.status_code, 204)
        self.assertFalse(ResourceAccess.objects.filter(group=access.group).exists())

    def test_api_room_group_accesses_delete_administrators_via_group(self):
        """
        Users who are administrators in a room via a group should be allowed to delete a
        user access from the room.

        Note that we don't need to be an administrator of the group to remove it from the room,
        even though it was required to be an administrator of the group to add it to the room in
        the first palce. The idea is that, when adding a group to a room, I only pick among my own
        groups. But once a group is added to a room with a role, any admin on the room can modifiy
        the role assigned to this group in the room and eventually remove it from the room!
        """
        user = UserFactory()
        group = GroupFactory(members=[user])
        room = RoomFactory(groups=[(group, "administrator")])
        access = GroupResourceAccessFactory(resource=room)

        jwt_token = AccessToken.for_user(user)

        self.assertEqual(ResourceAccess.objects.count(), 2)
        self.assertTrue(ResourceAccess.objects.filter(group=access.group).exists())
        response = self.client.delete(
            f"/api/resource-accesses/{access.id!s}/",
            HTTP_AUTHORIZATION=f"Bearer {jwt_token}",
        )

        self.assertEqual(response.status_code, 204)
        self.assertEqual(ResourceAccess.objects.count(), 1)
        self.assertFalse(ResourceAccess.objects.filter(group=access.group).exists())

    def test_api_room_group_accesses_delete_owners(self):
        """
        Users should be able to delete the room group access of another user
        for a room in which they are direct owner.

        Note that we don't need to be an administrator of the group to remove it from the room,
        even though it was required to be an administrator of the group to add it to the room in
        the first palce. The idea is that, when adding a group to a room, I only pick among my own
        groups. But once a group is added to a room with a role, any admin on the room can modifiy
        the role assigned to this group in the room and eventually remove it from the room!
        """
        user = UserFactory()
        room = RoomFactory(users=[(user, "owner")])
        access = GroupResourceAccessFactory(resource=room)

        jwt_token = AccessToken.for_user(user)

        self.assertEqual(ResourceAccess.objects.count(), 2)
        self.assertTrue(ResourceAccess.objects.filter(group=access.group).exists())
        response = self.client.delete(
            f"/api/resource-accesses/{access.id!s}/",
            HTTP_AUTHORIZATION=f"Bearer {jwt_token}",
        )

        self.assertEqual(response.status_code, 204)
        self.assertFalse(ResourceAccess.objects.filter(group=access.group).exists())
