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
    Allow a request to proceed only if the user is listed as admin to the targeted object.
    """

    def has_permission(self, request, view):
        """Allow authenticated users."""
        return request.user.is_authenticated

    def has_object_permission(self, request, view, obj):
        """Object permissions are only given to administrators of the room."""
        if request.method in permissions.SAFE_METHODS:
            return True

        return request.user in obj.administrators.all()
