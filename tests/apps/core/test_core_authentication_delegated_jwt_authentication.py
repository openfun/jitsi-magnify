"""
Unit tests for the DelegatedJWTAuthentication backend.
"""
from uuid import uuid4

from django.test import TestCase
from django.test.utils import override_settings

from magnify.apps.core import factories, models
from magnify.apps.core.authentication import DelegatedJWTAuthentication


class DelegatedJWTAuthenticationTestCase(TestCase):
    """
    Unit test suite to validate the behavior of the DelegatedJWTAuthentication backend.
    """

    def test_authentication_delegated_user_unknown(self):
        """If the user is unknown, it should be created on the fly."""
        jwt_user_id = uuid4()
        payload = {
            "sub": jwt_user_id,
            "name": "David Bowman",
            "email": "david.bowman@hal.com",
            "preferred_username": "dave",
        }

        DelegatedJWTAuthentication().get_user(payload)

        user = models.User.objects.get()
        self.assertEqual(user.email, "david.bowman@hal.com")
        self.assertEqual(user.name, "David Bowman")
        self.assertEqual(user.username, "dave")
        self.assertEqual(user.jwt_sub, str(jwt_user_id))
        self.assertFalse(user.is_staff)
        self.assertFalse(user.is_superuser)
        self.assertFalse(user.is_device)

    def test_authentication_delegated_user_existing(self):
        """If the user is existing, it should get synchronized."""
        jwt_user_id = uuid4()
        user = factories.UserFactory(jwt_sub=jwt_user_id)
        other_user = factories.UserFactory(
            name="Frank Poole",
            email="frank.poole@hal.com",
            username="frank",
            jwt_sub=None,
        )

        payload = {
            "sub": jwt_user_id,
            "name": "David Bowman",
            "email": "david.bowman@hal.com",
            "preferred_username": "dave",
        }
        DelegatedJWTAuthentication().get_user(payload)
        self.assertEqual(models.User.objects.count(), 2)

        # The user loging-in was synchronized
        user.refresh_from_db()
        self.assertEqual(user.email, "david.bowman@hal.com")
        self.assertEqual(user.name, "David Bowman")
        self.assertEqual(user.username, "dave")
        self.assertEqual(user.jwt_sub, str(jwt_user_id))

        # The other user was left unchanged
        other_user.refresh_from_db()
        self.assertEqual(other_user.email, "frank.poole@hal.com")
        self.assertEqual(other_user.name, "Frank Poole")
        self.assertEqual(other_user.username, "frank")
        self.assertIsNone(other_user.jwt_sub)

    @override_settings(JWT_USER_DEVICE_AUDIENCES=["sip-devices"])
    def test_authentication_delegated_user_device(self):
        """Device clients should be recognised and the user should be marked as such."""
        jwt_user_id = uuid4()
        payload = {
            "sub": jwt_user_id,
            "name": "David Bowman",
            "email": "david.bowman@hal.com",
            "preferred_username": "dave",
            "aud": "sip-devices",
        }

        DelegatedJWTAuthentication().get_user(payload)

        user = models.User.objects.get()
        self.assertTrue(user.is_device)

        payload["aud"] = "magnify-front"
        DelegatedJWTAuthentication().get_user(payload)

        user.refresh_from_db()
        self.assertFalse(user.is_device)
