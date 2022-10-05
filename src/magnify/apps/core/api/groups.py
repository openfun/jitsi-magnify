"""Magnify core API endpoints"""
from rest_framework import mixins, response, viewsets

from .. import models
from .. import permissions as magnify_permissions
from .. import serializers


class GroupViewSet(
    mixins.CreateModelMixin,
    mixins.DestroyModelMixin,
    mixins.RetrieveModelMixin,
    mixins.UpdateModelMixin,
    viewsets.GenericViewSet,
):
    """
    API endpoints to access and perform actions on groups.
    """

    permission_classes = [magnify_permissions.IsGroupAdministrator]
    queryset = models.Group.objects.all()
    serializer_class = serializers.GroupSerializer

    def list(self, request, *args, **kwargs):
        """Limit listed groups to the ones in which the authenticated user is administator."""
        queryset = self.filter_queryset(self.get_queryset())
        if self.request.user.is_authenticated:
            queryset = queryset.filter(administrators=self.request.user)

        page = self.paginate_queryset(queryset)
        if page is not None:
            serializer = self.get_serializer(page, many=True)
            return self.get_paginated_response(serializer.data)

        serializer = self.get_serializer(queryset, many=True)
        return response.Response(serializer.data)
