"""
Tests for Users API endpoints in Magnify's core app.
"""
from unittest import mock

from django.contrib.auth.hashers import check_password

from rest_framework.test import APITestCase
from rest_framework_simplejwt.tokens import AccessToken

from magnify.apps.core.factories import UserFactory
from magnify.apps.core.models import User

# pylint: disable=too-many-public-methods

MOCK_TOKENS = tokens = {
    "refresh": "myRefreshToken",
    "access": "myAccessToken",
}


class UsersApiTestCase(APITestCase):
    """Test requests on magnify's core app User API endpoint."""

    def test_api_users_list_anonymous(self):
        """Anonymous users should not be allowed to list users."""
        UserFactory.create_batch(2)
        response = self.client.get("/api/users/")
        self.assertEqual(response.status_code, 401)
        self.assertEqual(
            response.json(), {"detail": "Authentication credentials were not provided."}
        )

    def test_api_users_list_authenticated_no_query(self):
        """
        Authenticated users should not be able to list other users without applying a query.
        """
        user = UserFactory()
        UserFactory.create_batch(2)
        jwt_token = AccessToken.for_user(user)

        response = self.client.get(
            "/api/users/", HTTP_AUTHORIZATION=f"Bearer {jwt_token}"
        )

        self.assertEqual(response.status_code, 200)
        results = response.json()
        self.assertEqual(results, [])

    def test_api_users_list_authenticated_by_name(self):
        """
        Authenticated users should not be able to find users by their name.
        """
        user = UserFactory()
        users = UserFactory.create_batch(2)
        jwt_token = AccessToken.for_user(user)

        # Partial query should not work
        response = self.client.get(
            f"/api/users/?q={users[0].name[:-1]}",
            HTTP_AUTHORIZATION=f"Bearer {jwt_token}",
        )

        self.assertEqual(response.status_code, 200)
        results = response.json()
        self.assertEqual(results, [])

        # Full query should not work
        response = self.client.get(
            f"/api/users/?q={users[0].name}", HTTP_AUTHORIZATION=f"Bearer {jwt_token}"
        )

        self.assertEqual(response.status_code, 200)
        results = response.json()
        self.assertEqual(results, [])

    def test_api_users_list_authenticated_by_username(self):
        """
        Authenticated users should be able to search users with a case insensitive and
        similar query on the username.
        """
        user = UserFactory()
        user1 = UserFactory(username="jeff-burns")
        UserFactory()
        jwt_token = AccessToken.for_user(user)

        # Partial query should not work
        response = self.client.get(
            "/api/users/?q=jeff-burn",
            HTTP_AUTHORIZATION=f"Bearer {jwt_token}",
        )

        self.assertEqual(response.status_code, 200)
        results = response.json()
        self.assertEqual(results, [])

        # Full query should work
        response = self.client.get(
            "/api/users/?q=jeff-burns",
            HTTP_AUTHORIZATION=f"Bearer {jwt_token}",
        )

        self.assertEqual(response.status_code, 200)
        results = response.json()
        self.assertEqual(len(results), 1)

        self.assertEqual(
            results[0],
            {
                "id": str(user1.id),
                "language": user1.language,
                "name": user1.name,
                "username": "jeff-burns",
            },
        )

        # Username resulting in the same slug should work
        response = self.client.get(
            "/api/users/?q=Jêff Burns",
            HTTP_AUTHORIZATION=f"Bearer {jwt_token}",
        )

        self.assertEqual(response.status_code, 200)
        results = response.json()
        self.assertEqual(len(results), 1)

        self.assertEqual(
            results[0],
            {
                "id": str(user1.id),
                "language": user1.language,
                "name": user1.name,
                "username": "jeff-burns",
            },
        )

    def test_api_users_list_authenticated_by_email(self):
        """
        Authenticated users should be able to search users with a case insensitive query
        on the email.
        """
        user = UserFactory()
        user1 = UserFactory(email="my-address@example.com")
        UserFactory()
        jwt_token = AccessToken.for_user(user)

        # Partial query should not work
        response = self.client.get(
            f"/api/users/?q={user1.email[:-1]}",
            HTTP_AUTHORIZATION=f"Bearer {jwt_token}",
        )

        self.assertEqual(response.status_code, 200)
        results = response.json()
        self.assertEqual(results, [])

        # Full query should work
        response = self.client.get(
            "/api/users/?q=my-address@example.com",
            HTTP_AUTHORIZATION=f"Bearer {jwt_token}",
        )

        self.assertEqual(response.status_code, 200)
        results = response.json()
        self.assertEqual(len(results), 1)

        self.assertEqual(
            results[0],
            {
                "id": str(user1.id),
                "language": user1.language,
                "name": user1.name,
                "username": user1.username,
            },
        )

        # Email resulting in the same slug should work
        response = self.client.get(
            "/api/users/?q=My-Address@example.com",
            HTTP_AUTHORIZATION=f"Bearer {jwt_token}",
        )

        self.assertEqual(response.status_code, 200)
        results = response.json()
        self.assertEqual(len(results), 1)

        self.assertEqual(
            results[0],
            {
                "id": str(user1.id),
                "language": user1.language,
                "name": user1.name,
                "username": user1.username,
            },
        )

    def test_api_users_list_throttle(self):
        """Calling the list API repeatedly"""
        user = UserFactory()
        users = UserFactory.create_batch(2)
        jwt_token = AccessToken.for_user(user)

        url = f"/api/users/?q={users[0].email}"
        url_wrong = "/api/users/?q=wrong"
        bearer = f"Bearer {jwt_token}"
        response = self.client.get(url_wrong, HTTP_AUTHORIZATION=bearer)
        self.assertEqual(response.status_code, 200)
        response = self.client.get(url_wrong, HTTP_AUTHORIZATION=bearer)
        self.assertEqual(response.status_code, 200)
        response = self.client.get(url_wrong, HTTP_AUTHORIZATION=bearer)
        self.assertEqual(response.status_code, 200)
        response = self.client.get(url_wrong, HTTP_AUTHORIZATION=bearer)
        self.assertEqual(response.status_code, 429)
        response = self.client.get(url_wrong, HTTP_AUTHORIZATION=bearer)
        self.assertEqual(response.status_code, 429)

        # A successful search should reset the throttle
        response = self.client.get(url, HTTP_AUTHORIZATION=bearer)
        self.assertEqual(response.status_code, 200)
        response = self.client.get(url_wrong, HTTP_AUTHORIZATION=bearer)
        self.assertEqual(response.status_code, 200)
        response = self.client.get(url_wrong, HTTP_AUTHORIZATION=bearer)
        self.assertEqual(response.status_code, 200)
        response = self.client.get(url_wrong, HTTP_AUTHORIZATION=bearer)
        self.assertEqual(response.status_code, 200)
        response = self.client.get(url_wrong, HTTP_AUTHORIZATION=bearer)
        self.assertEqual(response.status_code, 429)

    def test_api_users_retrieve_anonymous(self):
        """Anonymous users should not be allowed to retrieve a user."""
        user = UserFactory()
        response = self.client.get(f"/api/users/{user.id!s}/")

        self.assertEqual(response.status_code, 401)
        self.assertEqual(
            response.json(), {"detail": "Authentication credentials were not provided."}
        )

    def test_api_users_retrieve_authenticated_self(self):
        """
        Authenticated users should be allowed to retrieve their own user.
        The returned object should not contain the password.
        """
        user = UserFactory()
        jwt_token = AccessToken.for_user(user)

        response = self.client.get(
            f"/api/users/{user.id!s}/", HTTP_AUTHORIZATION=f"Bearer {jwt_token}"
        )
        self.assertEqual(response.status_code, 200)
        self.assertEqual(
            response.json(),
            {
                "id": str(user.id),
                "language": user.language,
                "name": user.name,
                "email": user.email,
                "username": user.username,
            },
        )

    def test_api_users_retrieve_authenticated_other(self):
        """
        Authenticated users should be able to retrieve another user's detail view with
        limited information.
        """
        user = UserFactory()
        other_user = UserFactory()
        jwt_token = AccessToken.for_user(user)

        response = self.client.get(
            f"/api/users/{other_user.id!s}/", HTTP_AUTHORIZATION=f"Bearer {jwt_token}"
        )
        self.assertEqual(response.status_code, 200)
        self.assertEqual(
            response.json(),
            {
                "id": str(other_user.id),
                "language": other_user.language,
                "name": other_user.name,
                "username": other_user.username,
            },
        )

    def test_api_users_create_anonymous_successful(self):
        """Anonymous users should be able to create users."""
        with mock.patch(
            "magnify.apps.core.utils.get_tokens_for_user", return_value=MOCK_TOKENS
        ):
            response = self.client.post(
                "/api/users/",
                {
                    "email": "thomas.jeffersion@example.com",
                    "language": "fr",
                    "name": "Thomas Jefferson",
                    "username": "thomas",
                    "password": "mypassword",
                },
            )
        self.assertEqual(response.status_code, 201)
        self.assertEqual(User.objects.count(), 1)

        user = User.objects.get()
        self.assertEqual(user.email, "thomas.jeffersion@example.com")
        self.assertEqual(user.name, "Thomas Jefferson")
        self.assertEqual(user.username, "thomas")

        self.assertIn("pbkdf2_sha256", user.password)
        self.assertTrue(check_password("mypassword", user.password))

        self.assertEqual(
            response.json(),
            {
                "id": str(user.id),
                "email": "thomas.jeffersion@example.com",
                "language": "fr",
                "name": "Thomas Jefferson",
                "username": "thomas",
                "auth": MOCK_TOKENS,
            },
        )

    def test_api_users_create_authenticated_successful(self):
        """Authenticated users should be able to create users."""
        user = UserFactory()
        jwt_token = AccessToken.for_user(user)

        with mock.patch(
            "magnify.apps.core.utils.get_tokens_for_user", return_value=MOCK_TOKENS
        ):
            response = self.client.post(
                "/api/users/",
                {
                    "email": "thomas.jeffersion@example.com",
                    "language": "fr",
                    "name": "Thomas Jefferson",
                    "username": "thomas",
                    "password": "mypassword",
                },
                HTTP_AUTHORIZATION=f"Bearer {jwt_token}",
            )
        self.assertEqual(response.status_code, 201)
        self.assertEqual(User.objects.count(), 2)

        user = User.objects.get(username="thomas")
        self.assertEqual(user.email, "thomas.jeffersion@example.com")
        self.assertEqual(user.name, "Thomas Jefferson")
        self.assertEqual(user.language, "fr")

        self.assertIn("pbkdf2_sha256", user.password)
        self.assertTrue(check_password("mypassword", user.password))

        self.assertEqual(
            response.json(),
            {
                "id": str(user.id),
                "email": "thomas.jeffersion@example.com",
                "language": "fr",
                "name": "Thomas Jefferson",
                "username": "thomas",
                "auth": MOCK_TOKENS,
            },
        )

    def test_api_users_create_authenticated_existing_username(self):
        """
        A user trying to create a user with a username that already exists
        should receive a 400 error.
        """
        user = UserFactory()
        jwt_token = AccessToken.for_user(user)

        response = self.client.post(
            "/api/users/",
            {
                "email": "thomas.jeffersion@example.com",
                "language": "fr",
                "name": "Thomas Jefferson",
                "username": user.username,
                "password": "mypassword",
            },
            HTTP_AUTHORIZATION=f"Bearer {jwt_token}",
        )

        self.assertEqual(response.status_code, 400)
        self.assertEqual(
            response.json(), {"username": ["A user with that username already exists."]}
        )

    def test_api_users_create_authenticated_existing_email(self):
        """
        A user trying to create a user with an email that already exists
        should receive a 400 error.
        """
        user = UserFactory()
        jwt_token = AccessToken.for_user(user)

        response = self.client.post(
            "/api/users/",
            {
                "email": user.email,
                "language": "fr",
                "name": "Thomas Jefferson",
                "username": "thomas",
                "password": "mypassword",
            },
            HTTP_AUTHORIZATION=f"Bearer {jwt_token}",
        )

        self.assertEqual(response.status_code, 400)
        self.assertEqual(
            response.json(), {"email": ["User with this email already exists."]}
        )

    def test_api_users_update_authenticated_self(self):
        """
        Authenticated users should be allowed to update their own user but not the email.
        Before allowing updating the email, we will have to implement email validation.
        """
        user = UserFactory(email="old@example.com", username="old-username")
        jwt_token = AccessToken.for_user(user)

        response = self.client.put(
            f"/api/users/{user.id!s}/",
            {
                "name": "New name",
                "email": "new@example.com",
                "language": "fr",
                "username": "new-username",
            },
            HTTP_AUTHORIZATION=f"Bearer {jwt_token}",
        )
        self.assertEqual(response.status_code, 200)

        user.refresh_from_db()
        self.assertEqual(user.name, "New name")
        self.assertEqual(user.username, "new-username")

        # The email field should be readonly
        self.assertEqual(user.email, "old@example.com")

    def test_api_users_update_authenticated_other(self):
        """Authenticated users should not be allowed to update other users."""
        user = UserFactory()
        other_user = UserFactory(
            name="Old name", email="old@example.com", username="old-username"
        )
        jwt_token = AccessToken.for_user(user)

        response = self.client.put(
            f"/api/users/{other_user.id!s}/",
            {
                "name": "New name",
                "email": "new@example.com",
                "username": "new-username",
            },
            HTTP_AUTHORIZATION=f"Bearer {jwt_token}",
        )
        self.assertEqual(response.status_code, 403)

        other_user.refresh_from_db()
        self.assertEqual(other_user.email, "old@example.com")
        self.assertEqual(other_user.name, "Old name")
        self.assertEqual(other_user.username, "old-username")

    def test_api_users_delete_list_anonymous(self):
        """Anonymous users should not be allowed to delete a list of users."""
        UserFactory.create_batch(2)

        response = self.client.delete(
            "/api/users/",
        )

        self.assertEqual(response.status_code, 405)
        self.assertEqual(User.objects.count(), 2)

    def test_api_users_delete_list_authenticated(self):
        """Authenticated users should not be allowed to delete a list of users."""
        UserFactory.create_batch(2)
        user = UserFactory()
        jwt_token = AccessToken.for_user(user)

        response = self.client.delete(
            "/api/users/", HTTP_AUTHORIZATION=f"Bearer {jwt_token}"
        )

        self.assertEqual(response.status_code, 405)
        self.assertEqual(User.objects.count(), 3)

    def test_api_users_delete_anonymous(self):
        """Anonymous users should not be allowed to delete a user."""
        user = UserFactory()

        response = self.client.delete(
            f"/api/users/{user.id!s}/",
        )

        self.assertEqual(response.status_code, 401)
        self.assertEqual(User.objects.count(), 1)

    def test_api_users_delete_authenticated(self):
        """
        Authenticated users should not be allowed to delete a user other than themselves.
        """
        user = UserFactory()
        other_user = UserFactory()
        jwt_token = AccessToken.for_user(user)

        response = self.client.delete(
            f"/api/users/{other_user.id!s}/", HTTP_AUTHORIZATION=f"Bearer {jwt_token}"
        )

        self.assertEqual(response.status_code, 403)
        self.assertEqual(User.objects.count(), 2)

    def test_api_users_delete_self(self):
        """Authenticated users should be able to delete their own user."""
        user = UserFactory()
        jwt_token = AccessToken.for_user(user)

        response = self.client.delete(
            f"/api/users/{user.id!s}/", HTTP_AUTHORIZATION=f"Bearer {jwt_token}"
        )

        self.assertEqual(response.status_code, 204)
        self.assertFalse(User.objects.exists())

    def test_api_users_login_successful(self):
        """Anonymous users should be able to login with credentials."""
        user = UserFactory()
        with mock.patch(
            "magnify.apps.core.utils.get_tokens_for_user", return_value=MOCK_TOKENS
        ):
            response = self.client.post(
                "/api/users/login/",
                {
                    "username": user.username,
                    "password": "password",
                },
            )
        self.assertEqual(response.status_code, 200)
        self.assertEqual(
            response.json(),
            {
                "id": str(user.id),
                "email": user.email,
                "language": user.language,
                "name": user.name,
                "username": user.username,
                "auth": MOCK_TOKENS,
            },
        )

    def test_api_users_login_token(self):
        """The token returned by the login view should authenticate the user."""
        user = UserFactory(username="thomas")
        response = self.client.post(
            "/api/users/login/",
            {
                "username": "thomas",
                "password": "password",
            },
        )
        self.assertEqual(response.status_code, 200)

        user_data = response.json()
        response = self.client.get(
            "/api/users/me/", HTTP_AUTHORIZATION=f"Bearer {user_data['auth']['access']}"
        )
        self.assertEqual(
            response.json(),
            {
                "id": str(user.id),
                "email": user.email,
                "language": user.language,
                "name": user.name,
                "username": user.username,
            },
        )

    def test_api_users_login_credentials_missing(self):
        """Attempting a login with incomplete credentials should return an error."""
        UserFactory(username="thomas")
        with mock.patch(
            "magnify.apps.core.utils.get_tokens_for_user", return_value=MOCK_TOKENS
        ):
            response = self.client.post(
                "/api/users/login/",
                {
                    "email": "thomas.jefferson@example.com",
                    "password": "wrongpassword",
                },
            )
        self.assertEqual(response.status_code, 400)

        self.assertEqual(response.json(), {"msg": "Credentials missing"})

    def test_api_users_login_credentials_invalid(self):
        """Attempting a login with invalid credentials should return an error."""
        UserFactory(username="thomas")
        with mock.patch(
            "magnify.apps.core.utils.get_tokens_for_user", return_value=MOCK_TOKENS
        ):
            response = self.client.post(
                "/api/users/login/",
                {
                    "username": "thomas",
                    "password": "wrongpassword",
                },
            )
        self.assertEqual(response.status_code, 401)

        self.assertEqual(response.json(), {"msg": "Invalid credentials"})

    def test_api_users_change_password_anonymous(self):
        """Anonymous users sbould not be allowed to call the `change-password` endpoint."""
        response = self.client.post(
            "/api/users/change-password/",
            {
                "current_password": "password",
                "new_password": "newPassword",
            },
        )
        self.assertEqual(response.status_code, 401)

    def test_api_users_change_password_authenticated_success(self):
        """The user should be able to change its password from the dedicated endpoint."""
        user = UserFactory()
        jwt_token = AccessToken.for_user(user)

        response = self.client.post(
            "/api/users/change-password/",
            {
                "current_password": "password",
                "new_password": "newPassword",
            },
            HTTP_AUTHORIZATION=f"Bearer {jwt_token}",
        )
        self.assertEqual(response.status_code, 204)

        # Check that the password was actually changed
        with mock.patch(
            "magnify.apps.core.utils.get_tokens_for_user", return_value=MOCK_TOKENS
        ):
            # The old password should not work anymore
            response = self.client.post(
                "/api/users/login/",
                {
                    "username": user.username,
                    "password": "password",
                },
            )
            self.assertEqual(response.status_code, 401)

            # The new password should work
            response = self.client.post(
                "/api/users/login/",
                {
                    "username": user.username,
                    "password": "newPassword",
                },
            )
            self.assertEqual(response.status_code, 200)

    def test_api_users_change_password_authenticated_wrong(self):
        """Changing the password should fail if the password is wrong."""
        user = UserFactory()
        jwt_token = AccessToken.for_user(user)

        response = self.client.post(
            "/api/users/change-password/",
            {
                "current_password": "wrongPassword",
                "new_password": "newPassword",
            },
            HTTP_AUTHORIZATION=f"Bearer {jwt_token}",
        )
        self.assertEqual(response.status_code, 400)
        self.assertEqual(
            response.json(), {"current_password": ["Password does not match"]}
        )

        # Check that the password was not changed
        with mock.patch(
            "magnify.apps.core.utils.get_tokens_for_user", return_value=MOCK_TOKENS
        ):
            # The old password should still work
            response = self.client.post(
                "/api/users/login/",
                {
                    "username": user.username,
                    "password": "password",
                },
            )
            self.assertEqual(response.status_code, 200)

            # The new password should not work anymore
            response = self.client.post(
                "/api/users/login/",
                {
                    "username": user.username,
                    "password": "newPassword",
                },
            )
            self.assertEqual(response.status_code, 401)
