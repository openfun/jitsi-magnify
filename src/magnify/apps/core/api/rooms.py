"""Magnify rooms API endpoints"""
import uuid
from datetime import date

from django.conf import settings
from django.db.models import F, Q
from django.http import Http404
from django.shortcuts import get_object_or_404

from rest_framework import decorators as drf_decorators
from rest_framework import mixins, permissions, response, viewsets

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

    permission_classes = [magnify_permissions.IsObjectAdministrator]
    queryset = models.Room.objects.all()
    serializer_class = serializers.RoomSerializer

    def get_object(self):
        """Allow getting a room by its slug."""
        try:
            uuid.UUID(self.kwargs["pk"])
            filter_kwargs = {"pk": self.kwargs["pk"]}
        except ValueError:
            filter_kwargs = {"slug": self.kwargs["pk"]}

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
            data = {
                "id": None,
                "jitsi": {
                    "room": self.kwargs["pk"],
                    "token": utils.generate_token(
                        request.user, self.kwargs["pk"], is_admin=True
                    ),
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
            )
        else:
            queryset = queryset.filter(is_public=True)

        page = self.paginate_queryset(queryset)
        if page is not None:
            serializer = self.get_serializer(page, many=True)
            return self.get_paginated_response(serializer.data)

        serializer = self.get_serializer(queryset, many=True)
        return response.Response(serializer.data)

    def perform_create(self, serializer):
        """Set the current user as administrators of the newly created room."""
        room = serializer.save()
        models.RoomUserAccess.objects.create(
            room=room, user=self.request.user, is_administrator=True
        )

    @drf_decorators.action(
        methods=["post"],
        detail=True,
        url_path="users",
        permission_classes=[permissions.IsAuthenticated],
    )
    # pylint: disable=unused-argument,invalid-name
    def users(self, request, pk=None):
        """Adds a user in a room."""
        room = self.get_object()
        serializer = serializers.RoomUserAccessSerializer(
            data={
                "room": room.id,
                "user": request.data.get("user"),
                "is_administrator": request.data.get("is_administrator"),
            },
            context={"request": request},
        )
        serializer.is_valid(raise_exception=True)
        serializer.save()
        headers = self.get_success_headers(serializer.data)
        return response.Response(serializer.data, status=201, headers=headers)

    @drf_decorators.action(
        methods=["get", "put", "delete"],
        detail=True,
        url_path="users/(?P<user_pk>[^/.]+)",
        permission_classes=[magnify_permissions.IsRoomAdministrator],
    )
    # pylint: disable=unused-argument,invalid-name
    def user(self, request, user_pk, pk=None):
        """Get, update, or delete a user of a room."""
        room = self.get_object()
        room_user_access = models.RoomUserAccess.objects.get(
            room=room, user__pk=user_pk
        )

        if request.method == "DELETE":
            room_user_access.delete()
            return response.Response(status=204)

        if request.method == "GET":
            serializer = serializers.RoomUserAccessSerializer(room_user_access)
            return response.Response(serializer.data)

        if request.method == "PUT":
            serializer = serializers.RoomUserAccessSerializer(
                room_user_access,
                data={
                    "room": room.id,
                    "user": user_pk,
                    "is_administrator": request.data.get("is_administrator"),
                },
                context={"request": request},
            )
            serializer.is_valid(raise_exception=True)
            serializer.save()
            return response.Response(serializer.data)

        return response.Response(status=405)

    @drf_decorators.action(
        methods=["post"],
        detail=True,
        url_path="groups",
        permission_classes=[permissions.IsAuthenticated],
    )
    # pylint: disable=unused-argument,invalid-name
    def groups(self, request, pk=None):
        """Adds a group in a room."""
        room = self.get_object()
        serializer = serializers.RoomGroupAccessSerializer(
            data={
                "room": room.id,
                "group": request.data.get("group"),
                "is_administrator": request.data.get("is_administrator"),
            },
            context={"request": request},
        )
        serializer.is_valid(raise_exception=True)
        serializer.save()
        headers = self.get_success_headers(serializer.data)
        return response.Response(serializer.data, status=201, headers=headers)

    @drf_decorators.action(
        methods=["get", "put", "delete"],
        detail=True,
        url_path="groups/(?P<group_pk>[^/.]+)",
        permission_classes=[magnify_permissions.IsRoomAdministrator],
    )
    # pylint: disable=unused-argument,invalid-name
    def group(self, request, group_pk, pk=None):
        """Get, update, or delete a group of a room."""
        room = self.get_object()
        room_group_access = models.RoomGroupAccess.objects.get(
            room=room, group__pk=group_pk
        )

        if request.method == "DELETE":
            room_group_access.delete()
            return response.Response(status=204)

        if request.method == "GET":
            serializer = serializers.RoomGroupAccessSerializer(room_group_access)
            return response.Response(serializer.data)

        if request.method == "PUT":
            serializer = serializers.RoomGroupAccessSerializer(
                room_group_access,
                data={
                    "room": room.id,
                    "group": group_pk,
                    "is_administrator": request.data.get("is_administrator"),
                },
                context={"request": request},
            )
            serializer.is_valid(raise_exception=True)
            serializer.save()
            return response.Response(serializer.data)

        return response.Response(status=405)

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
