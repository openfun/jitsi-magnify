"""Magnify rooms API endpoints"""
import uuid

from django.conf import settings
from django.db.models import Q
from django.http import Http404
from django.shortcuts import get_object_or_404
from django.utils.text import slugify

from rest_framework import decorators as drf_decorators
from rest_framework import mixins, permissions, response, viewsets
from rest_framework.exceptions import PermissionDenied

from .. import forms, models
from .. import permissions as magnify_permissions
from .. import serializers, utils


class RoomViewSet(
    mixins.CreateModelMixin,
    mixins.DestroyModelMixin,
    mixins.UpdateModelMixin,
    viewsets.GenericViewSet,
):
    """
    API endpoints to access and perform actions on rooms.
    """

    permission_classes = [magnify_permissions.RoomPermissions]
    queryset = models.Room.objects.all()
    serializer_class = serializers.RoomSerializer

    def get_object(self):
        """Allow getting a room by its slug."""
        try:
            uuid.UUID(self.kwargs["pk"])
            filter_kwargs = {"pk": self.kwargs["pk"]}
        except ValueError:
            filter_kwargs = {"slug": slugify(self.kwargs["pk"])}
        queryset = self.filter_queryset(self.get_queryset())
        obj = get_object_or_404(queryset, **filter_kwargs)
        # May raise a permission denied
        self.check_object_permissions(self.request, obj)
        return obj

    def retrieve(self, request, *args, **kwargs):
        """
        Allow unregistered rooms when activated.
        For unregistered rooms we only return a null id and the jitsi room and token.
        """
        try:
            instance = self.get_object()
        except Http404:
            if not settings.ALLOW_UNREGISTERED_ROOMS:
                raise
            slug = slugify(self.kwargs["pk"])
            guest = self.request.GET.get("guest")
            data = {
                "id": None,
                "livekit": {
                    "room": slug,
                    "token": utils.generate_token(request.user, slug, guest, is_admin=False, is_temp_room=True),
                },
            }
        else:
            data = self.get_serializer(instance).data

        return response.Response(data)

    def list(self, request, *args, **kwargs):
        """Limit listed rooms to the ones related to the authenticated user."""
        user = self.request.user

        if user.is_authenticated:
            queryset = (
                self.filter_queryset(self.get_queryset())
                .filter(
                    Q(users=user)
                    | Q(groups__members=user)
                    | Q(groups__administrators=user)
                )
                .distinct()
            )
        else:
            queryset = self.get_queryset().none()

        page = self.paginate_queryset(queryset)
        if page is not None:
            serializer = self.get_serializer(page, many=True)
            return self.get_paginated_response(serializer.data)

        serializer = self.get_serializer(queryset, many=True)
        return response.Response(serializer.data)

    def perform_create(self, serializer):
        """Set the current user as owner of the newly created room."""
        room = serializer.save()
        models.ResourceAccess.objects.create(
            resource=room,
            user=self.request.user,
            role=models.RoleChoices.OWNER,
        )

    @drf_decorators.action(
        methods=["get"],
        detail=True,
        url_path="meetings",
    )
    # pylint: disable=invalid-name, unused-argument, too-many-locals
    def meetings(self, request, pk=None):
        """Endpoint to retrieve meetings related to the room."""
        room = self.get_object()

        # Instantiate the form to allow validation/cleaning
        filter_form = forms.MeetingFilterForm(data=request.query_params)

        # Return a 400 with error information if the query params are not valid
        if not filter_form.is_valid():
            return response.Response(status=400, data={"errors": filter_form.errors})

        # Filter meetings by time range
        filter_from = filter_form.cleaned_data["from"]
        filter_to = filter_form.cleaned_data["to"]
        meetings_query = room.meetings.filter(
            Q(
                recurrence__isnull=True,
                end__gte=filter_from,
                start__lte=filter_to,
            )
            | (
                Q(recurrence__isnull=False, start__lte=filter_to)
                & (
                    Q(recurring_until__gte=filter_from)
                    | Q(recurring_until__isnull=True)
                )
            )
        )

        # Filter meetings to which the authenticated user is related
        user = request.user
        access_clause = Q(is_public=True)
        if user.is_authenticated:
            access_clause |= (
                Q(owner=user)
                | Q(users=user)
                | Q(groups__members=user)
                | Q(groups__administrators=user)
            )
        meetings_query = meetings_query.filter(access_clause)

        serializer = serializers.MeetingSerializer(
            meetings_query.distinct(), context={"request": request}, many=True
        )
        return response.Response(serializer.data, status=200)


class ResourceAccessListModelMixin:
    """List mixin for resource access API."""

    def get_permissions(self):
        """User only needs to be authenticated to list rooms access"""
        if self.action == "list":
            permission_classes = [permissions.IsAuthenticated]
        else:
            return super().get_permissions()

        return [permission() for permission in permission_classes]

    def get_queryset(self):
        """Return the queryset according to the action."""
        queryset = super().get_queryset()
        if self.action == "list":
            user = self.request.user
            queryset = queryset.filter(
                Q(resource__accesses__user=user)
                | Q(resource__accesses__group__members=user)
                | Q(resource__accesses__group__administrators=user),
                resource__accesses__role__in=[
                    models.RoleChoices.ADMIN,
                    models.RoleChoices.OWNER,
                ],
            ).distinct()
        return queryset


class ResourceAccessViewSet(
    ResourceAccessListModelMixin,
    mixins.CreateModelMixin,
    mixins.DestroyModelMixin,
    mixins.ListModelMixin,
    mixins.RetrieveModelMixin,
    mixins.UpdateModelMixin,
    viewsets.GenericViewSet,
):
    """
    API endpoints to access and perform actions on resource accesses.
    """

    permission_classes = [magnify_permissions.ResourceAccessPermission]
    queryset = models.ResourceAccess.objects.all()
    serializer_class = serializers.ResourceAccessSerializer

    def perform_create(self, serializer):
        """
        When creating a resource access for a group, ensure that the logged-in user is
        administrator of the related group.
        """
        user = self.request.user
        group = serializer.validated_data.get("group")
        if group and not (user and group.administrators.filter(id=user.id).exists()):
            raise PermissionDenied(
                "You must be administrator of a group to give it access to a resource."
            )
        return super().perform_create(serializer)
