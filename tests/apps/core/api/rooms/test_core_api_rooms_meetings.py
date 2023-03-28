"""
Tests for room meetings API endpoint in Magnify's core app.
"""
import random
from datetime import datetime
from unittest import mock
from zoneinfo import ZoneInfo

from rest_framework.test import APITestCase
from rest_framework_simplejwt.tokens import AccessToken

from magnify.apps.core.factories import (
    GroupFactory,
    MeetingFactory,
    RoomFactory,
    UserFactory,
)
from magnify.apps.core.models import MeetingAccess


@mock.patch(
    "magnify.apps.core.serializers.meetings.generate_token", return_value="the token"
)
class MeetingsRoomsApiTestCase(APITestCase):
    """Test requests on magnify's coreapp room meeting API endpoint."""

    # Anonymous

    def test_api_room_meetings_anonymous_private(self, mock_token):
        """
        Anonymous users should be allowed to list meetings that are explicitly public
        even if they don't have access to the room.
        """
        room = RoomFactory(is_public=False)
        start = datetime(2022, 7, 7, 9, 0, tzinfo=ZoneInfo("UTC"))
        MeetingFactory(room=room, start=start, is_public=False)
        meeting = MeetingFactory(room=room, start=start, is_public=True)

        response = self.client.get(
            f"/api/rooms/{room.id!s}/meetings/?"
            "from=2022-07-7T09:00:00Z&to=2022-07-13T18:00:00Z",
        )

        self.assertEqual(response.status_code, 200)
        results = response.json()
        self.assertEqual(len(results), 1)
        self.assertEqual(results[0]["id"], str(meeting.id))
        self.assertEqual(mock_token.call_count, 1)

    def test_api_room_meetings_anonymous_public(self, mock_token):
        """
        Anonymous users should be allowed to list meetings in a public room unless they
        are explicitly marked private.
        """
        start = datetime(2022, 7, 7, 9, 0, tzinfo=ZoneInfo("UTC"))
        room = RoomFactory(is_public=True)
        MeetingFactory(room=room, start=start, is_public=False)
        meeting = MeetingFactory(room=room, start=start, is_public=True)

        response = self.client.get(
            f"/api/rooms/{room.id!s}/meetings/?"
            "from=2022-07-07T09:00:00Z&to=2022-07-13T18:00:00Z"
        )
        self.assertEqual(response.status_code, 200)

        results = response.json()
        self.assertEqual(len(results), 1)
        self.assertEqual(
            results[0]["id"],
            str(meeting.id),
        )
        self.assertEqual(mock_token.call_count, 1)

    def test_api_room_meetings_anonymous_public_filter_valid(self, mock_token):
        """Anonymous users should be able to request a date range for recurring meetings."""
        room = RoomFactory()
        MeetingFactory(
            room=room,
            recurrence="daily",
            is_public=True,
            start=datetime(2022, 7, 7, 9, 0, tzinfo=ZoneInfo("UTC")),
        )

        response = self.client.get(
            f"/api/rooms/{room.id!s}/meetings/?"
            "from=2022-07-10T09:00:00Z&to=2022-07-13T18:00:00Z"
        )
        self.assertEqual(response.status_code, 200)

        results = response.json()
        self.assertEqual(len(results), 1)

        self.assertEqual(
            results[0]["occurrences"],
            {
                "from": "2022-07-10T09:00:00Z",
                "to": "2022-07-13T18:00:00Z",
                "dates": [
                    "2022-07-10T09:00:00Z",
                    "2022-07-11T09:00:00Z",
                    "2022-07-12T09:00:00Z",
                    "2022-07-13T09:00:00Z",
                ],
            },
        )
        mock_token.assert_called_once()

    def test_api_room_meetings_anonymous_public_filter_invalid(self, _mock_token):
        """Passing invalid dates as filtering parameters should receive a 400 error."""
        room = RoomFactory()
        MeetingFactory(room=room, is_public=True)

        response = self.client.get(
            f"/api/rooms/{room.id!s}/meetings/?from=invalid&to=22-07-13"
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

    def test_api_room_meetings_anonymous_format(self, mock_token):
        """
        Anonymous users should be allowed to list meetings in a public room unless they
        are explicitly marked private.
        They should not see related users and groups.
        """
        start = datetime(2022, 7, 8, 9, 0, tzinfo=ZoneInfo("UTC"))
        room = RoomFactory()
        user = UserFactory()
        group = GroupFactory()
        meeting = MeetingFactory(
            room=room,
            start=start,
            is_public=True,
            timezone=ZoneInfo("Europe/Paris"),
        )
        MeetingAccess.objects.create(meeting=meeting, user=user)
        MeetingAccess.objects.create(meeting=meeting, group=group)

        response = self.client.get(
            f"/api/rooms/{room.id!s}/meetings/?"
            "from=2022-07-07T09:00:00Z&to=2022-07-13T18:00:00Z"
        )
        self.assertEqual(response.status_code, 200)

        results = response.json()
        self.assertEqual(len(results), 1)

        self.assertEqual(
            results[0],
            {
                "id": str(meeting.id),
                "frequency": 1,
                "is_public": True,
                "jitsi": {
                    "meeting": meeting.jitsi_name,
                    "token": "the token",
                },
                "monthly_type": "date_day",
                "name": meeting.name,
                "nb_occurrences": 1,
                "occurrences": {
                    "from": "2022-07-07T09:00:00Z",
                    "to": "2022-07-13T18:00:00Z",
                    "dates": ["2022-07-08T09:00:00Z"],
                },
                "owner": str(meeting.owner.id),
                "recurrence": None,
                "room": str(room.id),
                "start": "2022-07-08T09:00:00Z",
                "end": meeting.end.isoformat().replace("+00:00", "Z"),
                "recurring_until": "2022-07-08T09:00:00Z",
                "timezone": "Europe/Paris",
                "weekdays": str(meeting.start.weekday()),
            },
        )
        mock_token.assert_called_once()

    # Authenticated

    def test_api_room_meetings_authenticated_public(self, mock_token):
        """
        Authenticated users listing meetings for a public room.
        They should be allowed to list meetings that are explicitly public or to which they
        are related or that belong to them. On the contrary, they should not be allowed to
        list meetings to which they don't have access.
        """
        user = UserFactory()
        group = GroupFactory(members=[user])
        jwt_token = AccessToken.for_user(user)

        room = RoomFactory(is_public=True)

        start = datetime(2022, 7, 7, 9, 0, tzinfo=ZoneInfo("UTC"))
        MeetingFactory(start=start, room=room, is_public=False)
        meetings = [
            MeetingFactory(start=start, room=room, is_public=False, owner=user),
            MeetingFactory(start=start, room=room, is_public=True),
            MeetingFactory(
                start=start,
                room=room,
                is_public=False,
                users=[user],
            ),
            MeetingFactory(
                start=start,
                room=room,
                is_public=False,
                groups=[group],
            ),
        ]

        response = self.client.get(
            f"/api/rooms/{room.id!s}/meetings/?"
            "from=2022-07-7T09:00:00Z&to=2022-07-13T18:00:00Z",
            HTTP_AUTHORIZATION=f"Bearer {jwt_token}",
        )

        self.assertEqual(response.status_code, 200)
        results = response.json()
        self.assertEqual(len(results), 4)
        self.assertEqual(
            {result["id"] for result in results},
            {str(meeting.id) for meeting in meetings},
        )
        self.assertEqual(mock_token.call_count, 4)

    def test_api_room_meetings_authenticated_private(self, mock_token):
        """
        Authenticated users listing meetings for a private room.

        They should be allowed to list meetings that are explicitly public or to which they are
        related even if they don't have access to the related room.
        """
        user = UserFactory()
        group = random.choice(
            [GroupFactory(members=[user]), GroupFactory(administrators=[user])]
        )
        jwt_token = AccessToken.for_user(user)

        room = RoomFactory(is_public=False)

        start = datetime(2022, 7, 7, 9, 0, tzinfo=ZoneInfo("UTC"))
        MeetingFactory(start=start, room=room, is_public=False)
        meetings = [
            MeetingFactory(start=start, room=room, is_public=True),
            MeetingFactory(
                start=start,
                room=room,
                is_public=False,
                users=[user],
            ),
            MeetingFactory(
                start=start,
                room=room,
                is_public=False,
                groups=[group],
            ),
        ]

        response = self.client.get(
            f"/api/rooms/{room.id!s}/meetings/?"
            "from=2022-07-7T09:00:00Z&to=2022-07-13T18:00:00Z",
            HTTP_AUTHORIZATION=f"Bearer {jwt_token}",
        )

        self.assertEqual(response.status_code, 200)
        results = response.json()
        self.assertEqual(len(results), 3)
        self.assertEqual(
            {result["id"] for result in results},
            {str(meeting.id) for meeting in meetings},
        )
        self.assertEqual(mock_token.call_count, 3)

    def test_api_room_meetings_authenticated_users(self, mock_token):
        """
        Authenticated users listing meetings for a private room to which they have direct access.

        They should be allowed to list meetings that are explicitly public or to which they are
        related even if they don't have access to the related room.
        On the contrary, they should not be allowed to list meetings to which they don't have
        access even if they have access to the related room.
        """
        user = UserFactory()
        group = random.choice(
            [GroupFactory(members=[user]), GroupFactory(administrators=[user])]
        )
        jwt_token = AccessToken.for_user(user)

        room = RoomFactory(is_public=False, users=[user])

        start = datetime(2022, 7, 7, 9, 0, tzinfo=ZoneInfo("UTC"))

        MeetingFactory(start=start, room=room, is_public=False)
        meetings = [
            MeetingFactory(start=start, room=room, is_public=True),
            MeetingFactory(
                start=start,
                room=room,
                is_public=False,
                users=[user],
            ),
            MeetingFactory(
                start=start,
                room=room,
                is_public=False,
                groups=[group],
            ),
        ]

        response = self.client.get(
            f"/api/rooms/{room.id!s}/meetings/?"
            "from=2022-07-7T09:00:00Z&to=2022-07-13T18:00:00Z",
            HTTP_AUTHORIZATION=f"Bearer {jwt_token}",
        )

        self.assertEqual(response.status_code, 200)
        results = response.json()
        self.assertEqual(len(results), 3)
        self.assertEqual(
            {result["id"] for result in results},
            {str(meeting.id) for meeting in meetings},
        )
        self.assertEqual(mock_token.call_count, 3)

    def test_api_room_meetings_authenticated_groups(self, mock_token):
        """
        Authenticated users listing meetings for a private room to which they have access
        via a group.

        They should be allowed to list meetings that are explicitly public or to which
        they are related even if they don't have access to the related room.
        On the contrary, they should not be allowed to list meetings to which they don't
        have access even if they have access to the related room.
        """
        user = UserFactory()
        group = random.choice(
            [GroupFactory(members=[user]), GroupFactory(administrators=[user])]
        )
        jwt_token = AccessToken.for_user(user)

        room = RoomFactory(is_public=False, groups=[group])

        start = datetime(2022, 7, 7, 9, 0, tzinfo=ZoneInfo("UTC"))
        MeetingFactory(start=start, room=room, is_public=False)
        meetings = [
            MeetingFactory(start=start, room=room, is_public=True),
            MeetingFactory(
                start=start,
                room=room,
                is_public=False,
                users=[user],
            ),
            MeetingFactory(
                start=start,
                room=room,
                is_public=False,
                groups=[group],
            ),
        ]

        response = self.client.get(
            f"/api/rooms/{room.id!s}/meetings/?"
            "from=2022-07-7T09:00:00Z&to=2022-07-13T18:00:00Z",
            HTTP_AUTHORIZATION=f"Bearer {jwt_token}",
        )

        self.assertEqual(response.status_code, 200)
        results = response.json()
        self.assertEqual(len(results), 3)
        self.assertEqual(
            {result["id"] for result in results},
            {str(meeting.id) for meeting in meetings},
        )
        self.assertEqual(mock_token.call_count, 3)

    def test_api_room_meetings_authenticated_filter_valid(self, mock_token):
        """Authenticated users should be able to request a date range for recurring meetings."""
        user = UserFactory()
        jwt_token = AccessToken.for_user(user)

        room = RoomFactory()
        MeetingFactory(
            room=room,
            recurrence="daily",
            is_public=True,
            start=datetime(2022, 7, 7, 9, 0, tzinfo=ZoneInfo("UTC")),
        )

        response = self.client.get(
            f"/api/rooms/{room.id!s}/meetings/?"
            "from=2022-07-10T09:00:00Z&to=2022-07-13T18:00:00Z",
            HTTP_AUTHORIZATION=f"Bearer {jwt_token}",
        )
        self.assertEqual(response.status_code, 200)

        results = response.json()
        self.assertEqual(len(results), 1)

        self.assertEqual(
            results[0]["occurrences"],
            {
                "from": "2022-07-10T09:00:00Z",
                "to": "2022-07-13T18:00:00Z",
                "dates": [
                    "2022-07-10T09:00:00Z",
                    "2022-07-11T09:00:00Z",
                    "2022-07-12T09:00:00Z",
                    "2022-07-13T09:00:00Z",
                ],
            },
        )
        mock_token.assert_called_once()
