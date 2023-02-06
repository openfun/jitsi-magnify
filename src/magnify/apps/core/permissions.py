"""Permission handlers for Magnify's core app."""
from django.conf import settings

from rest_framework import permissions

from .models import RoleChoices


class IsOwner(permissions.IsAuthenticated):
    """
    Permissions applying to an object with a field "owner".
    """

    def has_object_permission(self, request, view, obj):
        """Object permissions are only given to owners."""

        return obj.owner == request.user


class IsMeetingOwnerPermission(permissions.IsAuthenticated):
    """
    Permissions applying to an object with a field "meeting".
    """

    def has_object_permission(self, request, view, obj):
        """Object permissions are only given to meeting owners."""

        return obj.meeting.owner == request.user


class IsSelf(permissions.BasePermission):
    """
    Allow a request to proceed only if the authenticated user is the targeted object itself.
    """

    def has_permission(self, request, view):
        """
        Allow the request.
        Only if the user is logged-in and sts and the current logged in user is one
        of its administrator.
        """
        if view.action == "create":
            return (
                getattr(settings, "ALLOW_API_USER_CREATE", False)
                and not request.user.is_authenticated
            )

        if view.action in ["list", "retrieve"]:
            return request.user.is_authenticated

        return True

    def has_object_permission(self, request, view, obj):
        """Write permissions are only allowed to the user itself."""
        if request.method in permissions.SAFE_METHODS:
            return True

        return obj == request.user


class IsGroupAdministrator(permissions.BasePermission):
    """
    Allow a request to proceed only if the user is listed as administrator via a simple
    "administrators" many-to-many.
    """

    def has_permission(self, request, view):
        """Only allow authenticated users for unsafe methods."""
        return request.user.is_authenticated

    def has_object_permission(self, request, view, obj):
        """Object permissions are only given to administrators of the room."""
        user = request.user
        return user in obj.administrators.all()


class RoomPermissions(permissions.BasePermission):
    """
    Permissions applying to the room API endpoint.
    """

    def has_permission(self, request, view):
        """Only allow authenticated users for unsafe methods."""
        if request.method in permissions.SAFE_METHODS:
            return True

        return request.user.is_authenticated

    def has_object_permission(self, request, view, obj):
        """Object permissions are only given to administrators of the room."""

        if request.method in permissions.SAFE_METHODS:
            return True

        user = request.user

        if request.method == "DELETE":
            return obj.is_owner(user)

        return obj.is_administrator(user)


class ResourceAccessPermission(permissions.BasePermission):
    """
    Permissions for a room that can only be updated by room administrators.
    """

    def has_permission(self, request, view):
        """Only allow authenticated users."""
        return request.user.is_authenticated

    def has_object_permission(self, request, view, obj):
        """
        Check that the logged-in user is administrator of the linked room.
        """
        user = request.user
        if request.method == "DELETE" and obj.role == RoleChoices.OWNER:
            return obj.user == user

        return obj.resource.is_administrator(user)
