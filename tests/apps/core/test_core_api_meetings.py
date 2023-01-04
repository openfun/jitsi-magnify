"""
Tests for Meetings API endpoints in Magnify's core app.
"""
import random
from datetime import datetime
from unittest import mock
from zoneinfo import ZoneInfo

from rest_framework.pagination import PageNumberPagination
from rest_framework.test import APITestCase
from rest_framework_simplejwt.tokens import AccessToken

from magnify.apps.core.factories import (
    GroupFactory,
    MeetingFactory,
    RoomFactory,
    UserFactory,
)
from magnify.apps.core.models import Meeting, MeetingAccess

# pylint: disable=too-many-public-methods,too-many-lines


class MeetingsApiTestCase(APITestCase):
    """Test requests on magnify's core app API endpoints."""

    # List

    def test_api_meetings_list_anonymous(self):
        """Anonymous users should not be allowed to list meetings."""
        start = datetime(2022, 7, 7, 9, 0, tzinfo=ZoneInfo("UTC"))
        MeetingFactory(start=start, is_public=False)
        MeetingFactory(start=start, is_public=True)

        response = self.client.get(
            "/api/meetings/?from=2022-07-07T09:00:00Z&to=2022-07-10T18:00:00Z"
        )
        self.assertEqual(response.status_code, 200)

        results = response.json()["results"]
        self.assertEqual(results, [])

    def test_api_meetings_list_authenticated(self):
        """
        Authenticated users should be able to list meetings to which they are
        related directly or via a group. They should also be able to list the
        meetings that belong to them.
        """
        user = UserFactory()
        group = GroupFactory(members=[user])
        jwt_token = AccessToken.for_user(user)

        other_user = UserFactory()
        other_group = GroupFactory(members=[other_user])

        start = datetime(2022, 7, 7, 9, 0, tzinfo=ZoneInfo("UTC"))
        meeting_owner = MeetingFactory(start=start, owner=user)
        MeetingFactory(start=start, is_public=False)
        MeetingFactory(start=start, is_public=True)
        meeting_group = MeetingFactory(start=start, is_public=False, groups=[group])
        meeting_user = MeetingFactory(start=start, is_public=False, users=[user])
        MeetingFactory(start=start, is_public=False, groups=[other_group])
        MeetingFactory(start=start, is_public=False, users=[other_user])

        response = self.client.get(
            "/api/meetings/?from=2022-07-07T09:00:00Z&to=2022-07-10T18:00:00Z",
            HTTP_AUTHORIZATION=f"Bearer {jwt_token}",
        )

        self.assertEqual(response.status_code, 200)
        results = response.json()["results"]
        self.assertEqual(len(results), 3)
        expected_ids = {
            str(meeting_owner.id),
            str(meeting_group.id),
            str(meeting_user.id),
        }
        results_ids = {result["id"] for result in results}
        self.assertEqual(expected_ids, results_ids)

    @mock.patch.object(PageNumberPagination, "get_page_size", return_value=2)
    def test_api_meetings_list_pagination(self, _mock_page_size):
        """Pagination should work as expected."""
        user = UserFactory()
        jwt_token = AccessToken.for_user(user)

        start = datetime(2022, 7, 7, 9, 0, tzinfo=ZoneInfo("UTC"))
        meetings = MeetingFactory.create_batch(3, start=start, users=[user])
        meeting_ids = [str(meeting.id) for meeting in meetings]

        response = self.client.get(
            "/api/meetings/?from=2022-07-07T09:00:00Z&to=2022-07-10T18:00:00Z",
            HTTP_AUTHORIZATION=f"Bearer {jwt_token}",
        )

        self.assertEqual(response.status_code, 200)
        content = response.json()
        self.assertEqual(content["count"], 3)
        self.assertEqual(
            content["next"],
            (
                "http://testserver/api/meetings/?"
                "from=2022-07-07T09%3A00%3A00Z&page=2&to=2022-07-10T18%3A00%3A00Z"
            ),
        )
        self.assertIsNone(content["previous"])

        self.assertEqual(len(content["results"]), 2)
        for item in content["results"]:
            meeting_ids.remove(item["id"])

        # Get page 2
        response = self.client.get(
            "/api/meetings/?from=2022-07-07T09%3A00%3A00Z&page=2&to=2022-07-10T18%3A00%3A00Z",
            HTTP_AUTHORIZATION=f"Bearer {jwt_token}",
        )

        self.assertEqual(response.status_code, 200)
        content = response.json()

        self.assertEqual(content["count"], 3)
        self.assertIsNone(content["next"])
        self.assertEqual(
            content["previous"],
            (
                "http://testserver/api/meetings/?"
                "from=2022-07-07T09%3A00%3A00Z&to=2022-07-10T18%3A00%3A00Z"
            ),
        )

        self.assertEqual(len(content["results"]), 1)
        meeting_ids.remove(content["results"][0]["id"])
        self.assertEqual(meeting_ids, [])

    def test_api_meetings_list_authenticated_distinct(self):
        """A meeting with several related users should only be listed once."""
        user = UserFactory()
        other_user = UserFactory()
        jwt_token = AccessToken.for_user(user)

        meeting = MeetingFactory(
            start=datetime(2022, 7, 7, 9, 0, tzinfo=ZoneInfo("UTC")),
            end=datetime(2022, 7, 7, 10, 0, tzinfo=ZoneInfo("UTC")),
            timezone=ZoneInfo("Europe/Paris"),
        )
        MeetingAccess.objects.create(meeting=meeting, user=user)
        MeetingAccess.objects.create(meeting=meeting, user=other_user)

        response = self.client.get(
            "/api/meetings/?from=2022-07-07T09:00:00Z&to=2022-07-10T18:00:00Z",
            HTTP_AUTHORIZATION=f"Bearer {jwt_token}",
        )

        self.assertEqual(response.status_code, 200)
        content = response.json()
        self.assertEqual(len(content["results"]), 1)
        self.assertEqual(content["results"][0]["id"], str(meeting.id))

    @mock.patch(
        "magnify.apps.core.serializers.meetings.generate_token",
        return_value="the token",
    )
    def test_api_meetings_list_authenticated_format(self, mock_token):
        """Check the format of the meeting object returned."""
        user = UserFactory()
        other_user = UserFactory()
        group = GroupFactory(members=[user])
        jwt_token = AccessToken.for_user(user)

        meeting = MeetingFactory(
            start=datetime(2022, 7, 7, 9, 0, tzinfo=ZoneInfo("UTC")),
            end=datetime(2022, 7, 7, 10, 0, tzinfo=ZoneInfo("UTC")),
            owner=random.choice([user, other_user]),
            timezone=ZoneInfo("Europe/Paris"),
        )
        access_user = MeetingAccess.objects.create(meeting=meeting, user=user)
        access_group = MeetingAccess.objects.create(meeting=meeting, group=group)

        response = self.client.get(
            "/api/meetings/?from=2022-07-07T09:00:00Z&to=2022-07-10T18:00:00Z",
            HTTP_AUTHORIZATION=f"Bearer {jwt_token}",
        )

        self.assertEqual(response.status_code, 200)
        content_dict = response.json()["results"]
        self.assertEqual(len(content_dict), 1)

        self.assertCountEqual(
            content_dict[0].pop("guests"),
            [
                {
                    "id": str(access_user.id),
                    "group": None,
                    "meeting": str(meeting.id),
                    "user": {
                        "id": str(user.id),
                        "email": user.email,
                        "language": user.language,
                        "name": user.name,
                        "username": user.username,
                    },
                },
                {
                    "id": str(access_group.id),
                    "group": {
                        "id": str(group.id),
                        "name": group.name,
                    },
                    "meeting": str(meeting.id),
                    "user": None,
                },
            ],
        )
        self.assertEqual(
            content_dict[0],
            {
                "id": str(meeting.id),
                "frequency": 1,
                "is_public": True,
                "monthly_type": "date_day",
                "name": meeting.name,
                "nb_occurrences": 1,
                "occurrences": {
                    "from": "2022-07-07T09:00:00Z",
                    "to": "2022-07-10T18:00:00Z",
                    "dates": ["2022-07-07T09:00:00Z"],
                },
                "owner": str(meeting.owner.id),
                "recurrence": None,
                "room": None,
                "start": "2022-07-07T09:00:00Z",
                "end": "2022-07-07T10:00:00Z",
                "recurring_until": "2022-07-07T09:00:00Z",
                "timezone": "Europe/Paris",
                "weekdays": "3",
                "jitsi": {
                    "meeting": str(meeting.id),
                    "token": "the token",
                },
            },
        )
        is_owner = user == meeting.owner
        mock_token.assert_called_once_with(user, str(meeting.id), is_admin=is_owner)

    def test_api_meetings_list_authenticated_filter_and_occurrences(self):
        """
        It should be possible to filter meetings by a datetime range. As a result, meetings
        occurrences can be listed in this range.
        """
        user = UserFactory()
        jwt_token = AccessToken.for_user(user)

        MeetingFactory(
            start=datetime(2022, 7, 7, 9, 0, tzinfo=ZoneInfo("UTC")),
            end=datetime(2022, 7, 7, 10, 0, tzinfo=ZoneInfo("UTC")),
            recurrence="daily",
            nb_occurrences=10,
            owner=user,
            timezone=ZoneInfo("Europe/Paris"),
        )
        # Should be filtered out
        MeetingFactory(
            start=datetime(2022, 7, 7, 8, 0, tzinfo=ZoneInfo("UTC")),
            end=datetime(2022, 7, 7, 8, 59, tzinfo=ZoneInfo("UTC")),
            owner=user,
            timezone=ZoneInfo("Europe/Paris"),
        )
        MeetingFactory(
            start=datetime(2022, 7, 10, 19, 0, tzinfo=ZoneInfo("UTC")),
            owner=user,
            timezone=ZoneInfo("Europe/Paris"),
        )

        response = self.client.get(
            "/api/meetings/?from=2022-07-07T09:00:00Z&to=2022-07-10T18:00:00Z",
            HTTP_AUTHORIZATION=f"Bearer {jwt_token}",
        )

        self.assertEqual(response.status_code, 200)
        content_dict = response.json()["results"]
        self.assertEqual(len(content_dict), 1)
        self.assertEqual(
            content_dict[0]["occurrences"],
            {
                "from": "2022-07-07T09:00:00Z",
                "to": "2022-07-10T18:00:00Z",
                "dates": [
                    "2022-07-07T09:00:00Z",
                    "2022-07-08T09:00:00Z",
                    "2022-07-09T09:00:00Z",
                    "2022-07-10T09:00:00Z",
                ],
            },
        )

    def test_api_meetings_list_authenticated_filter(self):
        """
        Make sure all meetings are excluded or included as expected depending on
        their start and end datetimes.
        """
        user = UserFactory()
        jwt_token = AccessToken.for_user(user)

        # Should be included
        meetings = [
            MeetingFactory(  # No recurrence, end datetime in range
                start=datetime(2022, 7, 7, 7, 0, tzinfo=ZoneInfo("UTC")),
                end=datetime(2022, 7, 7, 9, 0, tzinfo=ZoneInfo("UTC")),
                owner=user,
                timezone=ZoneInfo("Europe/Paris"),
            ),
            MeetingFactory(  # No recurrence, start datetime in range
                start=datetime(2022, 7, 10, 18, 0, tzinfo=ZoneInfo("UTC")),
                owner=user,
                timezone=ZoneInfo("Europe/Paris"),
            ),
            MeetingFactory(  # Daily recurrence, start datetime in range
                start=datetime(2022, 7, 10, 18, 0, tzinfo=ZoneInfo("UTC")),
                recurrence="daily",
                owner=user,
                timezone=ZoneInfo("Europe/Paris"),
            ),
            MeetingFactory(  # Daily recurrence, infinite recurrence
                start=datetime(2022, 7, 2, 9, 0, tzinfo=ZoneInfo("UTC")),
                recurrence="daily",
                recurring_until=None,
                owner=user,
                timezone=ZoneInfo("Europe/Paris"),
            ),
            MeetingFactory(  # Daily recurrence, recurrence until in range
                start=datetime(2022, 7, 2, 9, 0, tzinfo=ZoneInfo("UTC")),
                recurrence="daily",
                nb_occurrences=6,
                owner=user,
                timezone=ZoneInfo("Europe/Paris"),
            ),
        ]
        self.assertEqual(
            meetings[-1].recurring_until,
            datetime(2022, 7, 7, 9, 0, tzinfo=ZoneInfo("UTC")),
        )

        # Should be filtered out
        MeetingFactory(  # End datetime out of range
            start=datetime(2022, 7, 7, 6, 0, tzinfo=ZoneInfo("UTC")),
            end=datetime(2022, 7, 7, 8, 59, tzinfo=ZoneInfo("UTC")),
            owner=user,
            timezone=ZoneInfo("Europe/Paris"),
        )
        MeetingFactory(  # Start datetime out of range
            start=datetime(2022, 7, 10, 18, 1, tzinfo=ZoneInfo("UTC")),
            owner=user,
            timezone=ZoneInfo("Europe/Paris"),
        )
        MeetingFactory(  # Daily recurrence, start datetime out of range
            start=datetime(2022, 7, 10, 18, 1, tzinfo=ZoneInfo("UTC")),
            recurrence="daily",
            owner=user,
            timezone=ZoneInfo("Europe/Paris"),
        )
        drruoor = MeetingFactory(  # Daily recurrence, recurrence until out of range
            start=datetime(2022, 7, 2, 8, 59, tzinfo=ZoneInfo("UTC")),
            recurrence="daily",
            nb_occurrences=6,
            owner=user,
            timezone=ZoneInfo("Europe/Paris"),
        )
        self.assertEqual(
            drruoor.recurring_until, datetime(2022, 7, 7, 8, 59, tzinfo=ZoneInfo("UTC"))
        )

        response = self.client.get(
            "/api/meetings/?from=2022-07-07T09:00:00Z&to=2022-07-10T18:00:00Z",
            HTTP_AUTHORIZATION=f"Bearer {jwt_token}",
        )

        self.assertEqual(response.status_code, 200)
        results = response.json()["results"]
        self.assertEqual(len(results), 5)
        self.assertCountEqual(
            [result["id"] for result in results],
            [str(meeting.id) for meeting in meetings],
        )

    def test_api_meetings_list_authenticated_filter_required(self):
        """The "from" and "to" filters are required for list requests."""
        user = UserFactory()
        jwt_token = AccessToken.for_user(user)

        MeetingFactory(
            start=datetime(2022, 7, 7, 7, 0, tzinfo=ZoneInfo("UTC")),
            owner=user,
            timezone=ZoneInfo("Europe/Paris"),
        )

        response = self.client.get(
            "/api/meetings/",
            HTTP_AUTHORIZATION=f"Bearer {jwt_token}",
        )

        self.assertEqual(response.status_code, 400)
        self.assertEqual(
            response.json(),
            {
                "errors": {
                    "from": ["This field is required."],
                    "to": ["This field is required."],
                }
            },
        )

    def test_api_meetings_list_authenticated_filter_invalid(self):
        """The "from" and "to" filters should be valid datetimes."""
        user = UserFactory()
        jwt_token = AccessToken.for_user(user)

        MeetingFactory(
            start=datetime(2022, 7, 7, 7, 0, tzinfo=ZoneInfo("UTC")),
            owner=user,
            timezone=ZoneInfo("Europe/Paris"),
        )

        response = self.client.get(
            "/api/meetings/?from=2022-007-07T09:00:00Z&to=2022-07-10T180:00:00Z",
            HTTP_AUTHORIZATION=f"Bearer {jwt_token}",
        )

        self.assertEqual(response.status_code, 400)
        self.assertEqual(
            response.json(),
            {
                "errors": {
                    "from": ["Enter a valid date/time."],
                    "to": ["Enter a valid date/time."],
                }
            },
        )

    # Retrieve

    @mock.patch(
        "magnify.apps.core.serializers.meetings.generate_token",
        return_value="the token",
    )
    def test_api_meetings_retrieve_anonymous_public(self, mock_token):
        """
        Anonymous users should be able to retrieve a meeting with a token provided it is public.
        They should not see related users and groups.
        """
        meeting = MeetingFactory(
            is_public=True,
            start=datetime(2022, 7, 7, 9, 0, tzinfo=ZoneInfo("UTC")),
            end=datetime(2022, 7, 7, 10, 0, tzinfo=ZoneInfo("UTC")),
            users=[UserFactory()],
            groups=[GroupFactory()],
            timezone=ZoneInfo("Europe/Paris"),
        )
        response = self.client.get(f"/api/meetings/{meeting.id!s}/")

        self.assertEqual(response.status_code, 200)
        self.assertEqual(
            response.json(),
            {
                "id": str(meeting.id),
                "frequency": 1,
                "is_public": True,
                "monthly_type": "date_day",
                "name": meeting.name,
                "nb_occurrences": 1,
                "owner": str(meeting.owner.id),
                "recurrence": None,
                "room": None,
                "start": "2022-07-07T09:00:00Z",
                "end": "2022-07-07T10:00:00Z",
                "recurring_until": "2022-07-07T09:00:00Z",
                "timezone": "Europe/Paris",
                "weekdays": "3",
                "jitsi": {"meeting": str(meeting.id), "token": "the token"},
            },
        )
        mock_token.assert_called_once()

    def test_api_meetings_retrieve_anonymous_private(self):
        """
        Anonymous users should not be allowed to retrieve a private meeting.
        """
        meeting = MeetingFactory(is_public=False)

        response = self.client.get(f"/api/meetings/{meeting.id!s}/")

        self.assertEqual(response.status_code, 404)

    @mock.patch(
        "magnify.apps.core.serializers.meetings.generate_token",
        return_value="the token",
    )
    def test_api_meetings_retrieve_authenticated_public(self, mock_token):
        """
        Authenticated users should be allowed to retrieve and get a token for a meeting to
        which they are not related, provided the meeting is public.
        They should not see related users and groups.
        """
        meeting = MeetingFactory(
            is_public=True,
            start=datetime(2022, 7, 7, 9, 0, tzinfo=ZoneInfo("UTC")),
            end=datetime(2022, 7, 7, 10, 0, tzinfo=ZoneInfo("UTC")),
            timezone=ZoneInfo("Europe/Paris"),
            users=[UserFactory()],
        )

        user = UserFactory()
        jwt_token = AccessToken.for_user(user)

        response = self.client.get(
            f"/api/meetings/{meeting.id!s}/", HTTP_AUTHORIZATION=f"Bearer {jwt_token}"
        )
        self.assertEqual(response.status_code, 200)

        self.assertEqual(
            response.json(),
            {
                "id": str(meeting.id),
                "frequency": 1,
                "is_public": True,
                "monthly_type": "date_day",
                "name": meeting.name,
                "nb_occurrences": 1,
                "owner": str(meeting.owner.id),
                "recurrence": None,
                "room": None,
                "start": "2022-07-07T09:00:00Z",
                "end": "2022-07-07T10:00:00Z",
                "recurring_until": "2022-07-07T09:00:00Z",
                "timezone": "Europe/Paris",
                "weekdays": "3",
                "jitsi": {"meeting": str(meeting.id), "token": "the token"},
            },
        )

        mock_token.assert_called_once_with(user, str(meeting.id), is_admin=False)

    def test_api_meetings_retrieve_authenticated_private(self):
        """
        Authenticated users should not be able to retrieve a private meeting to which they
        are not related.
        """
        meeting = MeetingFactory(is_public=False)

        user = UserFactory()
        jwt_token = AccessToken.for_user(user)

        response = self.client.get(
            f"/api/meetings/{meeting.id!s}/", HTTP_AUTHORIZATION=f"Bearer {jwt_token}"
        )

        self.assertEqual(response.status_code, 404)

        self.assertEqual(
            response.json(),
            {"detail": "Not found."},
        )

    @mock.patch(
        "magnify.apps.core.serializers.meetings.generate_token",
        return_value="the token",
    )
    def test_api_meetings_retrieve_guests_direct(self, mock_token):
        """
        Users who are direct guests of a meeting should be allowed to see other guests.
        """
        user = UserFactory()
        jwt_token = AccessToken.for_user(user)

        meeting = MeetingFactory(
            is_public=True,
            start=datetime(2022, 7, 7, 9, 0, tzinfo=ZoneInfo("UTC")),
            end=datetime(2022, 7, 7, 10, 0, tzinfo=ZoneInfo("UTC")),
            timezone=ZoneInfo("Europe/Paris"),
        )
        other_user = UserFactory()
        group = GroupFactory()
        access_user = MeetingAccess.objects.create(meeting=meeting, user=user)
        access_other_user = MeetingAccess.objects.create(
            meeting=meeting, user=other_user
        )
        access_group = MeetingAccess.objects.create(meeting=meeting, group=group)

        with self.assertNumQueries(5):
            response = self.client.get(
                f"/api/meetings/{meeting.id!s}/",
                HTTP_AUTHORIZATION=f"Bearer {jwt_token}",
            )
        self.assertEqual(response.status_code, 200)
        content_dict = response.json()

        # Access objects order is uncertain and we don't care
        self.assertCountEqual(
            content_dict.pop("guests"),
            [
                {
                    "id": str(access_user.id),
                    "group": None,
                    "meeting": str(meeting.id),
                    "user": {
                        "id": str(user.id),
                        "email": user.email,
                        "language": user.language,
                        "name": user.name,
                        "username": user.username,
                    },
                },
                {
                    "id": str(access_other_user.id),
                    "group": None,
                    "meeting": str(meeting.id),
                    "user": {
                        "id": str(other_user.id),
                        "language": other_user.language,
                        "name": other_user.name,
                        "username": other_user.username,
                    },
                },
                {
                    "id": str(access_group.id),
                    "group": {
                        "id": str(group.id),
                        "name": group.name,
                    },
                    "meeting": str(meeting.id),
                    "user": None,
                },
            ],
        )
        self.assertEqual(
            content_dict,
            {
                "id": str(meeting.id),
                "frequency": 1,
                "is_public": True,
                "monthly_type": "date_day",
                "name": meeting.name,
                "nb_occurrences": 1,
                "owner": str(meeting.owner.id),
                "recurrence": None,
                "room": None,
                "start": "2022-07-07T09:00:00Z",
                "end": "2022-07-07T10:00:00Z",
                "recurring_until": "2022-07-07T09:00:00Z",
                "timezone": "Europe/Paris",
                "weekdays": "3",
                "jitsi": {"meeting": str(meeting.id), "token": "the token"},
            },
        )
        mock_token.assert_called_once_with(user, str(meeting.id), is_admin=False)

    @mock.patch(
        "magnify.apps.core.serializers.meetings.generate_token",
        return_value="the token",
    )
    def test_api_meetings_retrieve_guests_via_group(self, mock_token):
        """
        Users who are guests of a meeting via a group should be allowed to see other guests.
        """
        user = UserFactory()
        jwt_token = AccessToken.for_user(user)

        group = GroupFactory(members=[user])
        other_user = UserFactory()
        other_group = GroupFactory()

        meeting = MeetingFactory(
            is_public=True,
            start=datetime(2022, 7, 7, 9, 0, tzinfo=ZoneInfo("UTC")),
            end=datetime(2022, 7, 7, 10, 0, tzinfo=ZoneInfo("UTC")),
            timezone=ZoneInfo("Europe/Paris"),
        )
        access_group = MeetingAccess.objects.create(meeting=meeting, group=group)
        access_other_user = MeetingAccess.objects.create(
            meeting=meeting, user=other_user
        )
        access_other_group = MeetingAccess.objects.create(
            meeting=meeting, group=other_group
        )

        with self.assertNumQueries(5):
            response = self.client.get(
                f"/api/meetings/{meeting.id!s}/",
                HTTP_AUTHORIZATION=f"Bearer {jwt_token}",
            )
        self.assertEqual(response.status_code, 200)
        content_dict = response.json()

        # Access objects order is uncertain and we don't care
        self.assertCountEqual(
            content_dict.pop("guests"),
            [
                {
                    "id": str(access_other_user.id),
                    "group": None,
                    "meeting": str(meeting.id),
                    "user": {
                        "id": str(other_user.id),
                        "language": other_user.language,
                        "name": other_user.name,
                        "username": other_user.username,
                    },
                },
                {
                    "id": str(access_group.id),
                    "group": {
                        "id": str(group.id),
                        "name": group.name,
                    },
                    "meeting": str(meeting.id),
                    "user": None,
                },
                {
                    "id": str(access_other_group.id),
                    "group": {
                        "id": str(other_group.id),
                        "name": other_group.name,
                    },
                    "meeting": str(meeting.id),
                    "user": None,
                },
            ],
        )
        self.assertEqual(
            content_dict,
            {
                "id": str(meeting.id),
                "frequency": 1,
                "is_public": True,
                "monthly_type": "date_day",
                "name": meeting.name,
                "nb_occurrences": 1,
                "owner": str(meeting.owner.id),
                "recurrence": None,
                "room": None,
                "start": "2022-07-07T09:00:00Z",
                "end": "2022-07-07T10:00:00Z",
                "recurring_until": "2022-07-07T09:00:00Z",
                "timezone": "Europe/Paris",
                "weekdays": "3",
                "jitsi": {"meeting": str(meeting.id), "token": "the token"},
            },
        )
        mock_token.assert_called_once_with(user, str(meeting.id), is_admin=False)

    @mock.patch(
        "magnify.apps.core.serializers.meetings.generate_token",
        return_value="the token",
    )
    def test_api_meetings_retrieve_owner(self, mock_token):
        """A user should be able to retrieve a meeting beloging to him/her."""
        user = UserFactory()
        jwt_token = AccessToken.for_user(user)

        meeting = MeetingFactory(
            is_public=True,
            start=datetime(2022, 7, 7, 9, 0, tzinfo=ZoneInfo("UTC")),
            end=datetime(2022, 7, 7, 10, 0, tzinfo=ZoneInfo("UTC")),
            owner=user,
            timezone=ZoneInfo("Europe/Paris"),
        )
        other_user = UserFactory()
        access_other_user = MeetingAccess.objects.create(
            meeting=meeting, user=other_user
        )
        group = GroupFactory()
        access_group = MeetingAccess.objects.create(meeting=meeting, group=group)

        with self.assertNumQueries(4):
            response = self.client.get(
                f"/api/meetings/{meeting.id!s}/",
                HTTP_AUTHORIZATION=f"Bearer {jwt_token}",
            )
        self.assertEqual(response.status_code, 200)
        content_dict = response.json()

        # Access objects order is uncertain and we don't care
        self.assertCountEqual(
            content_dict.pop("guests"),
            [
                {
                    "id": str(access_other_user.id),
                    "group": None,
                    "meeting": str(meeting.id),
                    "user": {
                        "id": str(other_user.id),
                        "language": other_user.language,
                        "name": other_user.name,
                        "username": other_user.username,
                    },
                },
                {
                    "id": str(access_group.id),
                    "group": {
                        "id": str(group.id),
                        "name": group.name,
                    },
                    "meeting": str(meeting.id),
                    "user": None,
                },
            ],
        )
        self.assertEqual(
            content_dict,
            {
                "id": str(meeting.id),
                "frequency": 1,
                "is_public": True,
                "monthly_type": "date_day",
                "name": meeting.name,
                "nb_occurrences": 1,
                "owner": str(user.id),
                "recurrence": None,
                "room": None,
                "start": "2022-07-07T09:00:00Z",
                "end": "2022-07-07T10:00:00Z",
                "recurring_until": "2022-07-07T09:00:00Z",
                "timezone": "Europe/Paris",
                "weekdays": "3",
                "jitsi": {"meeting": str(meeting.id), "token": "the token"},
            },
        )
        mock_token.assert_called_once_with(user, str(meeting.id), is_admin=True)

    def test_api_meetings_retrieve_occurrences(self):
        """
        When retrieving a meeting detail, it should be possible to request occurrences
        via querystring parameters.
        """
        user = UserFactory()
        jwt_token = AccessToken.for_user(user)

        meeting = MeetingFactory(
            start=datetime(2022, 7, 7, 9, 0, tzinfo=ZoneInfo("UTC")),
            end=datetime(2022, 7, 7, 10, 0, tzinfo=ZoneInfo("UTC")),
            recurrence="daily",
            nb_occurrences=10,
            owner=user,
            timezone=ZoneInfo("Europe/Paris"),
        )

        response = self.client.get(
            f"/api/meetings/{meeting.id!s}/?from=2022-07-07T09:00:00Z&to=2022-07-10T18:00:00Z",
            HTTP_AUTHORIZATION=f"Bearer {jwt_token}",
        )

        self.assertEqual(response.status_code, 200)
        self.assertEqual(
            response.json()["occurrences"],
            {
                "from": "2022-07-07T09:00:00Z",
                "to": "2022-07-10T18:00:00Z",
                "dates": [
                    "2022-07-07T09:00:00Z",
                    "2022-07-08T09:00:00Z",
                    "2022-07-09T09:00:00Z",
                    "2022-07-10T09:00:00Z",
                ],
            },
        )

    # Create

    def test_api_meetings_create_anonymous(self):
        """Anonymous users should not be allowed to create meetings."""
        response = self.client.post(
            "/api/meetings/",
            {
                "name": "my meeting",
                "start": "2022-07-07T09:00:00Z",
                "end": "2022-07-07T10:00:00Z",
            },
        )

        self.assertEqual(response.status_code, 401)
        self.assertFalse(Meeting.objects.exists())

    def test_api_meetings_create_authenticated_success(self):
        """
        Authenticated users should be able to create meetings and should automatically be declared
        as owner of the newly created meeting.
        """
        user = UserFactory()
        self.assertFalse(user.timezone is None)
        jwt_token = AccessToken.for_user(user)

        response = self.client.post(
            "/api/meetings/",
            {
                "name": "my meeting",
                "start": "2022-07-07T09:00:00Z",
                "end": "2022-07-07T10:00:00Z",
            },
            HTTP_AUTHORIZATION=f"Bearer {jwt_token}",
        )

        self.assertEqual(response.status_code, 201)
        meeting = Meeting.objects.get()
        self.assertEqual(meeting.name, "my meeting")
        self.assertEqual(meeting.owner, user)
        self.assertEqual(meeting.timezone, user.timezone)
        self.assertEqual(
            meeting.start, datetime(2022, 7, 7, 9, 0, tzinfo=ZoneInfo("UTC"))
        )
        self.assertEqual(
            meeting.end, datetime(2022, 7, 7, 10, 0, tzinfo=ZoneInfo("UTC"))
        )

    def test_api_meetings_create_authenticated_force_owner(self):
        """The "owner" field should be forced to the ID of the logged-in user."""
        user = UserFactory()
        other_user = UserFactory()
        jwt_token = AccessToken.for_user(user)

        response = self.client.post(
            "/api/meetings/",
            {
                "name": "my meeting",
                "owner": str(other_user.id),
                "start": "2022-07-07T09:00:00Z",
                "end": "2022-07-07T10:00:00Z",
            },
            HTTP_AUTHORIZATION=f"Bearer {jwt_token}",
        )

        self.assertEqual(response.status_code, 201)
        meeting = Meeting.objects.get()
        self.assertEqual(meeting.owner, user)

    def test_api_meetings_create_authenticated_end_greater_than_start(self):
        """
        Trying to create a meeting with a start date later than the end date
        should raise a 400 error.
        """
        user = UserFactory()
        other_user = UserFactory()
        jwt_token = AccessToken.for_user(user)

        response = self.client.post(
            "/api/meetings/",
            {
                "name": "my meeting",
                "owner": str(other_user.id),
                "start": "2022-07-07T10:00:00Z",
                "end": "2022-07-07T09:00:00Z",
            },
            HTTP_AUTHORIZATION=f"Bearer {jwt_token}",
        )

        self.assertEqual(response.status_code, 400)
        self.assertEqual(
            response.json(),
            {"__all__": ["The start date must be earlier than the end date."]},
        )

    def test_api_meetings_create_authenticated_invalid_date(self):
        """Trying to create a meeting with invalid dates should raise a 400 error."""
        user = UserFactory()
        other_user = UserFactory()
        jwt_token = AccessToken.for_user(user)

        response = self.client.post(
            "/api/meetings/",
            {
                "name": "my meeting",
                "owner": str(other_user.id),
                "start": "2022-07-07T09:00:00Z",
                "end": "2022-07-07T010:00:00Z",
            },
            HTTP_AUTHORIZATION=f"Bearer {jwt_token}",
        )

        self.assertEqual(response.status_code, 400)
        self.assertEqual(
            response.json(),
            {
                "end": [
                    "Datetime has wrong format. Use one of these formats instead: "
                    "YYYY-MM-DDThh:mm[:ss[.uuuuuu]][+HH:MM|-HH:MM|Z]."
                ]
            },
        )

    # Update

    def test_api_meetings_update_anonymous(self):
        """Anonymous users should not be allowed to update a meeting."""
        meeting = MeetingFactory(name="Old name")

        response = self.client.put(
            f"/api/meetings/{meeting.id!s}/",
            {
                "name": "New name",
                "start": "2022-07-07T09:00:00Z",
                "end": "2022-07-07T10:00:00Z",
            },
        )
        self.assertEqual(response.status_code, 401)
        meeting.refresh_from_db()
        self.assertEqual(meeting.name, "Old name")

    def test_api_meetings_update_authenticated(self):
        """Authenticated users should not be allowed to update a meeting."""
        user = UserFactory()
        meeting = MeetingFactory(name="Old name")
        jwt_token = AccessToken.for_user(user)

        response = self.client.put(
            f"/api/meetings/{meeting.id!s}/",
            {
                "name": "New name",
                "start": "2022-07-07T09:00:00Z",
                "end": "2022-07-07T10:00:00Z",
            },
            HTTP_AUTHORIZATION=f"Bearer {jwt_token}",
        )
        self.assertEqual(response.status_code, 403)
        meeting.refresh_from_db()
        self.assertEqual(meeting.name, "Old name")

    def test_api_meetings_update_guests_direct(self):
        """
        Users who are direct guest of a meeting but not the owner should
        not be allowed to update it.
        """
        user = UserFactory()
        meeting = MeetingFactory(name="Old name", users=[user])
        jwt_token = AccessToken.for_user(user)

        new_is_public = not meeting.is_public
        response = self.client.put(
            f"/api/meetings/{meeting.id!s}/",
            {
                "name": "New name",
                "is_public": new_is_public,
                "start": "2022-07-07T09:00:00Z",
                "end": "2022-07-07T10:00:00Z",
            },
            format="json",
            HTTP_AUTHORIZATION=f"Bearer {jwt_token}",
        )
        self.assertEqual(response.status_code, 403)
        meeting.refresh_from_db()
        self.assertEqual(meeting.name, "Old name")
        self.assertEqual(meeting.is_public, not new_is_public)

    def test_api_meetings_update_guests_via_group(self):
        """
        User who are guests of a meeting via a group but not the owner should
        not be allowed to update it.
        """
        user = UserFactory()
        group = GroupFactory(members=[user])
        meeting = MeetingFactory(name="Old name", groups=[group])
        jwt_token = AccessToken.for_user(user)

        new_is_public = not meeting.is_public
        response = self.client.put(
            f"/api/meetings/{meeting.id!s}/",
            {
                "name": "New name",
                "is_public": new_is_public,
                "start": "2022-07-07T09:00:00Z",
                "end": "2022-07-07T10:00:00Z",
            },
            format="json",
            HTTP_AUTHORIZATION=f"Bearer {jwt_token}",
        )
        self.assertEqual(response.status_code, 403)
        meeting.refresh_from_db()
        self.assertEqual(meeting.name, "Old name")
        self.assertEqual(meeting.is_public, not new_is_public)

    def test_api_meetings_update_owners_success(self):
        """Owners of a meeting should be able to update it."""
        user, other_user = UserFactory.create_batch(2)
        meeting = MeetingFactory(
            name="Old name",
            owner=user,
            timezone=ZoneInfo("Europe/Paris"),
        )
        old_id = meeting.id
        room = RoomFactory()
        jwt_token = AccessToken.for_user(user)

        new_is_public = not meeting.is_public
        response = self.client.put(
            f"/api/meetings/{meeting.id!s}/",
            {
                "id": "412c9d36-d97e-448c-b849-c8386ea56aa2",
                "frequency": 3,
                "is_public": new_is_public,
                "name": "New name",
                "owner": str(other_user.id),
                "recurrence": "weekly",
                "room": str(room.id),
                "start": "2022-08-08T08:08:00Z",
                "end": "2022-09-09T09:09:00Z",
                "recurring_until": "2022-12-31T23:59:00Z",
                "timezone": "America/Toronto",
                "weekdays": "0",
            },
            format="json",
            HTTP_AUTHORIZATION=f"Bearer {jwt_token}",
        )
        self.assertEqual(response.status_code, 200)
        meeting.refresh_from_db()

        # Writable fields should be updated
        self.assertEqual(meeting.frequency, 3)
        self.assertEqual(meeting.is_public, new_is_public)
        self.assertEqual(meeting.name, "New name")
        self.assertEqual(meeting.nb_occurrences, 7)
        self.assertEqual(meeting.recurrence, "weekly")
        self.assertEqual(meeting.room, room)
        self.assertEqual(
            meeting.start, datetime(2022, 8, 8, 8, 8, 0, tzinfo=ZoneInfo("UTC"))
        )
        self.assertEqual(
            meeting.end, datetime(2022, 9, 9, 9, 9, 0, tzinfo=ZoneInfo("UTC"))
        )
        # DST is active at the end of recurrence
        self.assertEqual(
            meeting.recurring_until,
            datetime(2022, 12, 12, 9, 8, 0, tzinfo=ZoneInfo("UTC")),
        )
        self.assertEqual(meeting.timezone, ZoneInfo("America/Toronto"))
        self.assertEqual(meeting.weekdays, "0")

        # Readonly fields should not be modified
        self.assertEqual(meeting.id, old_id)
        self.assertEqual(meeting.owner, user)

    def test_api_meetings_update_owners_weekdays(self):
        """Weekdays should contain the start date or get an error."""
        user = UserFactory()
        meeting = MeetingFactory(
            owner=user, recurrence="weekly", timezone=ZoneInfo("Europe/Paris")
        )
        jwt_token = AccessToken.for_user(user)

        response = self.client.put(
            f"/api/meetings/{meeting.id!s}/",
            {
                "name": "New name",
                "recurrence": "weekly",
                "start": "2022-08-08T08:08:00Z",
                "end": "2022-09-09T09:09:00Z",
                "weekdays": "5",  # Incoherent weekday
            },
            format="json",
            HTTP_AUTHORIZATION=f"Bearer {jwt_token}",
        )

        self.assertEqual(response.status_code, 400)
        self.assertEqual(
            response.json(), {"weekdays": ["Weekdays should contain the start date."]}
        )

    def test_api_meetings_update_owners_of_another(self):
        """
        Being owner of a meeting should not grant authorization to update another meeting.
        """
        user = UserFactory()
        jwt_token = AccessToken.for_user(user)

        MeetingFactory(owner=user)
        other_meeting = MeetingFactory(name="Old name")

        response = self.client.put(
            f"/api/meetings/{other_meeting.id!s}/",
            {
                "name": "New name",
                "start": "2022-07-07T09:00:00Z",
                "end": "2022-07-07T10:00:00Z",
            },
            HTTP_AUTHORIZATION=f"Bearer {jwt_token}",
        )
        self.assertEqual(response.status_code, 403)
        other_meeting.refresh_from_db()
        self.assertEqual(other_meeting.name, "Old name")

    # Delete

    def test_api_meetings_delete_anonymous(self):
        """Anonymous users should not be allowed to destroy a meeting."""
        meeting = MeetingFactory()

        response = self.client.delete(
            f"/api/meetings/{meeting.id!s}/",
        )

        self.assertEqual(response.status_code, 401)
        self.assertEqual(Meeting.objects.count(), 1)

    def test_api_meetings_delete_authenticated_public(self):
        """
        Authenticated users should not be allowed to delete a public meeting that doesn't
        belong to them.
        """
        meeting = MeetingFactory(is_public=True)
        user = UserFactory()
        jwt_token = AccessToken.for_user(user)

        response = self.client.delete(
            f"/api/meetings/{meeting.id!s}/", HTTP_AUTHORIZATION=f"Bearer {jwt_token}"
        )

        self.assertEqual(response.status_code, 403)
        self.assertEqual(Meeting.objects.count(), 1)

    def test_api_meetings_delete_authenticated_private(self):
        """
        Authenticated users should not be able to delete a private meeting
        that doesn't belong to them.
        """
        meeting = MeetingFactory(is_public=False)
        user = UserFactory()
        jwt_token = AccessToken.for_user(user)

        response = self.client.delete(
            f"/api/meetings/{meeting.id!s}/", HTTP_AUTHORIZATION=f"Bearer {jwt_token}"
        )

        self.assertEqual(response.status_code, 404)
        self.assertEqual(Meeting.objects.count(), 1)

    def test_api_meetings_delete_guest_direct(self):
        """
        Authenticated users should not be allowed to delete a meeting for which they are
        only a direct guest.
        """
        user = UserFactory()
        meeting = MeetingFactory(users=[user])
        jwt_token = AccessToken.for_user(user)

        response = self.client.delete(
            f"/api/meetings/{meeting.id}/", HTTP_AUTHORIZATION=f"Bearer {jwt_token}"
        )

        self.assertEqual(response.status_code, 403)
        self.assertEqual(Meeting.objects.count(), 1)

    def test_api_meetings_delete_guests_via_group(self):
        """
        Authenticated users should not be allowed to delete a meeting for which they are
        only a guest via a group.
        """
        user = UserFactory()
        group = random.choice(
            [GroupFactory(members=[user]), GroupFactory(administrators=[user])]
        )
        meeting = MeetingFactory(groups=[group])
        jwt_token = AccessToken.for_user(user)

        response = self.client.delete(
            f"/api/meetings/{meeting.id!s}/", HTTP_AUTHORIZATION=f"Bearer {jwt_token}"
        )

        self.assertEqual(response.status_code, 403)
        self.assertEqual(Meeting.objects.count(), 1)

    def test_api_meetings_delete_owners(self):
        """
        Authenticated users should be able to delete a meeting that belongs to them.
        """
        user = UserFactory()
        meeting = MeetingFactory(owner=user)
        jwt_token = AccessToken.for_user(user)

        response = self.client.delete(
            f"/api/meetings/{meeting.id}/", HTTP_AUTHORIZATION=f"Bearer {jwt_token}"
        )

        self.assertEqual(response.status_code, 204)
        self.assertFalse(Meeting.objects.exists())
