"""
Unit tests for the ResourceAccess model with user
"""
from django.core.exceptions import ValidationError
from django.test import TestCase

from magnify.apps.core.factories import (
    GroupResourceAccessFactory,
    RoomFactory,
    UserResourceAccessFactory,
)


class ResourceAccessesModelsTestCase(TestCase):
    """
    Unit test suite to validate the behavior of the ResourceAccess model with user
    """

    def test_models_resource_accesses_user_str_member_room(self):
        """The str representation should consist in the room and user names."""
        room = RoomFactory(name="my room")
        access = UserResourceAccessFactory(
            resource=room, user__name="François", role="member"
        )
        self.assertEqual(
            str(access),
            "Member role for François on my room",
        )

    def test_models_resource_accesses_user_str_member_resource(self):
        """The str representation should consist in the resource id and user name."""
        access = UserResourceAccessFactory(user__name="François", role="member")
        self.assertEqual(
            str(access),
            f"Member role for François on resource {access.resource_id!s}",
        )

    def test_models_resource_accesses_user_str_admin(self):
        """The str representation for an admin user should include the role."""
        access = UserResourceAccessFactory(user__name="François", role="administrator")

        self.assertEqual(
            str(access),
            f"Administrator role for François on resource {access.resource_id!s}",
        )

    def test_models_resource_accesses_user_str_owner(self):
        """The str representation for an admin user should include the role."""
        access = UserResourceAccessFactory(user__name="François", role="owner")
        self.assertEqual(
            str(access),
            f"Owner role for François on resource {access.resource_id!s}",
        )

    def test_models_resource_accesses_user_unique(self):
        """Room user accesses should be unique."""
        access = UserResourceAccessFactory()

        with self.assertRaises(ValidationError) as context:
            UserResourceAccessFactory(user=access.user, resource=access.resource)

        self.assertEqual(
            context.exception.messages,
            ["Resource access with this user and resource already exists."],
        )

    def test_models_resource_accesses_group_str_member(self):
        """The str representation should consist in the resource and group names."""
        access = GroupResourceAccessFactory(group__name="teachers", role="member")
        self.assertEqual(
            str(access),
            f"Member role for teachers on resource {access.resource_id!s}",
        )

    def test_models_resource_accesses_group_str_admin(self):
        """The str representation for an admin group should include the mention."""
        access = GroupResourceAccessFactory(
            group__name="teachers", role="administrator"
        )

        self.assertEqual(
            str(access),
            f"Administrator role for teachers on resource {access.resource_id!s}",
        )

    def test_models_resource_accesses_group_role_owner(self):
        """There is no "owner" role on the resource group access model."""
        with self.assertRaises(ValidationError) as context:
            GroupResourceAccessFactory(role="owner")

        self.assertEqual(
            context.exception.messages,
            ["The 'owner' role can not be assigned to a group."],
        )

    def test_models_resource_accesses_group_unique(self):
        """Resource group accesses should be unique."""
        access = GroupResourceAccessFactory()

        with self.assertRaises(ValidationError) as context:
            GroupResourceAccessFactory(group=access.group, resource=access.resource)

        self.assertEqual(
            context.exception.messages,
            ["Resource access with this group and resource already exists."],
        )
