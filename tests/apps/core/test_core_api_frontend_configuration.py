"""
Tests for API endpoint for frontend configuration.
"""
from django.test.utils import override_settings

from rest_framework.test import APITestCase


class FrontendConfigurationTestCase(APITestCase):
    """Test requests on magnify's core app frontend configuration endpoint."""

    @override_settings(
        JITSI_CONFIGURATION={
            "jitsi_domain": "meeting.education",
        },
        FRONTEND_CONFIGURATION={
            "API_URL": "http://localhost:8070/api",
            "KEYCLOAK_URL": "http://localhost:8080",
            "KEYCLOAK_REALM": "magnify",
            "KEYCLOAK_CLIENT_ID": "magnify-front",
            "KEYCLOAK_EXPIRATION_SECONDS": 1800,
        },
    )
    def test_api_get_frontend_configuration(self):
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
            },
        )
