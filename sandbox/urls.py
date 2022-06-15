"""
FUN CMS urls
"""
from django.conf import settings
from django.conf.urls.i18n import i18n_patterns
from django.contrib import admin
from django.contrib.staticfiles.urls import staticfiles_urlpatterns
from django.urls import include, path
from django.views.static import serve

from magnify.apps.core.urls import urlpatterns as core_urlpatterns

# For now, we use URLPathVersioning to be consistent with fonzie. Fonzie uses it
# because DRF OpenAPI only supports URLPathVersioning for now.
# See fonzie API_PREFIX config for more information.
API_PREFIX = r"v(?P<version>[0-9]+\.[0-9]+)"

admin.autodiscover()
admin.site.enable_nav_sidebar = False


urlpatterns = [
    path("api/", include(core_urlpatterns)),
]

urlpatterns += i18n_patterns(
    path("admin/", admin.site.urls),
)

# This is only needed when using runserver.
if settings.DEBUG:
    urlpatterns = (
        [
            path(
                r"media/<path:path>",
                serve,
                {"document_root": settings.MEDIA_ROOT, "show_indexes": True},
            )
        ]
        + staticfiles_urlpatterns()
        + urlpatterns
    )
