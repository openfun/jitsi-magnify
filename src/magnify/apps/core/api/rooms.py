"""Magnify rooms API endpoints"""
import uuid
from datetime import date

from django.conf import settings
from django.db.models import F, Q
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
            data = {
                "id": None,
                "jitsi": {
                    "room": slug,
                    "token": utils.generate_token(request.user, slug, is_admin=True),
                },
            }
        else:
            data = self.get_serializer(instance).data

        return response.Response(data)

    def list(self, request, *args, **kwargs):
        """Limit listed rooms to the ones related to the authenticated user."""
        user = self.request.user
        queryset = self.filter_queryset(self.get_queryset())

        if user.is_authenticated:
            queryset = queryset.filter(
                Q(is_public=True)
                | Q(users=user)
                | Q(groups__members=user)
                | Q(groups__administrators=user)
            ).distinct()
        else:
            queryset = queryset.filter(is_public=True)

        page = self.paginate_queryset(queryset)
        if page is not None:
            serializer = self.get_serializer(page, many=True)
            return self.get_paginated_response(serializer.data)

        serializer = self.get_serializer(queryset, many=True)
        return response.Response(serializer.data)

    def perform_create(self, serializer):
        """Set the current user as owner of the newly created room."""
        room = serializer.save()
        models.RoomUserAccess.objects.create(
            room=room, user=self.request.user, role=models.UserRoleChoices.OWNER
        )

    @drf_decorators.action(
        methods=["get"],
        detail=True,
        url_path="meetings",
        permission_classes=[magnify_permissions.HasRoomAccess],
    )
    # pylint: disable=invalid-name, unused-argument
    def meetings(self, request, pk=None):
        """Endpoint to retrieve meetings related to the room."""
        room = self.get_object()

        # Filter meetings in the date range of interest
        today = date.today()

        # Instantiate the form to allow validation/cleaning
        filter_form = forms.MeetingFilterForm(data=request.query_params)

        # Return a 400 with error information if the query params are not valid
        if not filter_form.is_valid():
            return response.Response(status=400, data={"errors": filter_form.errors})

        # Filter meetings by date range
        start = filter_form.cleaned_data.get("start") or today
        end = filter_form.cleaned_data.get("end") or today
        candidate_meetings = room.meetings.filter(
            Q(
                recurrence__isnull=True,
                start__gte=start - F("expected_duration"),
                start__lte=end,
            )
            | (
                Q(recurrence__isnull=False, start__lte=end)
                & (
                    Q(recurring_until__gte=start - F("expected_duration"))
                    | Q(recurring_until__isnull=True)
                )
            )
        )

        # Filter meetings to which the authenticated user is related
        user = request.user
        access_clause = Q(is_public=True)
        if user.is_authenticated:
            access_clause |= Q(users=user) | Q(groups__members=user)
        candidate_meetings = candidate_meetings.filter(access_clause)

        # Keep only the meetings that actually have an occurrence within the date range and
        # populate the cache field `_occurrences`` with such occurrences.
        meetings = []
        for meeting in candidate_meetings:
            if dates := meeting.get_occurrences(start, end):
                # pylint: disable=protected-access
                meeting._occurrences = {
                    "start": start,
                    "end": end,
                    "dates": dates,
                }
                meetings.append(meeting)

        serializer = serializers.MeetingSerializer(
            meetings, context={"request": request}, many=True
        )
        return response.Response(serializer.data, status=200)


class RoomAccessListModelMixin:
    """List mixin for room access API."""

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
                Q(
                    room__user_accesses__user=user,
                    room__user_accesses__role__in=[
                        models.UserRoleChoices.ADMIN,
                        models.UserRoleChoices.OWNER,
                    ],
                )
                | Q(
                    room__group_accesses__group__members=user,
                    room__group_accesses__role=models.GroupRoleChoices.ADMIN,
                )
            ).distinct()
        return queryset


class RoomUserAccessViewSet(
    RoomAccessListModelMixin,
    mixins.CreateModelMixin,
    mixins.DestroyModelMixin,
    mixins.ListModelMixin,
    mixins.RetrieveModelMixin,
    mixins.UpdateModelMixin,
    viewsets.GenericViewSet,
):
    """
    API endpoints to access and perform actions on room user accesses.
    """

    permission_classes = [magnify_permissions.RoomAccessPermission]
    queryset = models.RoomUserAccess.objects.all()
    serializer_class = serializers.RoomUserAccessSerializer


class RoomGroupAccessViewSet(
    RoomAccessListModelMixin,
    mixins.CreateModelMixin,
    mixins.DestroyModelMixin,
    mixins.ListModelMixin,
    mixins.RetrieveModelMixin,
    mixins.UpdateModelMixin,
    viewsets.GenericViewSet,
):
    """
    API endpoints to access and perform actions on room group accesses.
    """

    permission_classes = [magnify_permissions.RoomAccessPermission]
    queryset = models.RoomGroupAccess.objects.all()
    serializer_class = serializers.RoomGroupAccessSerializer

    def perform_create(self, serializer):
        """
        When creating a room group access, ensure that the logged-in user is administrator
        of the related group.
        """
        user = self.request.user
        group = serializer.validated_data["group"]
        if not (user and group.administrators.filter(id=user.id).exists()):
            raise PermissionDenied(
                "You must be administrator of a group to give it access to a room."
            )
        return super().perform_create(serializer)
