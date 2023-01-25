"""
Django settings for magnify project.
"""
import json
import os

from django.utils.translation import gettext_lazy as _

# pylint: disable=ungrouped-imports
import sentry_sdk
from configurations import Configuration, values
from sentry_sdk.integrations.django import DjangoIntegration

from magnify.apps.core.settings.mixins import MagnifyCoreConfigurationMixin

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
DATA_DIR = os.path.join("/", "data")


def get_release():
    """Get the current release of the application.

    By release, we mean the release from the version.json file à la Mozilla [1]
    (if any). If this file has not been found, it defaults to "NA".

    [1]
    https://github.com/mozilla-services/Dockerflow/blob/master/docs/version_object.md
    """
    # Try to get the current release from the version.json file generated by the
    # CI during the Docker image build
    try:
        with open(os.path.join(BASE_DIR, "version.json"), encoding="utf8") as version:
            return json.load(version)["version"]
    except FileNotFoundError:
        return "NA"  # Default: not available


class Base(MagnifyCoreConfigurationMixin, Configuration):
    """
    This is the base configuration every configuration (aka environnement) should inherit from. It
    is recommended to configure third-party applications by creating a configuration mixins in
    ./configurations and compose the Base configuration with those mixins.

    It depends on an environment variable that SHOULD be defined:

    * DJANGO_SECRET_KEY

    You may also want to override default configuration by setting the following environment
    variables:

    * DJANGO_SENTRY_DSN
    * magnify_ES_HOST
    * DB_NAME
    * DB_HOST
    * DB_PASSWORD
    * DB_USER
    """

    DEBUG = False

    SITE_ID = 1

    # Security
    ALLOWED_HOSTS = []
    CSRF_TRUSTED_ORIGINS = values.ListValue([])
    SECRET_KEY = values.Value(None)

    # CORS headers
    CORS_ALLOWED_ORIGINS = values.ListValue([])

    # System check reference:
    # https://docs.djangoproject.com/en/2.2/ref/checks/#security
    SILENCED_SYSTEM_CHECKS = values.ListValue(
        [
            # Allow the X_FRAME_OPTIONS to be set to "SAMEORIGIN"
            "security.W019"
        ]
    )

    REST_FRAMEWORK = {
        "ALLOWED_VERSIONS": ("1.0",),
        "DEFAULT_AUTHENTICATION_CLASSES": values.ListValue(
            ["rest_framework_simplejwt.authentication.JWTAuthentication"],
            environ_name="DRF_DEFAULT_AUTHENTICATION_CLASSES",
            environ_prefix=None,
        ),
        "DEFAULT_PAGINATION_CLASS": "rest_framework.pagination.PageNumberPagination",
        "PAGE_SIZE": 100,
        "DEFAULT_VERSION": "1.0",
        "DEFAULT_VERSIONING_CLASS": "rest_framework.versioning.URLPathVersioning",
        "EXCEPTION_HANDLER": "magnify.apps.core.api.exception_handler",
    }

    # Frontend
    FRONTEND_CONFIGURATION = {
        "API_URL": values.Value(environ_name="MAGNIFY_API_URL", environ_prefix=None),
        "KEYCLOAK_URL": values.Value(environ_name="KEYCLOAK_URL", environ_prefix=None),
        "KEYCLOAK_REALM": values.Value(
            "magnify", environ_name="KEYCLOAK_REALM", environ_prefix=None
        ),
        "KEYCLOAK_CLIENT_ID": values.Value(
            "magnify-front", environ_name="KEYCLOAK_CLIENT_ID", environ_prefix=None
        ),
        "KEYCLOAK_EXPIRATION_SECONDS": values.IntegerValue(
            30 * 60,
            environ_name="KEYCLOAK_EXPIRATION_SECONDS",
            environ_prefix=None,
        ),
    }

    # Application definition
    ROOT_URLCONF = "urls"
    WSGI_APPLICATION = "wsgi.application"

    AUTH_USER_MODEL = "core.User"

    JITSI_CONFIGURATION = {
        "jitsi_domain": values.Value(environ_name="JITSI_DOMAIN", environ_prefix=None),
        "jitsi_app_id": values.Value(environ_name="JITSI_APP_ID", environ_prefix=None),
        "jitsi_secret_key": values.Value(
            environ_name="JITSI_SECRET_KEY", environ_prefix=None
        ),
        "jitsi_xmpp_domain": values.Value(
            environ_name="JITSI_XMPP_DOMAIN", environ_prefix=None
        ),
        "jitsi_guest_avatar": values.Value(
            "", environ_name="JITSI_GUEST_AVATAR", environ_prefix=None
        ),
        "jitsi_guest_username": values.Value(
            "Guest", environ_name="JITSI_GUEST_USERNAME", environ_prefix=None
        ),
        "jitsi_token_expiration_seconds": values.Value(
            300, environ_name="JITSI_TOKEN_EXPIRATION_SECONDS", environ_prefix=None
        ),
    }

    ALLOW_UNREGISTERED_ROOMS = values.BooleanValue(
        True, environ_name="MAGNIFY_ALLOW_UNREGISTERED_ROOMS", environ_prefix=None
    )

    # Database
    DATABASES = {
        "default": {
            "ENGINE": values.Value(
                "django.db.backends.postgresql_psycopg2",
                environ_name="DB_ENGINE",
                environ_prefix=None,
            ),
            "NAME": values.Value(
                "magnify", environ_name="DB_NAME", environ_prefix=None
            ),
            "USER": values.Value(
                "magnify", environ_name="DB_USER", environ_prefix=None
            ),
            "PASSWORD": values.Value(
                "pass", environ_name="DB_PASSWORD", environ_prefix=None
            ),
            "HOST": values.Value(
                "postgresql", environ_name="DB_HOST", environ_prefix=None
            ),
            "PORT": values.Value(5432, environ_name="DB_PORT", environ_prefix=None),
        }
    }
    DEFAULT_AUTO_FIELD = "django.db.models.AutoField"
    MIGRATION_MODULES = {}

    # Static files (CSS, JavaScript, Images)
    STATIC_URL = "/static/"
    MEDIA_URL = "/media/"
    MEDIA_ROOT = os.path.join(DATA_DIR, "media")
    STATIC_ROOT = os.path.join(DATA_DIR, "static")

    # Simple JWT
    SIMPLE_JWT = {
        "ALGORITHM": values.Value(
            "RS256", environ_name="MAGNIFY_JWT_ALGORITHM", environ_prefix=None
        ),
        "JWK_URL": values.Value(
            None, environ_name="MAGNIFY_JWT_JWK_URL", environ_prefix=None
        ),
        "SIGNING_KEY": values.Value(
            None, environ_name="MAGNIFY_JWT_SIGNING_KEY", environ_prefix=None
        ),
        "VERIFYING_KEY": values.Value(
            None, environ_name="MAGNIFY_JWT_VERIFYING_KEY", environ_prefix=None
        ),
        "AUTH_HEADER_TYPES": ("Bearer",),
        "AUTH_HEADER_NAME": "HTTP_AUTHORIZATION",
        "TOKEN_TYPE_CLAIM": "typ",
        "USER_ID_FIELD": "jwt_sub",
        "USER_ID_CLAIM": "sub",
        "AUTH_TOKEN_CLASSES": ("magnify.apps.core.tokens.BearerToken",),
    }
    JWT_USER_FIELDS_SYNC = values.DictValue(
        {
            "email": "email",
            "name": "name",
            "username": "preferred_username",
        },
        environ_name="MAGNIFY_JWT_USER_FIELDS_SYNC",
        environ_prefix=None,
    )

    # Login/registration related settings
    LOGIN_REDIRECT_URL = "/"
    LOGOUT_REDIRECT_URL = "/"

    AUTHENTICATION_BACKENDS = ("django.contrib.auth.backends.ModelBackend",)

    # Internationalization
    TIME_ZONE = "UTC"
    USE_I18N = True
    USE_L10N = True
    USE_TZ = True

    # Templates
    TEMPLATES = [
        {
            "BACKEND": "django.template.backends.django.DjangoTemplates",
            "DIRS": [os.path.join(BASE_DIR, "templates")],
            "OPTIONS": {
                "context_processors": [
                    "django.contrib.auth.context_processors.auth",
                    "django.contrib.messages.context_processors.messages",
                    "django.template.context_processors.i18n",
                    "django.template.context_processors.debug",
                    "django.template.context_processors.request",
                    "django.template.context_processors.media",
                    "django.template.context_processors.csrf",
                    "django.template.context_processors.tz",
                    "django.template.context_processors.static",
                ],
                "loaders": [
                    "django.template.loaders.filesystem.Loader",
                    "django.template.loaders.app_directories.Loader",
                ],
            },
        }
    ]

    MIDDLEWARE = (
        "django.middleware.security.SecurityMiddleware",
        "whitenoise.middleware.WhiteNoiseMiddleware",
        "django.contrib.sessions.middleware.SessionMiddleware",
        "django.middleware.csrf.CsrfViewMiddleware",
        "django.contrib.auth.middleware.AuthenticationMiddleware",
        "django.contrib.messages.middleware.MessageMiddleware",
        "django.middleware.locale.LocaleMiddleware",
        "django.middleware.common.CommonMiddleware",
        "django.middleware.clickjacking.XFrameOptionsMiddleware",
        "corsheaders.middleware.CorsMiddleware",
        "dockerflow.django.middleware.DockerflowMiddleware",
    )

    # Swagger
    SWAGGER_SETTINGS = {
        "SECURITY_DEFINITIONS": {
            "Bearer": {"type": "apiKey", "name": "Authorization", "in": "header"},
        }
    }

    # Django applications from the highest priority to the lowest
    INSTALLED_APPS = (
        # magnify stuff
        "magnify.apps.core",
        "magnify",
        # Third party apps
        "corsheaders",
        "dockerflow.django",
        "parler",
        "rest_framework",
        "drf_yasg",
        # Django
        "django.contrib.auth",
        "django.contrib.contenttypes",
        "django.contrib.sessions",
        "django.contrib.admin",
        "django.contrib.sites",
        "django.contrib.sitemaps",
        "django.contrib.staticfiles",
        "django.contrib.messages",
        "django.contrib.humanize",
    )

    # Languages
    # - Django
    LANGUAGE_CODE = "en"

    # Careful! Languages should be ordered by priority, as this tuple is used to get
    # fallback/default languages throughout the app.
    # Use "en" as default as it is the language that is most likely to be spoken by any visitor
    # when their preferred language, whatever it is, is unavailable
    LANGUAGES = (("en", _("English")), ("fr", _("French")))

    # Logging
    LOGGING = {
        "version": 1,
        "disable_existing_loggers": True,
        "formatters": {
            "verbose": {
                "format": "%(levelname)s %(asctime)s %(module)s "
                "%(process)d %(thread)d %(message)s"
            }
        },
        "handlers": {
            "console": {
                "level": "DEBUG",
                "class": "logging.StreamHandler",
                "formatter": "verbose",
            }
        },
        "loggers": {
            "django.db.backends": {
                "level": "ERROR",
                "handlers": ["console"],
                "propagate": False,
            }
        },
    }

    # Cache
    CACHES = {
        "default": {
            "BACKEND": values.Value(
                "django.core.cache.backends.locmem.LocMemCache",
                environ_name="CACHE_DEFAULT_BACKEND",
                environ_prefix=None,
            ),
            "LOCATION": values.Value(
                "", environ_name="CACHE_DEFAULT_LOCATION", environ_prefix=None
            ),
            "OPTIONS": values.DictValue(
                {}, environ_name="CACHE_DEFAULT_OPTIONS", environ_prefix=None
            ),
        },
    }

    # Sentry
    SENTRY_DSN = values.Value(None, environ_name="SENTRY_DSN")

    @classmethod
    def _get_environment(cls):
        """Environment in which the application is launched."""
        return cls.__name__.lower()

    # pylint: disable=invalid-name
    @property
    def ENVIRONMENT(self):
        """Environment in which the application is launched."""
        return self._get_environment()

    # pylint: disable=invalid-name
    @property
    def RELEASE(self):
        """
        Return the release information.

        Delegate to the module function to enable easier testing.
        """
        return get_release()

    @classmethod
    def post_setup(cls):
        """Post setup configuration.
        This is the place where you can configure settings that require other
        settings to be loaded.
        """
        super().post_setup()

        # The SENTRY_DSN setting should be available to activate sentry for an environment
        if cls.SENTRY_DSN is not None:
            sentry_sdk.init(  # pylint: disable=abstract-class-instantiated
                dsn=cls.SENTRY_DSN,
                environment=cls._get_environment(),
                release=get_release(),
                integrations=[DjangoIntegration()],
            )
            with sentry_sdk.configure_scope() as scope:
                scope.set_extra("application", "backend")


