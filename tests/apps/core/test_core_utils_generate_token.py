"""
Test suite for redirection to jitsi
"""
import datetime
import random

from django.conf import settings
from django.contrib.auth.models import AnonymousUser
from django.test import TestCase
from django.test.utils import override_settings

import jwt
import time_machine

from magnify.apps.core.factories import UserFactory
from magnify.apps.core.utils import generate_token


@override_settings(
    JITSI_CONFIGURATION={
        "jitsi_app_id": "app_id",
        "jitsi_guest_avatar": "avatar.jpg",
        "jitsi_guest_username": "guest",
        "jitsi_secret_key": "ThisIsAnExampleKeyForDevPurposeOnly",
        "jitsi_token_expiration_seconds": 600,
        "jitsi_xmpp_domain": "meet.jitsi",
    }
)
class TokenUtilsTestCase(TestCase):
    """Test suite for utils related to the JWT token."""

    @time_machine.travel(datetime.datetime(2030, 6, 15, tzinfo=datetime.timezone.utc))
    def test_utils_generate_token_anonymous(self):
        """Generate a JWT token for a guest."""

        # Test token with a fix admin status
        token = generate_token(AnonymousUser(), "my-room", is_admin=True)

        self.assertEqual(
            token,
            (
                "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJleHAiOjE5MDc3MTI2MDAsImlhdCI6M"
                "TkwNzcxMjAwMCwibW9kZXJhdG9yIjp0cnVlLCJhdWQiOiJqaXRzaSIsImlzcyI6ImFwcF9"
                "pZCIsInN1YiI6Im1lZXQuaml0c2kiLCJyb29tIjoibXktcm9vbSIsImNvbnRleHQiOnsid"
                "XNlciI6eyJhdmF0YXIiOiJhdmF0YXIuanBnIiwibmFtZSI6Imd1ZXN0IiwiZW1haWwiOiI"
                "ifX19.mCcDVhhWyWfOEGTpiNdemQlPURTCFGh-AWOrLFY2Tds"
            ),
        )

        # Test payload with a random admin status
        is_admin = random.choice([True, False])  # nosec
        token = generate_token(AnonymousUser(), "my-room", is_admin=is_admin)

        payload = jwt.decode(
            token,
            settings.JITSI_CONFIGURATION["jitsi_secret_key"],
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

    @time_machine.travel(datetime.datetime(2030, 6, 15, tzinfo=datetime.timezone.utc))
    def test_utils_generate_token_authenticated(self):
        """Generate a token for a quidam user."""
        user = UserFactory(username="mickael", email="mickael@example.com")

        # Test token with a fix admin status
        token = generate_token(user, "my-room", is_admin=True)

        self.assertEqual(
            token,
            (
                "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJleHAiOjE5MDc3MTI2MDAsImlhdCI6M"
                "TkwNzcxMjAwMCwibW9kZXJhdG9yIjp0cnVlLCJhdWQiOiJqaXRzaSIsImlzcyI6ImFwcF9"
                "pZCIsInN1YiI6Im1lZXQuaml0c2kiLCJyb29tIjoibXktcm9vbSIsImNvbnRleHQiOnsid"
                "XNlciI6eyJhdmF0YXIiOiJhdmF0YXIuanBnIiwibmFtZSI6Im1pY2thZWwiLCJlbWFpbCI"
                "6Im1pY2thZWxAZXhhbXBsZS5jb20ifX19.0pKgUY7362CaQZYXYgAysot431giCertbe4B"
                "IOlJ3_8"
            ),
        )
        # Test payload with a random admin status
        is_admin = random.choice([True, False])  # nosec
        token = generate_token(user, "my-room", is_admin=is_admin)

        payload = jwt.decode(
            token,
            settings.JITSI_CONFIGURATION["jitsi_secret_key"],
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

    @time_machine.travel(datetime.datetime(2030, 6, 15, tzinfo=datetime.timezone.utc))
    def test_utils_generate_token_staff(self):
        """Generate a token for a staff user."""
        user = UserFactory(
            username="mickael", email="mickael@example.com", is_staff=True
        )
        is_admin = random.choice([True, False])  # nosec
        token = generate_token(user, "my-room", is_admin=is_admin)

        self.assertEqual(
            token,
            (
                "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJleHAiOjE5MDc3MTI2MDAsImlhdCI6M"
                "TkwNzcxMjAwMCwibW9kZXJhdG9yIjp0cnVlLCJhdWQiOiJqaXRzaSIsImlzcyI6ImFwcF9"
                "pZCIsInN1YiI6Im1lZXQuaml0c2kiLCJyb29tIjoibXktcm9vbSIsImNvbnRleHQiOnsid"
                "XNlciI6eyJhdmF0YXIiOiJhdmF0YXIuanBnIiwibmFtZSI6Im1pY2thZWwiLCJlbWFpbCI"
                "6Im1pY2thZWxAZXhhbXBsZS5jb20ifX19.0pKgUY7362CaQZYXYgAysot431giCertbe4B"
                "IOlJ3_8"
            ),
        )

        payload = jwt.decode(
            token,
            settings.JITSI_CONFIGURATION["jitsi_secret_key"],
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
