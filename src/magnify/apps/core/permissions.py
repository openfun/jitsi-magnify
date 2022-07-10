"""Permission handlers for Magnify's core app."""
from rest_framework import permissions


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
        if view.action in ["list", "retrieve"]:
            return request.user.is_authenticated

        return True

    def has_object_permission(self, request, view, obj):
        """Write permissions are only allowed to the user itself."""
        if request.method in permissions.SAFE_METHODS:
            return True

        return obj == request.user


class IsObjectAdministrator(permissions.BasePermission):
    """
    Allow a request to proceed only if the user is listed as administrator to the targeted object.
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
        return obj.user_accesses.filter(
            is_administrator=True, user=user
        ) or obj.group_accesses.filter(
            is_administrator=True, group__user_accesses__user=user
        )


class IsRoomAdministrator(permissions.BasePermission):
    """
    Permissions for a room that can only be updated by room administrators.
    """

    def has_permission(self, request, view):
        """Only allow authenticated users."""
        return request.user.is_authenticated

    def has_object_permission(self, request, view, obj):
        """Check that the logged-in user is adminisrator of the linked room."""
        user = request.user
        return user.is_authenticated and (
            obj.user_accesses.filter(is_administrator=True, user=user)
            or obj.group_accesses.filter(
                is_administrator=True, group__user_accesses__user=user
            )
        )


class HasRoomAccess(permissions.BasePermission):
    """Permissions for access to an object related to a room."""

    def has_object_permission(self, request, view, obj):
        """Check that the logged-in user is adminisrator of the linked room."""
        user = request.user
        return (
            obj.is_public
            or user.is_authenticated
            and (
                obj.user_accesses.filter(user=user)
                or obj.group_accesses.filter(group__user_accesses__user=user)
            )
        )