class Build(Base):
    """Build environment settings"""

    SECRET_KEY = "ThisIsAnExampleKeyForBuildPurposeOnly"  # nosec
    JWT_JITSI_SECRET_KEY = "ThisIsAnExampleKeyForBuildPurposeOnly"  # nosec

    STATICFILES_STORAGE = "whitenoise.storage.CompressedManifestStaticFilesStorage"


class Development(Base):
    """
    Development environment settings

    We set DEBUG to True and configure the server to respond from all hosts.
    """

    DEBUG = True
    ALLOWED_HOSTS = ["*"]
    CORS_ALLOW_ALL_ORIGINS = True
    CSRF_TRUSTED_ORIGINS = ["http://localhost:8071"]

    @classmethod
    def post_setup(cls):
        """Post setup configuration.
        Activate local Keycloak as authentication backend for development.
        """
        super().post_setup()
        cls.REST_FRAMEWORK["DEFAULT_AUTHENTICATION_CLASSES"] = (
            "magnify.apps.core.authentication.DelegatedJWTAuthentication",
            "rest_framework.authentication.SessionAuthentication",
        )


class Test(Base):
    """Test environment settings"""

    JITSI_CONFIGURATION = {
        "jitsi_domain": "meeting.education",
        "jitsi_guest_avatar": "",
        "jitsi_guest_default_password": "default",
        "jitsi_guest_username": "guest",
        "jitsi_xmpp_domain": "meet.jitsi",
        "jitsi_secret_key": "ThisIsAnExampleKeyForTestPurposeOnly",
        "jitsi_app_id": "app_id",
        "jitsi_token_expiration_seconds": 300,
    }
    SIMPLE_JWT = {
        "USER_ID_FIELD": "jwt_sub",
        "USER_ID_CLAIM": "sub",
    }


