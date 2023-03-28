"""
Tests meeting access API endpoints with groups in Magnify's core app.
"""
import random
from uuid import uuid4

from rest_framework.test import APITestCase
from rest_framework_simplejwt.tokens import AccessToken

from magnify.apps.core.factories import (
    GroupFactory,
    GroupMeetingAccessFactory,
    MeetingFactory,
    UserFactory,
    UserMeetingAccessFactory,
)
from magnify.apps.core.models import MeetingAccess
from magnify.apps.core.serializers import MeetingAccessSerializer

# pylint: disable=too-many-public-methods, too-many-lines


class UserMeetingAccessesAPITestCase(APITestCase):
    """Test requests on magnify's core app meeting access API endpoint with groups."""

    # List

    def test_api_meeting_user_accesses_list_anonymous(self):
        """Anonymous users should not be allowed to list meeting accesses."""
        UserMeetingAccessFactory()

        response = self.client.get("/api/meeting-accesses/")
        self.assertEqual(response.status_code, 401)
        self.assertEqual(
            response.json(), {"detail": "Authentication credentials were not provided."}
        )

    def test_api_meeting_user_accesses_list_authenticated_not_owner(self):
        """
        Authenticated users should not be allowed to list meeting accesses for a meeting
        that doesn't belong to them.
        """
        user = UserFactory()
        group = GroupFactory(members=[user])
        jwt_token = AccessToken.for_user(user)

        UserMeetingAccessFactory(user=user)
        GroupMeetingAccessFactory(group=group)

        response = self.client.get(
            "/api/meeting-accesses/",
            HTTP_AUTHORIZATION=f"Bearer {jwt_token}",
        )
        self.assertEqual(response.status_code, 405)
        self.assertEqual(response.json(), {"detail": 'Method "GET" not allowed.'})

    def test_api_meeting_user_accesses_list_authenticated_owner(self):
        """
        Authenticated users should be allowed to list meeting accesses for a meeting
        in which they are owner.
        """
        user = UserFactory()
        jwt_token = AccessToken.for_user(user)

        meeting = MeetingFactory(owner=user)
        GroupMeetingAccessFactory(meeting=meeting)
        UserMeetingAccessFactory(meeting=meeting)

        response = self.client.get(
            "/api/meeting-accesses/",
            HTTP_AUTHORIZATION=f"Bearer {jwt_token}",
        )

        self.assertEqual(response.status_code, 405)
        self.assertEqual(response.json(), {"detail": 'Method "GET" not allowed.'})

    # Retrieve

    def test_api_meeting_user_accesses_retrieve_anonymous(self):
        """
        Anonymous users should not be allowed to retrieve a meeting access.
        """
        access = UserMeetingAccessFactory()
        response = self.client.get(
            f"/api/meeting-accesses/{access.id!s}/",
        )

        self.assertEqual(response.status_code, 401)
        self.assertEqual(
            response.json(), {"detail": "Authentication credentials were not provided."}
        )

    def test_api_meeting_user_accesses_retrieve_authenticated_not_owner(self):
        """
        Authenticated users should not be allowed to retrieve a meeting access for
        a meeting that doesn't belong to them, be it public or private.
        """
        user = UserFactory()
        jwt_token = AccessToken.for_user(user)

        meeting = MeetingFactory()

        for access in [
            UserMeetingAccessFactory(meeting=meeting),
            GroupMeetingAccessFactory(meeting=meeting),
        ]:
            response = self.client.get(
                f"/api/meeting-accesses/{access.id!s}/",
                HTTP_AUTHORIZATION=f"Bearer {jwt_token}",
            )

            self.assertEqual(response.status_code, 403)
            self.assertEqual(
                response.json(),
                {"detail": "You do not have permission to perform this action."},
            )

    def test_api_meeting_user_accesses_retrieve_authenticated_owner_user(self):
        """
        A user who is the owner of a meeting should be allowed to retrieve the
        associated meeting user accesses
        """
        user = UserFactory()
        jwt_token = AccessToken.for_user(user)

        meeting = MeetingFactory(owner=user)
        access = UserMeetingAccessFactory(meeting=meeting)

        response = self.client.get(
            f"/api/meeting-accesses/{access.id!s}/",
            HTTP_AUTHORIZATION=f"Bearer {jwt_token}",
        )

        self.assertEqual(response.status_code, 200)
        self.assertEqual(
            response.json(),
            {
                "id": str(access.id),
                "user": str(access.user.id),
                "group": None,
                "meeting": str(access.meeting_id),
            },
        )

    def test_api_meeting_user_accesses_retrieve_authenticated_owner_group(self):
        """
        A user who is the owner of a meeting should be allowed to retrieve the
        associated meeting goup accesses
        """
        user = UserFactory()
        jwt_token = AccessToken.for_user(user)

        meeting = MeetingFactory(owner=user)
        access = GroupMeetingAccessFactory(meeting=meeting)

        response = self.client.get(
            f"/api/meeting-accesses/{access.id!s}/",
            HTTP_AUTHORIZATION=f"Bearer {jwt_token}",
        )

        self.assertEqual(response.status_code, 200)
        self.assertEqual(
            response.json(),
            {
                "id": str(access.id),
                "user": None,
                "group": str(access.group.id),
                "meeting": str(access.meeting_id),
            },
        )

    # Create

    def test_api_meeting_user_accesses_create_anonymous(self):
        """Anonymous users should not be allowed to create meeting accesses."""
        user = UserFactory()
        meeting = MeetingFactory()

        response = self.client.post(
            "/api/meeting-accesses/",
            {
                "user": str(user.id),
                "meeting": str(meeting.id),
            },
        )
        self.assertEqual(response.status_code, 401)
        self.assertEqual(
            response.json(), {"detail": "Authentication credentials were not provided."}
        )
        self.assertFalse(MeetingAccess.objects.exists())

    def test_api_meeting_user_accesses_create_authenticated(self):
        """Authenticated users should not be allowed to create meeting accesses."""
        user, other_user = UserFactory.create_batch(2)
        meeting = MeetingFactory()

        jwt_token = AccessToken.for_user(user)

        response = self.client.post(
            "/api/meeting-accesses/",
            {
                "user": str(other_user.id),
                "meeting": str(meeting.id),
            },
            HTTP_AUTHORIZATION=f"Bearer {jwt_token}",
        )
        self.assertEqual(response.status_code, 403)
        self.assertEqual(
            response.json(),
            {"detail": "You must be owner of a meeting to add accesses to it."},
        )
        self.assertFalse(MeetingAccess.objects.filter(user=other_user).exists())

    def test_api_meeting_user_accesses_create_guests(self):
        """
        A user who is a guest in a meeting should not be allowed to create
        meeting accesses in this meeting.
        """
        user, other_user = UserFactory.create_batch(2)
        group = random.choice(
            [GroupFactory(members=[user]), GroupFactory(administrators=[user])]
        )
        meeting = MeetingFactory(users=[user], groups=[group])

        jwt_token = AccessToken.for_user(user)

        response = self.client.post(
            "/api/meeting-accesses/",
            {
                "user": str(other_user.id),
                "meeting": str(meeting.id),
            },
            HTTP_AUTHORIZATION=f"Bearer {jwt_token}",
        )

        self.assertEqual(response.status_code, 403)
        self.assertEqual(
            response.json(),
            {"detail": "You must be owner of a meeting to add accesses to it."},
        )
        self.assertFalse(MeetingAccess.objects.filter(user=other_user).exists())

    def test_api_meeting_user_accesses_create_owner_user(self):
        """
        A user who is the owner of a meeting should be allowed to create
        meeting user accesses in this meeting.
        """
        user = UserFactory()
        jwt_token = AccessToken.for_user(user)

        meeting = MeetingFactory(owner=user)
        other_user = UserFactory()

        response = self.client.post(
            "/api/meeting-accesses/",
            {
                "user": str(other_user.id),
                "meeting": str(meeting.id),
            },
            HTTP_AUTHORIZATION=f"Bearer {jwt_token}",
        )

        self.assertEqual(response.status_code, 201)
        self.assertEqual(MeetingAccess.objects.count(), 1)
        self.assertTrue(MeetingAccess.objects.filter(user=other_user).exists())

    def test_api_meeting_user_accesses_create_owner_group_administrator(self):
        """
        A user who is the owner of a meeting should be allowed to create
        meeting group accesses in this meeting for groups of which s.he is administrator.
        """
        user = UserFactory()
        jwt_token = AccessToken.for_user(user)

        meeting = MeetingFactory(owner=user)
        group = GroupFactory(administrators=[user])

        response = self.client.post(
            "/api/meeting-accesses/",
            {
                "group": str(group.id),
                "meeting": str(meeting.id),
            },
            HTTP_AUTHORIZATION=f"Bearer {jwt_token}",
        )

        self.assertEqual(response.status_code, 201)
        self.assertEqual(MeetingAccess.objects.count(), 1)
        self.assertTrue(MeetingAccess.objects.filter(group=group).exists())

    def test_api_meeting_user_accesses_create_owner_group_member(self):
        """
        A user who is the owner of a meeting should not be allowed to create
        meeting group accesses in this meeting for groups of which s.he is a simple member.
        """
        user = UserFactory()
        jwt_token = AccessToken.for_user(user)

        meeting = MeetingFactory(owner=user)
        group = GroupFactory(members=[user])

        response = self.client.post(
            "/api/meeting-accesses/",
            {
                "group": str(group.id),
                "meeting": str(meeting.id),
            },
            HTTP_AUTHORIZATION=f"Bearer {jwt_token}",
        )

        self.assertEqual(response.status_code, 403)
        self.assertEqual(
            response.json(),
            {
                "detail": "You must be administrator of a group to give it access to a meeting."
            },
        )
        self.assertFalse(MeetingAccess.objects.filter(group=group).exists())

    # Update

    def test_api_meeting_user_accesses_update_anonymous(self):
        """Anonymous users should not be allowed to update a meeting access."""
        access = UserMeetingAccessFactory()
        old_values = MeetingAccessSerializer(instance=access).data

        new_values = {
            "id": uuid4(),
            "meeting": MeetingFactory().id,
            "group": GroupFactory().id,
            "user": UserFactory().id,
        }

        for field, value in new_values.items():
            response = self.client.put(
                f"/api/meeting-accesses/{access.id!s}/",
                {**old_values, field: value},
                format="json",
            )
            self.assertEqual(response.status_code, 401)
            access.refresh_from_db()
            updated_values = MeetingAccessSerializer(instance=access).data
            self.assertEqual(updated_values, old_values)

    def test_api_meeting_user_accesses_update_authenticated(self):
        """Authenticated users should not be allowed to update a meeting access."""
        user = UserFactory()
        jwt_token = AccessToken.for_user(user)

        access = UserMeetingAccessFactory()
        old_values = MeetingAccessSerializer(instance=access).data

        new_values = {
            "id": uuid4(),
            "meeting": MeetingFactory(owner=user, users=[user]).id,
            "group": GroupFactory().id,
            "user": UserFactory().id,
        }

        for field, value in new_values.items():
            response = self.client.put(
                f"/api/meeting-accesses/{access.id!s}/",
                {**old_values, field: value},
                format="json",
                HTTP_AUTHORIZATION=f"Bearer {jwt_token}",
            )
            self.assertEqual(response.status_code, 405)
            access.refresh_from_db()
            updated_values = MeetingAccessSerializer(instance=access).data
            self.assertEqual(updated_values, old_values)

    def test_api_meeting_user_accesses_update_guests(self):
        """
        A user who is a simple guest in a meeting should not be allowed to update
        an access for this meeting.
        """
        user = UserFactory()
        group = random.choice(
            [GroupFactory(members=[user]), GroupFactory(administrators=[user])]
        )
        jwt_token = AccessToken.for_user(user)

        meeting = MeetingFactory(users=[user], groups=[group])
        access = UserMeetingAccessFactory(meeting=meeting)
        old_values = MeetingAccessSerializer(instance=access).data

        new_values = {
            "id": uuid4(),
            "meeting": MeetingFactory(owner=user, users=[user]).id,
            "group": GroupFactory().id,
            "user": UserFactory().id,
        }

        for field, value in new_values.items():
            response = self.client.put(
                f"/api/meeting-accesses/{access.id!s}/",
                {**old_values, field: value},
                format="json",
                HTTP_AUTHORIZATION=f"Bearer {jwt_token}",
            )
            self.assertEqual(response.status_code, 405)
            access.refresh_from_db()
            updated_values = MeetingAccessSerializer(instance=access).data
            self.assertEqual(updated_values, old_values)

    def test_api_meeting_user_accesses_update_owners(self):
        """
        A user who is the owner of a meeting should not be allowed to update
        accesses for this meeting.
        """
        user = UserFactory()
        jwt_token = AccessToken.for_user(user)

        meeting = MeetingFactory(owner=user)
        access = UserMeetingAccessFactory(meeting=meeting)
        old_values = MeetingAccessSerializer(instance=access).data

        new_values = {
            "id": uuid4(),
            "meeting": MeetingFactory(owner=user, users=[user]).id,
            "group": GroupFactory().id,
            "user": UserFactory().id,
        }
        for field, value in new_values.items():
            response = self.client.put(
                f"/api/meeting-accesses/{access.id!s}/",
                {**old_values, field: value},
                format="json",
                HTTP_AUTHORIZATION=f"Bearer {jwt_token}",
            )
            self.assertEqual(response.status_code, 405)
            access.refresh_from_db()
            updated_values = MeetingAccessSerializer(instance=access).data
            self.assertEqual(updated_values, old_values)

    # Delete

    def test_api_meeting_user_accesses_delete_anonymous(self):
        """Anonymous users should not be allowed to destroy a meeting access."""
        access = UserMeetingAccessFactory()

        response = self.client.delete(
            f"/api/meeting-accesses/{access.id!s}/",
        )

        self.assertEqual(response.status_code, 401)
        self.assertEqual(MeetingAccess.objects.count(), 1)

    def test_api_meeting_user_accesses_delete_authenticated(self):
        """
        Authenticated users should not be allowed to delete a meeting access for a meeting in
        which they are not administrator.
        """
        access = UserMeetingAccessFactory()
        user = UserFactory()
        jwt_token = AccessToken.for_user(user)

        response = self.client.delete(
            f"/api/meeting-accesses/{access.id!s}/",
            HTTP_AUTHORIZATION=f"Bearer {jwt_token}",
        )

        self.assertEqual(response.status_code, 403)
        self.assertEqual(MeetingAccess.objects.count(), 1)

    def test_api_meeting_user_accesses_delete_guests(self):
        """
        Authenticated users should not be allowed to delete a meeting access for a
        meeting in which they are guest.
        """
        user = UserFactory()
        group = random.choice(
            [GroupFactory(members=[user]), GroupFactory(administrators=[user])]
        )
        meeting = MeetingFactory(users=[user], groups=[group])
        access = UserMeetingAccessFactory(meeting=meeting)

        jwt_token = AccessToken.for_user(user)

        self.assertEqual(MeetingAccess.objects.count(), 3)
        self.assertTrue(MeetingAccess.objects.filter(user=access.user).exists())
        response = self.client.delete(
            f"/api/meeting-accesses/{access.id!s}/",
            HTTP_AUTHORIZATION=f"Bearer {jwt_token}",
        )

        self.assertEqual(response.status_code, 403)
        self.assertEqual(MeetingAccess.objects.count(), 3)

    def test_api_meeting_user_accesses_delete_owners(self):
        """
        Users should be able to delete a meeting access for a meeting
        that belongs to them.
        """
        user = UserFactory()
        meeting = MeetingFactory(owner=user)
        access = UserMeetingAccessFactory(meeting=meeting)

        jwt_token = AccessToken.for_user(user)

        self.assertEqual(MeetingAccess.objects.count(), 1)
        self.assertTrue(MeetingAccess.objects.filter(user=access.user).exists())
        response = self.client.delete(
            f"/api/meeting-accesses/{access.id!s}/",
            HTTP_AUTHORIZATION=f"Bearer {jwt_token}",
        )

        self.assertEqual(response.status_code, 204)
        self.assertFalse(MeetingAccess.objects.exists())
