"""
Template context processors
"""
import json

from django.conf import settings
from django.contrib.sites.models import Site
from django.http.request import HttpRequest
from django.middleware.csrf import get_token


def site_metas(request: HttpRequest):
    """
    Context processor to add all information required by the frontend.

    If `CDN_DOMAIN` settings is defined we add it in the context. It allows
    to load statics js on a CDN like cloudfront.
    """
    site_current = Site.objects.get_current()
    protocol = "https" if request.is_secure() else "http"

    context = {
        "SITE": {
            "name": site_current.name,
            "domain": site_current.domain,
            "web_url": f"{protocol:s}://{site_current.domain:s}",
        },
        "FRONTEND_CONTEXT": {
            "context": {
                "csrftoken": get_token(request),
                "environment": getattr(settings, "ENVIRONMENT", ""),
                "release": getattr(settings, "RELEASE", ""),
                "sentry_dsn": getattr(settings, "SENTRY_DSN", ""),
            }
        },
    }

    if getattr(settings, "CDN_DOMAIN", None):
        context["CDN_DOMAIN"] = settings.CDN_DOMAIN

    context["FRONTEND_CONTEXT"] = json.dumps(context["FRONTEND_CONTEXT"])

    return context