class ContinuousIntegration(Test):
    """
    Continuous Integration environment settings

    nota bene: it should inherit from the Test environment.
    """

    ALLOWED_HOSTS = ["*"]
    CORS_ALLOW_ALL_ORIGINS = True
    CSRF_TRUSTED_ORIGINS = ["http://localhost:8070"]


class Production(Base):
    """Production environment settings

    You must define the DJANGO_ALLOWED_HOSTS and DJANGO_SECRET_KEY environment
    variables in Production configuration (and derived configurations):

    DJANGO_ALLOWED_HOSTS="foo.com,foo.fr"
    DJANGO_SECRET_KEY="your-secret-key"
    """

    # Security
    SECRET_KEY = values.SecretValue()
    ALLOWED_HOSTS = values.ListValue([])
    CSRF_COOKIE_SECURE = True
    SECURE_BROWSER_XSS_FILTER = True
    SECURE_CONTENT_TYPE_NOSNIFF = True
    SESSION_COOKIE_SECURE = True

    # For static files in production, we want to use a backend that includes a hash in
    # the filename, that is calculated from the file content, so that browsers always
    # get the updated version of each file.
    STATICFILES_STORAGE = values.Value(
        "whitenoise.storage.CompressedManifestStaticFilesStorage"
    )


class Feature(Production):
    """
    Feature environment settings

    nota bene: it should inherit from the Production environment.
    """


class Staging(Production):
    """
    Staging environment settings

    nota bene: it should inherit from the Production environment.
    """


class PreProduction(Production):
    """
    Pre-production environment settings

    nota bene: it should inherit from the Production environment.
    """
