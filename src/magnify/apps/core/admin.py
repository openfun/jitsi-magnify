"""Admin classes and registrations for Magnify's core app."""
from django.contrib import admin

from .models import ResourceAccess, Room, User


@admin.register(User)
class UserAdmin(admin.ModelAdmin):
    """User admin interface declaration."""


class ResourceAccessInline(admin.TabularInline):
    """Admin class for the room user access model"""

    model = ResourceAccess
    extra = 0


@admin.register(Room)
class RoomAdmin(admin.ModelAdmin):
    """Room admin interface declaration."""

    inlines = (ResourceAccessInline,)
