"""
Unit tests for the Room model
"""
from django.test import TestCase

from magnify.apps.core.factories import UserFactory
from magnify.apps.core.models import User


class UsersModelsTestCase(TestCase):
    """
    Unit test suite to validate the behavior of the User model
    """

    def test_models_users_str(self):
        """The str representation should be the username."""
        user = UserFactory()
        self.assertEqual(str(user), user.username)

    def test_models_users_ordering(self):
        """Users should be returned ordered by their username."""
        UserFactory.create_batch(3)
        users = User.objects.all()
        self.assertGreaterEqual(users[1].username, users[0].username)
        self.assertGreaterEqual(users[2].username, users[1].username)
