"""Jitsi magnify Core application"""
from django.apps import AppConfig
from django.utils.translation import gettext_lazy as _


class CoreConfig(AppConfig):
    """Configuration class for the jitsi magnify core app."""

    name = "jitsi_magnify.core"
    verbose_name = _("Jitsi magnify's core application")
