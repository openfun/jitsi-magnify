"""Admin classes and registrations for Magnify's core app."""
from django.contrib import admin

from .models import User


@admin.register(User)
class UserAdmin(admin.ModelAdmin):
    """User admin interface declaration."""
