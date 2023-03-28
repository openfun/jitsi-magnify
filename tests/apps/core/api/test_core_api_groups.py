"""
Tests for Groups API endpoints in Magnify's core app.
"""
from unittest import mock

from rest_framework.pagination import PageNumberPagination
from rest_framework.test import APITestCase
from rest_framework_simplejwt.tokens import AccessToken

from magnify.apps.core.factories import GroupFactory, UserFactory
from magnify.apps.core.models import Group


class GroupsApiTestCase(APITestCase):
    """Test requests on magnify's core app API endpoints."""

    def test_api_groups_list_anonymous(self):
        """Anonymous users should not be allowed to list groups."""
        GroupFactory.create_batch(2)
        response = self.client.get("/api/groups/")
        self.assertEqual(response.status_code, 401)
        self.assertEqual(
            response.json(), {"detail": "Authentication credentials were not provided."}
        )

    def test_api_groups_list_authenticated(self):
        """Authenticated users should be able to list groups they are administrator of."""
        user = UserFactory()
        groups = GroupFactory.create_batch(2, administrators=[user])
        GroupFactory()
        GroupFactory(members=[user])
        jwt_token = AccessToken.for_user(user)

        response = self.client.get(
            "/api/groups/", HTTP_AUTHORIZATION=f"Bearer {jwt_token}"
        )

        self.assertEqual(response.status_code, 200)
        results = response.json()["results"]
        self.assertEqual(len(results), 2)
        expected_ids = {str(g.id) for g in groups}
        results_id = {result["id"] for result in results}
        self.assertEqual(expected_ids, results_id)

    @mock.patch.object(PageNumberPagination, "get_page_size", return_value=2)
    def test_api_groups_list_pagination(self, _mock_page_size):
        """Pagination should work as expected."""
        user = UserFactory()
        jwt_token = AccessToken.for_user(user)

        groups = GroupFactory.create_batch(3, administrators=[user])
        group_ids = [str(g.id) for g in groups]

        # Get page 1
        response = self.client.get(
            "/api/groups/", HTTP_AUTHORIZATION=f"Bearer {jwt_token}"
        )

        self.assertEqual(response.status_code, 200)
        content = response.json()

        self.assertEqual(content["count"], 3)
        self.assertEqual(content["next"], "http://testserver/api/groups/?page=2")
        self.assertIsNone(content["previous"])

        self.assertEqual(len(content["results"]), 2)
        for item in content["results"]:
            group_ids.remove(item["id"])

        # Get page 2
        response = self.client.get(
            "/api/groups/?page=2", HTTP_AUTHORIZATION=f"Bearer {jwt_token}"
        )

        self.assertEqual(response.status_code, 200)
        content = response.json()

        self.assertEqual(content["count"], 3)
        self.assertIsNone(content["next"])
        self.assertEqual(content["previous"], "http://testserver/api/groups/")

        self.assertEqual(len(content["results"]), 1)
        group_ids.remove(content["results"][0]["id"])
        self.assertEqual(group_ids, [])

    def test_api_groups_retrieve_anonymous(self):
        """Anonymous users should not be allowed to retrieve a group."""
        group = GroupFactory()
        response = self.client.get(f"/api/groups/{group.id}/")

        self.assertEqual(response.status_code, 401)
        self.assertEqual(
            response.json(), {"detail": "Authentication credentials were not provided."}
        )

    def test_api_groups_retrieve_authenticated(self):
        """
        Authenticated users should not be allowed to retrieve a group of which they are
        only member.
        """
        user = UserFactory()
        group = GroupFactory(members=[user])
        jwt_token = AccessToken.for_user(user)

        response = self.client.get(
            f"/api/groups/{group.id}/", HTTP_AUTHORIZATION=f"Bearer {jwt_token}"
        )
        self.assertEqual(response.status_code, 403)
        self.assertEqual(
            response.json(),
            {"detail": "You do not have permission to perform this action."},
        )

    def test_api_groups_retrieve_administrator(self):
        """
        Authenticated users should be allowed to retrieve a group of which they are administrator.
        """
        user = UserFactory()
        group = GroupFactory(administrators=[user])
        jwt_token = AccessToken.for_user(user)

        response = self.client.get(
            f"/api/groups/{group.id}/", HTTP_AUTHORIZATION=f"Bearer {jwt_token}"
        )
        self.assertEqual(response.status_code, 200)
        result = response.json()
        self.assertEqual(
            result,
            {
                "id": str(group.id),
                "administrators": [str(user.id)],
                "members": [],
                "name": group.name,
            },
        )

    def test_api_groups_create_anonymous(self):
        """Anonymous users should not be allowed to create a group."""
        response = self.client.post("/api/groups/")
        self.assertEqual(response.status_code, 401)
        self.assertEqual(
            response.json(), {"detail": "Authentication credentials were not provided."}
        )

    def test_api_groups_create_authenticated_success(self):
        """
        Authenticated users should be allowed to create a group and should automatically
        be declared as administrator of the newly created group.
        """
        user = UserFactory()
        jwt_token = AccessToken.for_user(user)

        response = self.client.post(
            "/api/groups/",
            {"name": "The group", "administrators": [str(user.id)]},
            HTTP_AUTHORIZATION=f"Bearer {jwt_token}",
        )
        self.assertEqual(response.status_code, 201)

        group = Group.objects.get()
        result = response.json()
        self.assertEqual(
            result,
            {
                "id": str(group.id),
                "administrators": [str(user.id)],
                "members": [],
                "name": "The group",
            },
        )

    def test_api_groups_create_authenticated_empty_administrators(self):
        """There should always be at least one administrator for the group."""
        user = UserFactory()
        jwt_token = AccessToken.for_user(user)

        response = self.client.post(
            "/api/groups/",
            {"name": "The group"},
            HTTP_AUTHORIZATION=f"Bearer {jwt_token}",
        )
        self.assertEqual(response.status_code, 400)

        self.assertEqual(
            response.json(),
            {"administrators": ["The group must have at least one administrator."]},
        )

    def test_api_groups_update_authenticated(self):
        """
        Authenticated users should not be allowed to update a group of which they are only
        a member.
        """
        admin = UserFactory()
        user = UserFactory()
        group = GroupFactory(name="Old name", members=[user], administrators=[admin])
        jwt_token = AccessToken.for_user(user)

        response = self.client.put(
            f"/api/groups/{group.id}/",
            {"name": "The group", "administrators": [str(admin.id)]},
            HTTP_AUTHORIZATION=f"Bearer {jwt_token}",
        )

        self.assertEqual(response.status_code, 403)
        self.assertEqual(
            response.json(),
            {"detail": "You do not have permission to perform this action."},
        )
        group.refresh_from_db()
        self.assertEqual(group.name, "Old name")

    def test_api_groups_update_administrators(self):
        """Administrators should be allowed to update the group"""
        user = UserFactory()
        member = UserFactory()
        group = GroupFactory(name="Old name", administrators=[user])
        jwt_token = AccessToken.for_user(user)

        response = self.client.put(
            f"/api/groups/{group.id}/",
            {
                "name": "The group",
                "members": [str(member.id)],
                "administrators": [str(user.id)],
            },
            HTTP_AUTHORIZATION=f"Bearer {jwt_token}",
        )
        self.assertEqual(response.status_code, 200)
        self.assertEqual(
            response.json(),
            {
                "id": str(group.id),
                "administrators": [str(user.id)],
                "members": [str(member.id)],
                "name": "The group",
            },
        )
        group.refresh_from_db()
        self.assertEqual(group.name, "The group")

    def test_api_groups_update_administrator_of_another(self):
        """
        Being administrator of a group should not grant
        authorization to update another group.
        """
        group = GroupFactory(name="Old name")
        user = UserFactory()
        GroupFactory(administrators=[user])
        jwt_token = AccessToken.for_user(user)

        response = self.client.put(
            f"/api/groups/{group.id}/",
            {"name": "The group", "administrators": [str(user.id)]},
            HTTP_AUTHORIZATION=f"Bearer {jwt_token}",
        )

        self.assertEqual(response.status_code, 403)
        self.assertEqual(
            response.json(),
            {"detail": "You do not have permission to perform this action."},
        )
        group.refresh_from_db()
        self.assertEqual(group.name, "Old name")

    def test_api_groups_delete_anonymous(self):
        """Anonymous users should not be allowed to delete a group."""
        group = GroupFactory()

        response = self.client.delete(
            f"/api/groups/{group.id}/",
        )

        self.assertEqual(response.status_code, 401)
        self.assertEqual(
            response.json(), {"detail": "Authentication credentials were not provided."}
        )
        self.assertEqual(Group.objects.count(), 1)

    def test_api_groups_delete_authenticated(self):
        """
        Authenticated users should not be allowed to delete
        a group they are only a member of.
        """
        user = UserFactory()
        group = GroupFactory(members=[user])
        jwt_token = AccessToken.for_user(user)

        response = self.client.delete(
            f"/api/groups/{group.id}/",
            HTTP_AUTHORIZATION=f"Bearer {jwt_token}",
        )

        self.assertEqual(response.status_code, 403)
        self.assertEqual(
            response.json(),
            {"detail": "You do not have permission to perform this action."},
        )
        self.assertEqual(Group.objects.count(), 1)

    def test_api_groups_delete_administrator(self):
        """Administrators should be allowed to delete a group."""
        user = UserFactory()
        group = GroupFactory(administrators=[user])
        jwt_token = AccessToken.for_user(user)

        response = self.client.delete(
            f"/api/groups/{group.id}/",
            HTTP_AUTHORIZATION=f"Bearer {jwt_token}",
        )

        self.assertEqual(response.status_code, 204)
        self.assertEqual(Group.objects.count(), 0)

    def test_api_groups_delete_administrator_of_another(self):
        """
        Being administrator of a group should not grant
        authorization to delete another group.
        """
        group = GroupFactory()
        user = UserFactory()
        GroupFactory(administrators=[user])
        jwt_token = AccessToken.for_user(user)

        response = self.client.delete(
            f"/api/groups/{group.id}/",
            HTTP_AUTHORIZATION=f"Bearer {jwt_token}",
        )

        self.assertEqual(response.status_code, 403)
        self.assertEqual(
            response.json(),
            {"detail": "You do not have permission to perform this action."},
        )
        self.assertEqual(Group.objects.count(), 2)
