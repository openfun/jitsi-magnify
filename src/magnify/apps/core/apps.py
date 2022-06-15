"""Magnify Core application"""
from django.apps import AppConfig
from django.utils.translation import gettext_lazy as _


class CoreConfig(AppConfig):
    """Configuration class for the magnify core app."""

    name = "magnify.apps.core"
    verbose_name = _("Magnify's core application")
