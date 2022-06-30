"""
Utils that can be useful throughout Magnify's core app
"""
from datetime import timedelta

from django.conf import settings
from django.utils import timezone

import jwt


def create_token_payload(user, room):
    """Create the payload so that it contains each information jitsi requires"""
    expiration_seconds = int(settings.JWT_CONFIGURATION.get("token_expiration_seconds"))
    token_payload = {
        "exp": timezone.now() + timedelta(seconds=expiration_seconds),
        "iat": timezone.now(),
        "moderator": True,
        "aud": "jitsi",
        "iss": settings.JWT_CONFIGURATION["jitsi_app_id"],
        "sub": settings.JWT_CONFIGURATION["jitsi_xmpp_domain"],
        "room": room,
    }

    jitsi_user = {
        "avatar": settings.JWT_CONFIGURATION.get("guest_avatar"),
        "name": user.username
        if user.is_authenticated
        else settings.JWT_CONFIGURATION.get("guest_username"),
        "email": user.email if user.is_authenticated else "",
    }

    token_payload["context"] = {"user": jitsi_user}
    return token_payload


def generate_token(user, room):
    """Generate the access token that will give access to the room"""
    token_payload = create_token_payload(user, room)
    token = jwt.encode(
        token_payload,
        settings.JWT_CONFIGURATION["jitsi_secret_key"],
        algorithm="HS256",
    )

    return token
