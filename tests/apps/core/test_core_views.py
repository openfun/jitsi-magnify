"""
Test suite for redirection to jitsi
"""
from datetime import datetime
from unittest import mock

from django.test import TestCase
from django.test.utils import override_settings
from django.utils import timezone

from magnify.apps.core.factories import UserFactory


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
class RedirectTestCase(TestCase):
    """Test suite for redirection to jitsi instance"""

    def test_redirect_anonymous_user(self):
        """
        Get path /api/token/test and redirect to jitsi with a token as a guest
        We thus verify that this redirects as wanted, and that the token is correct
        """
        # Fetch response from "api/token/{room}"
        now = datetime(2030, 6, 15, tzinfo=timezone.utc)
        with mock.patch.object(timezone, "now", return_value=now):
            response = self.client.get("/api/token/test")

        # Expect to be redirected to the jitsi url with a token when joining the "test" room
        token = (
            "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJleHAiOjE5MDc3MTI2MDAsImlhdCI6MTkwNzcxMjAwMCw"
            "ibW9kZXJhdG9yIjp0cnVlLCJhdWQiOiJqaXRzaSIsImlzcyI6ImFwcF9pZCIsInN1YiI6Im1lZXQuaml0c2k"
            "iLCJyb29tIjoidGVzdCIsImNvbnRleHQiOnsidXNlciI6eyJhdmF0YXIiOiJhdmF0YXIuanBnIiwibmFtZSI"
            "6Imd1ZXN0IiwiZW1haWwiOiIifX19.HY_E1pCaYzARFkl5jrTpnffQIScdZZMc3v_DpdneP7Q"
        )
        self.assertRedirects(
            response,
            f"https://meet.jit.si/test?jwt={token}",
            fetch_redirect_response=False,
        )

    def test_redirect_authenticated_user(self):
        """
        Get path /api/token/test and redirect to jitsi with a token as a logged in user
        We thus verify that this redirects as wanted, and that the token is correct
        """
        # Log in a user
        user = UserFactory(username="mickael", email="mickael@example.com")

        # Fetch response from "api/token/{room}"
        now = datetime(2030, 6, 15, tzinfo=timezone.utc)
        with mock.patch.object(timezone, "now", return_value=now):
            self.client.login(username=user.username, password="password")
            response = self.client.get("/api/token/test")

        # Url to which we expect to be redirected for the "test" room
        token = (
            "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJleHAiOjE5MDc3MTI2MDAsImlhdCI6MTkwNzcxMjAwMCw"
            "ibW9kZXJhdG9yIjp0cnVlLCJhdWQiOiJqaXRzaSIsImlzcyI6ImFwcF9pZCIsInN1YiI6Im1lZXQuaml0c2k"
            "iLCJyb29tIjoidGVzdCIsImNvbnRleHQiOnsidXNlciI6eyJhdmF0YXIiOiJhdmF0YXIuanBnIiwibmFtZSI"
            "6Im1pY2thZWwiLCJlbWFpbCI6Im1pY2thZWxAZXhhbXBsZS5jb20ifX19.EslqEtBSpNtzBFkd_iIkEIWcTI"
            "25S7ihhu4IE1oE_x4"
        )
        self.assertRedirects(
            response,
            f"https://meet.jit.si/test?jwt={token}",
            fetch_redirect_response=False,
        )

    def test_redirect_staff_user(self):
        """
        Get path /api/token/test and redirect to jitsi with a token as a logged in user
        We thus verify that this redirects as wanted, and that the token is correct
        """
        # Log in a user
        user = UserFactory(
            username="mickael", email="mickael@example.com", is_staff=True
        )

        # Fetch response from "api/token/{room}"
        now = datetime(2030, 6, 15, tzinfo=timezone.utc)
        with mock.patch.object(timezone, "now", return_value=now):
            self.client.login(username=user.username, password="password")
            response = self.client.get("/api/token/test")

        # Url to which we expect to be redirected for the "test" room
        token = (
            "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJleHAiOjE5MDc3MTI2MDAsImlhdCI6MTkwNzcxMjAwMCw"
            "ibW9kZXJhdG9yIjp0cnVlLCJhdWQiOiJqaXRzaSIsImlzcyI6ImFwcF9pZCIsInN1YiI6Im1lZXQuaml0c2k"
            "iLCJyb29tIjoidGVzdCIsImNvbnRleHQiOnsidXNlciI6eyJhdmF0YXIiOiJhdmF0YXIuanBnIiwibmFtZSI"
            "6Im1pY2thZWwiLCJlbWFpbCI6Im1pY2thZWxAZXhhbXBsZS5jb20ifX19.EslqEtBSpNtzBFkd_iIkEIWcTI"
            "25S7ihhu4IE1oE_x4"
        )
        self.assertRedirects(
            response,
            f"https://meet.jit.si/test?jwt={token}",
            fetch_redirect_response=False,
        )
