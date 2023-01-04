"""Magnify meetings API endpoints"""
from django.db.models import Q

from rest_framework import mixins, response, viewsets
from rest_framework.exceptions import PermissionDenied

from .. import forms, models
from .. import permissions as magnify_permissions
from .. import serializers as magnify_serializers


class MeetingViewSet(
    mixins.CreateModelMixin,
    mixins.DestroyModelMixin,
    mixins.ListModelMixin,
    mixins.RetrieveModelMixin,
    mixins.UpdateModelMixin,
    viewsets.GenericViewSet,
):
    """
    API endpoints to access and perform actions on meetings.
    """

    queryset = models.Meeting.objects.all()
    serializer_class = magnify_serializers.MeetingSerializer

    def get_permissions(self):
        """User only needs to be authenticated to list rooms access"""
        if self.action in ["list", "retrieve"]:
            return super().get_permissions()

        return [magnify_permissions.IsOwner()]

    def list(self, request, *args, **kwargs):
        """Limit listed meetings to the ones related to the authenticated user."""
        user = self.request.user
        queryset = self.filter_queryset(self.get_queryset())

        # Instantiate the form to allow validation/cleaning
        filter_form = forms.MeetingFilterForm(data=self.request.query_params)

        # Filter meetings by time range fo list requests
        if self.action == "list":
            if not filter_form.is_valid():
                return response.Response(
                    status=400, data={"errors": filter_form.errors}
                )

            filter_from = filter_form.cleaned_data["from"]
            filter_to = filter_form.cleaned_data["to"]
            queryset = queryset.filter(
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

        user = self.request.user
        if user.is_authenticated:
            retrieve_clause = (
                Q(owner=user)
                | Q(users=user)
                | Q(groups__members=user)
                | Q(groups__administrators=user)
            )
            if self.action != "list":
                retrieve_clause |= Q(is_public=True)
            queryset = queryset.filter(retrieve_clause).distinct()

        elif self.action == "retrieve":
            queryset = queryset.filter(is_public=True)

        else:
            queryset = queryset.none()

        page = self.paginate_queryset(queryset)
        if page is not None:
            serializer = self.get_serializer(page, many=True)
            return self.get_paginated_response(serializer.data)

        serializer = self.get_serializer(queryset, many=True)
        return response.Response(serializer.data)

    def filter_queryset(self, queryset):
        """Limit listed meetings to the ones related to the authenticated user."""
        # Instantiate the form to allow validation/cleaning
        filter_form = forms.MeetingFilterForm(data=self.request.query_params)

        # Filter meetings by time range fo list requests
        if self.action == "list":
            if not filter_form.is_valid():
                return response.Response(
                    status=400, data={"errors": filter_form.errors}
                )

            filter_from = filter_form.cleaned_data["from"]
            filter_to = filter_form.cleaned_data["to"]
            queryset = queryset.filter(
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

        user = self.request.user
        if user.is_authenticated:
            retrieve_clause = (
                Q(owner=user)
                | Q(users=user)
                | Q(groups__members=user)
                | Q(groups__administrators=user)
            )
            if self.action != "list":
                retrieve_clause |= Q(is_public=True)
            return queryset.filter(retrieve_clause).distinct()

        if self.action == "retrieve":
            return queryset.filter(is_public=True)

        return queryset.none()

    def perform_create(self, serializer):
        """
        Set the current user as owner of the newly created meeting.
        """
        user = self.request.user

        serializer.validated_data["owner"] = user
        serializer.validated_data["timezone"] = (
            serializer.validated_data.get("timezone") or user.timezone
        )

        return super().perform_create(serializer)


class MeetingAccessViewSet(
    mixins.CreateModelMixin,
    mixins.DestroyModelMixin,
    mixins.RetrieveModelMixin,
    viewsets.GenericViewSet,
):
    """API endpoints to meeting guest relations."""

    permission_classes = [magnify_permissions.IsMeetingOwnerPermission]
    queryset = models.MeetingAccess.objects.all()
    serializer_class = magnify_serializers.MeetingAccessSerializer

    def perform_create(self, serializer):
        """
        When creating a meeting access for a group, ensure that the logged-in user is administrator
        of the related group.
        """
        user = self.request.user
        group = serializer.validated_data.get("group")
        if group and not (user and group.administrators.filter(id=user.id).exists()):
            raise PermissionDenied(
                "You must be administrator of a group to give it access to a meeting."
            )
        return super().perform_create(serializer)
