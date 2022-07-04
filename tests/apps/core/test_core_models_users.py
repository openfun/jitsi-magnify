"""
Unit tests for the Room model
"""
from django.core.exceptions import ValidationError
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

    def test_models_users_email_normalization(self):
        """The email field should be automatically normalized upon saving."""
        user = UserFactory()
        user.email = "Thomas.Jefferson@Example.com"
        user.save()
        self.assertEqual(user.email, "Thomas.Jefferson@example.com")

    def test_models_users_username_max_length(self):
        """The username field should be 30 characters maximum."""
        UserFactory(username="a" * 30)
        with self.assertRaises(ValidationError) as context:
            UserFactory(username="a" * 31)

        self.assertEqual(
            context.exception.messages,
            ["Ensure this value has at most 30 characters (it has 31)."],
        )

    def test_models_users_username_characters(self):
        """The username field should only contain certain characters."""
        with self.assertRaises(ValidationError) as context:
            UserFactory(username="a b")

        self.assertEqual(
            context.exception.messages,
            ["Username must contain only letters, numbers, underscores and hyphens."],
        )

    def test_models_users_ordering(self):
        """Users should be returned ordered by their username."""
        UserFactory.create_batch(3)
        users = User.objects.all()
        self.assertGreaterEqual(users[1].username, users[0].username)
        self.assertGreaterEqual(users[2].username, users[1].username)
