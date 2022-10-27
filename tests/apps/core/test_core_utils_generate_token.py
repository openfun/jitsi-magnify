"""
Test suite for redirection to jitsi
"""
import datetime
import random
from unittest import mock

from django.conf import settings
from django.contrib.auth.models import AnonymousUser
from django.test import TestCase
from django.test.utils import override_settings
from django.utils import timezone

import jwt

from magnify.apps.core.factories import UserFactory
from magnify.apps.core.utils import generate_token


@override_settings(
    JWT_CONFIGURATION={
        "jitsi_secret_key": "ThisIsAnExampleKeyForDevPurposeOnly",
        "token_expiration_seconds": 600,
        "jitsi_app_id": "app_id",
        "jitsi_domain": "meet.jit.si",
        "jitsi_xmpp_domain": "meet.jitsi",
        "guest_username": "guest",
        "guest_avatar": "avatar.jpg",
    }
)
class TokenUtilsTestCase(TestCase):
    """Test suite for utils related to the JWT token."""

    def test_utils_generate_token_anonymous(self):
        """Generate a JWT token for a guest."""
        now = datetime.datetime(2030, 6, 15, tzinfo=datetime.timezone.utc)

        # Test token with a fix admin status
        with mock.patch.object(timezone, "now", return_value=now):
            token = generate_token(AnonymousUser(), "my-room", is_admin=True)

        self.assertEqual(
            token,
            (
                "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJleHAiOjE5MDc3MTI2MDAsImlhdCI6MTkwNzcxMjA"
                "wMCwibW9kZXJhdG9yIjp0cnVlLCJhdWQiOiJqaXRzaSIsImlzcyI6ImFwcF9pZCIsInN1YiI6Im1lZXQ"
                "uaml0c2kiLCJyb29tIjoibXktcm9vbSIsImNvbnRleHQiOnsidXNlciI6eyJhdmF0YXIiOiJhdmF0YXI"
                "uanBnIiwibmFtZSI6Imd1ZXN0IiwiZW1haWwiOiIifX19.yzGbUJywsVqL0WAbzslIoUovLuAKeLBqXs"
                "N3h0sPaMo"
            ),
        )

        # Test payload with a random admin status
        is_admin = random.choice([True, False])  # nosec
        with mock.patch.object(timezone, "now", return_value=now):
            token = generate_token(AnonymousUser(), "my-room", is_admin=is_admin)

        payload = jwt.decode(
            token,
            settings.JWT_CONFIGURATION["jitsi_secret_key"],
            audience="jitsi",
            algorithms=["HS256"],
        )
        self.assertEqual(
            payload,
            {
                "exp": 1907712600,
                "iat": 1907712000,
                "moderator": is_admin,
                "aud": "jitsi",
                "iss": "app_id",
                "sub": "meet.jitsi",
                "room": "my-room",
                "context": {
                    "user": {"avatar": "avatar.jpg", "name": "guest", "email": ""}
                },
            },
        )

    def test_utils_generate_token_authenticated(self):
        """Generate a token for a quidam user."""
        user = UserFactory(username="mickael", email="mickael@example.com")
        now = datetime.datetime(2030, 6, 15, tzinfo=datetime.timezone.utc)

        # Test token with a fix admin status
        with mock.patch.object(timezone, "now", return_value=now):
            token = generate_token(user, "my-room", is_admin=True)

        self.assertEqual(
            token,
            (
                "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJleHAiOjE5MDc3MTI2MDAsImlhdCI6MTkwNzcxMjA"
                "wMCwibW9kZXJhdG9yIjp0cnVlLCJhdWQiOiJqaXRzaSIsImlzcyI6ImFwcF9pZCIsInN1YiI6Im1lZXQ"
                "uaml0c2kiLCJyb29tIjoibXktcm9vbSIsImNvbnRleHQiOnsidXNlciI6eyJhdmF0YXIiOiJhdmF0YXI"
                "uanBnIiwibmFtZSI6Im1pY2thZWwiLCJlbWFpbCI6Im1pY2thZWxAZXhhbXBsZS5jb20ifX19.sU6tEi"
                "0SKOAheTcS4BCXMhYz1ntiTvKi1uAAiuPNP3k"
            ),
        )

        # Test payload with a random admin status
        is_admin = random.choice([True, False])  # nosec
        with mock.patch.object(timezone, "now", return_value=now):
            token = generate_token(user, "my-room", is_admin=is_admin)

        payload = jwt.decode(
            token,
            settings.JWT_CONFIGURATION["jitsi_secret_key"],
            audience="jitsi",
            algorithms=["HS256"],
        )
        self.assertEqual(
            payload,
            {
                "exp": 1907712600,
                "iat": 1907712000,
                "moderator": is_admin,
                "aud": "jitsi",
                "iss": "app_id",
                "sub": "meet.jitsi",
                "room": "my-room",
                "context": {
                    "user": {
                        "avatar": "avatar.jpg",
                        "name": "mickael",
                        "email": "mickael@example.com",
                    }
                },
            },
        )

    def test_utils_generate_token_staff(self):
        """Generate a token for a staff user."""
        user = UserFactory(
            username="mickael", email="mickael@example.com", is_staff=True
        )
        now = datetime.datetime(2030, 6, 15, tzinfo=datetime.timezone.utc)
        is_admin = random.choice([True, False])  # nosec

        with mock.patch.object(timezone, "now", return_value=now):
            token = generate_token(user, "my-room", is_admin=is_admin)

        self.assertEqual(
            token,
            (
                "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJleHAiOjE5MDc3MTI2MDAsImlhdCI6MTkwNzcxMjA"
                "wMCwibW9kZXJhdG9yIjp0cnVlLCJhdWQiOiJqaXRzaSIsImlzcyI6ImFwcF9pZCIsInN1YiI6Im1lZXQ"
                "uaml0c2kiLCJyb29tIjoibXktcm9vbSIsImNvbnRleHQiOnsidXNlciI6eyJhdmF0YXIiOiJhdmF0YXI"
                "uanBnIiwibmFtZSI6Im1pY2thZWwiLCJlbWFpbCI6Im1pY2thZWxAZXhhbXBsZS5jb20ifX19.sU6tEi"
                "0SKOAheTcS4BCXMhYz1ntiTvKi1uAAiuPNP3k"
            ),
        )

        payload = jwt.decode(
            token,
            settings.JWT_CONFIGURATION["jitsi_secret_key"],
            audience="jitsi",
            algorithms=["HS256"],
        )
        self.assertEqual(
            payload,
            {
                "exp": 1907712600,
                "iat": 1907712000,
                "moderator": True,
                "aud": "jitsi",
                "iss": "app_id",
                "sub": "meet.jitsi",
                "room": "my-room",
                "context": {
                    "user": {
                        "avatar": "avatar.jpg",
                        "name": "mickael",
                        "email": "mickael@example.com",
                    }
                },
            },
        )
