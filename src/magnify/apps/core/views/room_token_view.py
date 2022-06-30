"""Module to generate the token for the room"""

from urllib.parse import urlencode

from django.conf import settings
from django.http import HttpResponse, HttpResponseRedirect
from django.utils.http import url_has_allowed_host_and_scheme

from rest_framework.views import APIView

from magnify.apps.core.utils import generate_token


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
