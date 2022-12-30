"""
Tests for room meetings API endpoint in Magnify's core app.
"""
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


@mock.patch(
    "magnify.apps.core.serializers.meetings.generate_token", return_value="the token"
)
class RoomMeetingsApiTestCase(APITestCase):
    """Test requests on magnify's coreapp room meeting API endpoint."""

    # Anonymous

    def test_api_room_meetings_anonymous_private(self, _mock_token):
        """Anonymous users should not be allowed to list meetings in a room that is not public."""
        room = RoomFactory(is_public=False)
        MeetingFactory(room=room, is_public=False)
        MeetingFactory(room=room, is_public=True)

        response = self.client.get(f"/api/rooms/{room.id!s}/meetings/")
        self.assertEqual(response.status_code, 401)
        self.assertEqual(
            response.json(), {"detail": "Authentication credentials were not provided."}
        )

    def test_api_room_meetings_anonymous_public(self, mock_token):
        """Anonymous users should only be allowed to list public meetings in a public room."""
        start = datetime(2022, 7, 7, 9, 0, tzinfo=ZoneInfo("UTC"))
        room = RoomFactory(is_public=True)
        MeetingFactory(room=room, is_public=False, start=start)
        meeting = MeetingFactory(room=room, is_public=True, start=start)

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
                "groups": [],
                "is_public": True,
                "jitsi": {
                    "room": f"{meeting.room.slug:s}-{meeting.id!s}",
                    "token": "the token",
                },
                "labels": [],
                "monthly_type": "date_day",
                "name": meeting.name,
                "nb_occurrences": 1,
                "occurrences": {
                    "from": "2022-07-07T09:00:00Z",
                    "to": "2022-07-13T18:00:00Z",
                    "dates": ["2022-07-07T09:00:00Z"],
                },
                "recurrence": None,
                "room": str(room.id),
                "start": "2022-07-07T09:00:00Z",
                "end": meeting.end.isoformat().replace("+00:00", "Z"),
                "recurring_until": meeting.start.isoformat().replace("+00:00", "Z"),
                "users": [],
                "weekdays": str(meeting.start.weekday()),
            },
        )
        mock_token.assert_called_once()

    def test_api_room_meetings_anonymous_public_filter_valid(self, mock_token):
        """Anonymous users should be able to request a date range for recurring meetings."""
        room = RoomFactory(is_public=True)
        MeetingFactory(
            room=room,
            is_public=True,
            start=datetime(2022, 7, 7, 9, 0, tzinfo=ZoneInfo("UTC")),
            recurrence="daily",
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
        room = RoomFactory(is_public=True)
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

    # Authenticated

    def test_api_room_meetings_authenticated_private(self, _mock_token):
        """
        Authenticated users should not be allowed to list meetings in a room that is not public.
        """
        room = RoomFactory(is_public=False)
        MeetingFactory(room=room, is_public=False)
        MeetingFactory(room=room, is_public=True)

        user = UserFactory()
        jwt_token = AccessToken.for_user(user)

        response = self.client.get(
            f"/api/rooms/{room.id!s}/meetings/",
            HTTP_AUTHORIZATION=f"Bearer {jwt_token}",
        )
        self.assertEqual(response.status_code, 403)
        self.assertEqual(
            response.json(),
            {"detail": "You do not have permission to perform this action."},
        )

    def test_api_room_meetings_authenticated_access(self, mock_token):
        """
        Authenticated users should only be allowed to list public meetings and meetings to
        which they are related in a public room.
        """
        user = UserFactory()
        group = GroupFactory(members=[user])
        jwt_token = AccessToken.for_user(user)

        start = datetime(2022, 7, 7, 9, 0, tzinfo=ZoneInfo("UTC"))
        room = RoomFactory(is_public=True)
        MeetingFactory(room=room, is_public=False, start=start)
        meeting_public = MeetingFactory(room=room, is_public=True, start=start)
        meeting_users = MeetingFactory(room=room, start=start, users=[user])
        meeting_groups = MeetingFactory(room=room, start=start, groups=[group])

        response = self.client.get(
            f"/api/rooms/{room.id!s}/meetings/?"
            "from=2022-07-7T09:00:00Z&to=2022-07-13T18:00:00Z",
            HTTP_AUTHORIZATION=f"Bearer {jwt_token}",
        )
        self.assertEqual(response.status_code, 200)

        results = response.json()
        self.assertEqual(len(results), 3)
        self.assertEqual(
            {r["id"] for r in results},
            {str(meeting_public.id), str(meeting_users.id), str(meeting_groups.id)},
        )
        self.assertEqual(mock_token.call_count, 3)

    def test_api_room_meetings_authenticated_filter_valid(self, mock_token):
        """Authenticated users should be able to request a date range for recurring meetings."""
        user = UserFactory()
        jwt_token = AccessToken.for_user(user)

        room = RoomFactory(is_public=True)
        MeetingFactory(
            room=room,
            users=[user],
            start=datetime(2022, 7, 7, 9, 0, tzinfo=ZoneInfo("UTC")),
            recurrence="daily",
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
