"""Tokens for Magnify's core app."""
from rest_framework_simplejwt.settings import api_settings
from rest_framework_simplejwt.tokens import Token


class BearerToken(Token):
    """Bearer token as emitted by Keycloak OIDC for example."""

    token_type = "Bearer"  # nosec
    lifetime = api_settings.ACCESS_TOKEN_LIFETIME
