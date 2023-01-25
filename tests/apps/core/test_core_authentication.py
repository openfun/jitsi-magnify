"""
Unit tests for the DelegatedJWT authentication backend.
"""
from uuid import uuid4

from django.test import TestCase
from django.test.utils import override_settings

from rest_framework_simplejwt.tokens import AccessToken

from magnify.apps.core.authentication import DelegatedJWTAuthentication
from magnify.apps.core.factories import UserFactory
from magnify.apps.core.models import User


class DelegatedJWTAuthenticationTestCase(TestCase):
    """
    Unit test suite to validate the behavior of authentication backend.
    """

    def test_authentication_delegated_jwt_no_email(self):
        """The backend should authenticate an existing user with minimum payload."""
        user = UserFactory()
        jwt_token = AccessToken()
        jwt_token["sub"] = str(user.jwt_sub)
        authenticated_user = DelegatedJWTAuthentication().get_user(jwt_token)

        user.refresh_from_db()
        self.assertEqual(user, authenticated_user)
        self.assertTrue(user.is_active)

    @override_settings(
        JWT_USER_FIELDS_SYNC={"username": "username", "email": "email_alt"}
    )
    def test_authentication_delegated_jwt_unknown_user(self):
        """An unknown user should be created by the backend."""
        jwt_token = AccessToken()
        jwt_token["sub"] = uuid4()
        jwt_token["username"] = "dave"

        authenticated_user = DelegatedJWTAuthentication().get_user(jwt_token)
        new_user = User.objects.get()
        self.assertEqual(new_user, authenticated_user)
        self.assertTrue(new_user.is_active)
        self.assertEqual(new_user.username, "dave")

    @override_settings(
        JWT_USER_FIELDS_SYNC={"username": "username", "email": "email_alt"}
    )
    def test_authentication_synchronization_success(self):
        """
        A mapping can be configured for field-by-field synchronization between the Magnify
        user and the token payload.
        """
        jwt_token = AccessToken()
        jwt_token["sub"] = uuid4()
        jwt_token["username"] = "dave"
        jwt_token["email_alt"] = "dave@example.com"

        DelegatedJWTAuthentication().get_user(jwt_token)
        new_user = User.objects.get()
        self.assertEqual(new_user.email, "dave@example.com")

    @override_settings(
        JWT_USER_FIELDS_SYNC={"username": "username", "email": "unknown"}
    )
    def test_authentication_synchronization_missing(self):
        """A mapping with a field that does not exist in the token should not fail."""
        jwt_token = AccessToken()
        jwt_token["sub"] = uuid4()
        jwt_token["username"] = "dave"

        DelegatedJWTAuthentication().get_user(jwt_token)
        new_user = User.objects.get()
        self.assertEqual(new_user.email, "")
