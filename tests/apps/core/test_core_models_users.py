"""
Unit tests for the Room model
"""
from django.test import TestCase

from magnify.apps.core.factories import UserFactory


class UserModelsTestCase(TestCase):
    """
    Unit test suite to validate the behavior of the User model
    """

    def test_models_room_str(self):
        """The str representation should be the username."""
        user = UserFactory()
        self.assertEqual(str(user), user.username)
