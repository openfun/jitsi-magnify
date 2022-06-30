"""
Test suite for redirection to jitsi
"""
from datetime import datetime
from unittest import mock

from django.test.utils import override_settings
from django.utils import timezone

from rest_framework import status
from rest_framework.test import APITestCase
from rest_framework_simplejwt.tokens import AccessToken

from magnify.apps.core.factories import UserFactory
from magnify.apps.core.models import User


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
class RedirectTestCase(APITestCase):
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
        access = AccessToken.for_user(user)

        # Fetch response from "api/token/{room}"
        now = datetime(2030, 6, 15, tzinfo=timezone.utc)
        with mock.patch.object(timezone, "now", return_value=now):
            response = self.client.get(
                "/api/token/test", HTTP_AUTHORIZATION=f"Bearer {access}"
            )

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
        access = AccessToken.for_user(user)

        # Fetch response from "api/token/{room}"
        now = datetime(2030, 6, 15, tzinfo=timezone.utc)
        with mock.patch.object(timezone, "now", return_value=now):
            response = self.client.get(
                "/api/token/test", HTTP_AUTHORIZATION=f"Bearer {access}"
            )

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


class UserApiTest(APITestCase):
    """
    Test the user API
    """

    def test_create_user(self):
        """
        Create a user and check that it is correctly created
        """
        # Create a user
        user = {
            "username": "MichaelJ",
            "email": "michael@jordan.fr",
            "password": "SeCUr3p@ssw0rd",
            "name": "Michael Jordan",
        }
        response = self.client.post(
            "/api/users/",
            {
                "username": user["username"],
                "password": user["password"],
                "email": user["email"],
                "name": user["name"],
            },
            format="json",
        )
        user_in_db = User.objects.get(username=user["username"])
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(user_in_db.email, user["email"])
        self.assertEqual(user_in_db.name, user["name"])

    def test_create_user_with_existing_username(self):
        """
        Create a user with an existing username and check that it is correctly created
        """
        # Create a user
        user = UserFactory(username="MichaelJ")
        # Create a second user with the same username
        response = self.client.post(
            "/api/users/",
            {
                "username": user.username,
                "password": "s3cur3p@ssw03d",
                "email": "user@example.com",
                "name": "John Doe",
            },
            format="json",
        )
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertEqual(
            response.data["username"][0].title(),
            "A User With That Username Already Exists.",
        )

    def test_create_user_with_weak_password(self):
        """
        Create a user with a weak password and check that it refuses to create the user
        """
        response = self.client.post(
            "/api/users/",
            {
                "username": "username",
                "password": "weak",
                "email": "user@example.com",
                "name": "John Doe",
            },
            format="json",
        )
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertEqual(
            response.data["password"][0],
            "This password is too short. It must contain at least 8 characters.",
        )

    def test_get_self_information(self):
        """
        Get the information of the logged in user
        """
        # Create a user
        user = UserFactory()
        # Log in the user
        access = AccessToken.for_user(user)
        # Get the user information
        response = self.client.get(
            "/api/users/me/", HTTP_AUTHORIZATION=f"Bearer {access}"
        )
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data["username"], user.username)
        self.assertEqual(response.data["email"], user.email)
        self.assertEqual(response.data["name"], user.name)

    def test_get_self_information_with_no_token(self):
        """
        Get the information of the logged in user with no token
        """
        response = self.client.get("/api/users/me/")
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_delete_user(self):
        """
        Delete a user and check that it is correctly deleted
        """
        # Create a user
        user = UserFactory()
        # Log in the user
        access = AccessToken.for_user(user)
        # Delete the user
        response = self.client.delete(
            f"/api/users/{user.id}", HTTP_AUTHORIZATION=f"Bearer {access}"
        )
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)
        # Check that the user is deleted
        response = self.client.get(
            "/api/users/me/", HTTP_AUTHORIZATION=f"Bearer {access}"
        )
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_delete_user_with_invalid_token(self):
        """
        Delete a user with an invalid token and fail
        """
        # Create a user
        user = UserFactory()
        # Delete the user
        response = self.client.delete(f"/api/users/{user.id}")
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_get_user(self):
        """
        Get a user and check that it is correctly returned
        """
        # Create a user
        user = UserFactory()
        # Create and login an observer
        observer = UserFactory()
        access = AccessToken.for_user(observer)
        # Get the user
        response = self.client.get(
            f"/api/users/{user.id}", HTTP_AUTHORIZATION=f"Bearer {access}"
        )
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data["username"], user.username)
        self.assertEqual(response.data["email"], user.email)
        self.assertEqual(response.data["name"], user.name)

    def get_user_without_token(self):
        """
        Get a user without token and fail
        """
        # Create a user
        user = UserFactory()
        # Get the user
        response = self.client.get(f"/api/users/{user.id}")
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_change_password(self):
        """
        Change the password of a user and check that it is correctly changed
        """
        # Create a user
        user = UserFactory()
        # Log in the user
        access = AccessToken.for_user(user)
        # Change the password
        response = self.client.put(
            f"/api/users/{user.id}/password",
            {"old_password": "password", "new_password": "s3cur3p@ssw0rd2"},
            HTTP_AUTHORIZATION=f"Bearer {access}",
        )
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        # Check that the password is changed
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data["username"], user.username)
        self.assertTrue(
            self.client.login(username=user.username, password="s3cur3p@ssw0rd2")
        )
