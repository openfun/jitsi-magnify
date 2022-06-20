"""Module to generate the token for the room"""

from datetime import timedelta
from urllib.parse import urlencode

from django.conf import settings
from django.http import HttpResponse, HttpResponseRedirect
from django.utils import timezone
from django.utils.http import url_has_allowed_host_and_scheme

import jwt
from rest_framework.views import APIView


def create_payload(user, room):
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
    token_payload = create_payload(user, room)
    token = jwt.encode(
        token_payload,
        settings.JWT_CONFIGURATION["jitsi_secret_key"],
        algorithm="HS256",
    )

    return token


class RoomTokenView(APIView):
    """View for token fetching based on a guest user and a specific room
    This redirects to jitsi with the token"""

    def get(self, request, room):
        """Get the token for the room"""
        access_token = generate_token(request.user, room)

        base_url = settings.JWT_CONFIGURATION["jitsi_domain"]
        url_params = {"jwt": access_token}
        encoded_params = urlencode(url_params)
        url = f"https://{base_url}/{room}?{encoded_params}"

        # As we allow users to pass information to redirect url (with the parameter room),
        # we check that this url is safe before redirecting
        if not url_has_allowed_host_and_scheme(
            url, allowed_hosts=base_url, require_https=True
        ):
            return HttpResponse(f"Redirection to url {url} is not allowed", status=403)

        return HttpResponseRedirect(url)
