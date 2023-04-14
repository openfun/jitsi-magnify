"""
Tests for API endpoint for frontend configuration.
"""
from django.test.utils import override_settings

from rest_framework.test import APITestCase


class FrontendConfigurationTestCase(APITestCase):
    """Test requests on magnify's core app frontend configuration endpoint."""

    def test_api_get_frontend_configuration_default(self):
        """Any user should be able to get frontend configuration."""

        response = self.client.get("/api/config.json")

        self.assertEqual(
            response.json(),
            {
                "API_URL": "http://localhost:8070/api",
                "JITSI_DOMAIN": "meeting.education",
                "KEYCLOAK_URL": "http://localhost:8080",
                "KEYCLOAK_REALM": "magnify",
                "KEYCLOAK_CLIENT_ID": "magnify-front",
                "KEYCLOAK_EXPIRATION_SECONDS": 1800,
                "LANGUAGE_CODE": "en",
                "SHOW_REGISTER_LINK": True,
            },
        )

    @override_settings(
        JITSI_CONFIGURATION={
            "jitsi_domain": "example.com",
        },
        FRONTEND_CONFIGURATION={
            "API_URL": "http://api.example.com/api",
            "KEYCLOAK_URL": "http://kc.example.com",
            "KEYCLOAK_REALM": "example",
            "KEYCLOAK_CLIENT_ID": "example-front",
            "KEYCLOAK_EXPIRATION_SECONDS": 18000,
            "LANGUAGE_CODE": "fr",
        },
    )
    def test_api_get_frontend_configuration_from_settings(self):
        """Any user should be able to get frontend configuration."""

        response = self.client.get("/api/config.json")

        self.assertEqual(
            response.json(),
            {
                "API_URL": "http://api.example.com/api",
                "JITSI_DOMAIN": "example.com",
                "KEYCLOAK_URL": "http://kc.example.com",
                "KEYCLOAK_REALM": "example",
                "KEYCLOAK_CLIENT_ID": "example-front",
                "KEYCLOAK_EXPIRATION_SECONDS": 18000,
                "LANGUAGE_CODE": "fr",
            },
        )
