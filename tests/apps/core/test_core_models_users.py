"""
Unit tests for the Room model
"""
from django.core.exceptions import ValidationError
from django.test import TestCase
from django.test.utils import override_settings

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

    def test_models_users_username_null(self):
        """The "username" field should not be null."""
        with self.assertRaises(ValidationError) as context:
            UserFactory(username=None)

        self.assertEqual(
            context.exception.messages,
            ["This field cannot be null."],
        )

    def test_models_users_username_empty(self):
        """The "username" field should not be empty."""
        with self.assertRaises(ValidationError) as context:
            UserFactory(username="")

        self.assertEqual(
            context.exception.messages,
            ["This field cannot be blank."],
        )

    def test_models_users_username_unique(self):
        """The "username" field should be unique."""
        user = UserFactory()
        with self.assertRaises(ValidationError) as context:
            UserFactory(username=user.username)

        self.assertEqual(
            context.exception.messages,
            ["A user with that username already exists."],
        )

    def test_models_users_username_max_length(self):
        """The username field should be 30 characters maximum."""
        UserFactory(username="a" * 30)
        with self.assertRaises(ValidationError) as context:
            UserFactory(username="a" * 31)

        self.assertEqual(
            context.exception.messages,
            ["Ensure this value has at most 30 characters (it has 31)."],
        )

    def test_models_users_username_special_characters(self):
        """The username field should accept periods, dashes and underscores."""
        user = UserFactory(username="dave.bowman-1_1")
        self.assertEqual(user.username, "dave.bowman-1_1")

    def test_models_users_username_spaces(self):
        """The username field should not contain spaces."""
        with self.assertRaises(ValidationError) as context:
            UserFactory(username="a b")

        self.assertEqual(
            context.exception.messages,
            [
                "Username must contain only lower case letters, numbers, hyphens, "
                "periods and underscores."
            ],
        )

    def test_models_users_username_lower_case(self):
        """The username field should only contain lower case characters."""
        with self.assertRaises(ValidationError) as context:
            UserFactory(username="John")

        self.assertEqual(
            context.exception.messages,
            [
                "Username must contain only lower case letters, numbers, hyphens, "
                "periods and underscores."
            ],
        )

    def test_models_users_username_ascii(self):
        """The username field should only accept ASCII characters."""
        with self.assertRaises(ValidationError) as context:
            UserFactory(username="rené")

        self.assertEqual(
            context.exception.messages,
            [
                "Username must contain only lower case letters, numbers, hyphens, "
                "periods and underscores."
            ],
        )

    @override_settings(USERNAME_REGEX=r"^[a-z0-9_-]+$")
    def test_models_users_username_override_regex(self):
        """
        It should be possible to override the username regex to customize allowed characters.
        """
        with self.assertRaises(ValidationError) as context:
            UserFactory(username="dave.bowman")

        self.assertEqual(
            context.exception.messages,
            [
                "Username must contain only lower case letters, numbers, hyphens, "
                "periods and underscores."
            ],
        )

    def test_models_users_email_empty(self):
        """The "email" field can be empty."""
        UserFactory(email="")

    def test_models_users_email_unique(self):
        """The "email" field is not unique."""
        user = UserFactory()
        UserFactory(email=user.email)

    def test_models_users_email_normalization(self):
        """The email field should be automatically normalized upon saving."""
        user = UserFactory()
        user.email = "Thomas.Jefferson@Example.com"
        user.save()
        self.assertEqual(user.email, "Thomas.Jefferson@example.com")

    def test_models_users_ordering(self):
        """Users should be returned ordered by their username."""
        UserFactory.create_batch(3)
        users = User.objects.all()
        self.assertGreaterEqual(users[1].username, users[0].username)
        self.assertGreaterEqual(users[2].username, users[1].username)
