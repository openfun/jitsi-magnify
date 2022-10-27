"""
Declare and configure the models for the customers part
"""
import uuid
from datetime import timedelta

from django.conf import settings
from django.contrib.auth.base_user import AbstractBaseUser
from django.contrib.auth.models import PermissionsMixin, UserManager
from django.core.exceptions import ValidationError
from django.core.validators import RegexValidator
from django.db import models
from django.db.models import F, Q
from django.utils import timezone
from django.utils.functional import lazy
from django.utils.text import capfirst, slugify
from django.utils.translation import gettext_lazy as _

from dateutil.relativedelta import relativedelta

from .utils import get_nth_week_number, get_weekday_in_nth_week


class BaseModel(models.Model):
    """Make `save` call `full_clean`.

    Should be the left most mixin in your models.
    Django doesn't validate models by default but we should do it.
    """

    id = models.UUIDField(
        verbose_name=_("id"),
        help_text=_("primary key for the record as UUID"),
        primary_key=True,
        default=uuid.uuid4,
        editable=False,
    )

    class Meta:
        abstract = True

    def save(self, *args, **kwargs):
        """Call `full_clean` before saving."""
        self.full_clean()
        super().save(*args, **kwargs)


class User(BaseModel, AbstractBaseUser, PermissionsMixin):
    """
    User model with uername and name, admin-compliant permissions.
    Username and password are required. Other fields are optional.
    """

    username_validator = RegexValidator(
        "^[a-z0-9_-]*$",
        message=_(
            "Username must contain only lower case letters, numbers, underscores and hyphens."
        ),
    )

    username = models.CharField(
        _("username"),
        max_length=30,
        unique=True,
        validators=[username_validator],
        error_messages={
            "unique": _("A user with that username already exists."),
        },
    )
    name = models.CharField(
        max_length=255,
        blank=True,
        null=True,
    )
    email = models.EmailField(max_length=255, unique=True)
    language = models.CharField(
        max_length=10,
        choices=lazy(lambda: settings.LANGUAGES, tuple)(),
        default=settings.LANGUAGE_CODE,
        verbose_name=_("language"),
        help_text=_("The language in which the user wants to see the interface."),
    )
    is_staff = models.BooleanField(
        _("staff status"),
        default=False,
        help_text=_("Designates whether the user can log into this admin site."),
    )
    is_active = models.BooleanField(
        _("active"),
        default=True,
        help_text=_(
            "Designates whether this user should be treated as active. "
            "Unselect this instead of deleting accounts."
        ),
    )
    date_joined = models.DateTimeField(_("date joined"), default=timezone.now)

    objects = UserManager()

    EMAIL_FIELD = "email"
    USERNAME_FIELD = "username"
    REQUIRED_FIELDS = ["email"]

    class Meta:
        db_table = "magnify_user"
        ordering = ("username",)
        verbose_name = _("User")
        verbose_name_plural = _("Users")

    def clean(self):
        """Normalize the email field."""
        self.email = self.__class__.objects.normalize_email(self.email)
        super().clean()

    def __str__(self):
        return self.username


class Label(BaseModel):
    """Label for a meeting, a group or a room"""

    name = models.CharField(max_length=100)
    color = models.CharField(
        max_length=7,
        validators=[
            RegexValidator(
                regex="^#([a-fA-F0-9]{6}|[a-fA-F0-9]{3})$",
                message="Color must be a valid hexa code",
                code="nomatch",
            )
        ],
    )
    created_by = models.ForeignKey(User, on_delete=models.CASCADE)

    class Meta:
        db_table = "magnify_label"
        ordering = ("name",)
        verbose_name = _("Label")
        verbose_name_plural = _("Labels")

    def __str__(self):
        return self.name


class Group(BaseModel):
    """Group of users to be sent in rooms or in sub-rooms"""

    name = models.CharField(max_length=100)
    # token to join group with
    token = models.CharField(max_length=100)
    administrators = models.ManyToManyField(
        User, blank=True, related_name="is_administrator_of"
    )
    members = models.ManyToManyField(User, blank=True, related_name="is_member_of")
    labels = models.ManyToManyField(Label, blank=True, related_name="is_group_label_of")

    class Meta:
        db_table = "magnify_group"
        ordering = ("name",)
        verbose_name = _("Group")
        verbose_name_plural = _("Groups")

    def __str__(self):
        return self.name

    def clean_fields(self, exclude=None):
        """Generate a fresh token on each save."""
        self.token = uuid.uuid4()
        super().clean_fields(exclude=exclude)


class Room(BaseModel):
    """Model for one room"""

    name = models.CharField(max_length=100)
    slug = models.SlugField(max_length=100, unique=True)

    is_public = models.BooleanField(default=True)

    users = models.ManyToManyField(User, through="RoomUserAccess", related_name="rooms")
    groups = models.ManyToManyField(
        Group, through="RoomGroupAccess", blank=True, related_name="rooms"
    )
    labels = models.ManyToManyField(Label, blank=True, related_name="is_room_label_of")
    configuration = models.JSONField(
        blank=True,
        default=dict,
        verbose_name=_("Jitsi room configuration"),
        help_text=_(
            "Values for Jitsi parameters to configure the room via the iframe API."
        ),
    )

    class Meta:
        db_table = "magnify_room"
        ordering = ("name",)
        verbose_name = _("Room")
        verbose_name_plural = _("Rooms")

    def __str__(self):
        return self.name

    def clean_fields(self, exclude=None):
        """
        Automatically generate the slug from the name and make sure it does not look like a UUID.
        We don't want any overlapping between the `slug` and the `id` fields because they can
        both be used to get a room detail view on the API.
        """
        self.slug = slugify(self.name)
        try:
            uuid.UUID(self.slug)
        except ValueError:
            pass
        else:
            raise ValidationError({"name": f'Room name "{self.name:s}" is reserved.'})
        super().clean_fields(exclude=exclude)

    @property
    def jitsi_name(self):
        """The name used for the room in Jitsi."""
        return f"{self.slug:s}-{self.id!s}"

    def is_administrator(self, user):
        """Check if a user is administrator of the room."""
        if not user.is_authenticated:
            return False

        return (
            self.user_accesses.filter(is_administrator=True, user=user).exists()
            or self.group_accesses.filter(
                Q(group__members=user) | Q(group__administrators=user),
                is_administrator=True,
            ).exists()
        )

    def has_access(self, user):
        """Check if a user has access to the room."""
        return self.user_accesses.filter(
            user=user
        ).exists() or self.group_accesses.filter(
            Q(group__members=user) | Q(group__administrators=user)
        )


class RoomUserAccess(BaseModel):
    """Link table between rooms and users"""

    user = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name="room_accesses",
    )
    room = models.ForeignKey(
        Room, on_delete=models.CASCADE, related_name="user_accesses"
    )
    is_administrator = models.BooleanField(default=False)

    class Meta:
        db_table = "magnify_room_user_access"
        unique_together = ("user", "room")
        verbose_name = _("Room user access")
        verbose_name_plural = _("Room user accesses")

    def __str__(self):
        admin_status = " (admin)" if self.is_administrator else ""
        return f"{capfirst(self.room.name):s} / {capfirst(self.user.name):s}{admin_status:s}"


class RoomGroupAccess(BaseModel):
    """Link table between rooms and groups"""

    group = models.ForeignKey(
        Group, on_delete=models.CASCADE, related_name="room_accesses"
    )
    room = models.ForeignKey(
        Room, on_delete=models.CASCADE, related_name="group_accesses"
    )
    is_administrator = models.BooleanField(default=False)

    class Meta:
        db_table = "magnify_room_group_access"
        unique_together = ("group", "room")
        verbose_name = _("Room group access")
        verbose_name_plural = _("Room group accesses")

    def __str__(self):
        admin_status = " (admin)" if self.is_administrator else ""
        return f"{capfirst(self.room.name):s} / {capfirst(self.group.name):s}{admin_status:s}"


class Meeting(BaseModel):
    """Model for one meeting or a collection of meetings defined recursively"""

    DAILY, WEEKLY, MONTHLY, YEARLY = "daily", "weekly", "monthly", "yearly"

    INTERVAL_CHOICES = (
        (DAILY, _("Daily")),
        (WEEKLY, _("Weekly")),
        (MONTHLY, _("Monthly")),
        (YEARLY, _("Yearly")),
    )

    DATE_DAY, NTH_DAY = "date_day", "nth_day"
    MONTHLY_TYPE_CHOICES = (
        (DATE_DAY, _("Every month on this date")),
        (NTH_DAY, _("Every month on the nth week day of the month")),
    )

    weekdays_validator = RegexValidator(
        "^[0-6]{0,7}$",
        message=_("Weekdays must contain the numbers of the active days."),
    )

    name = models.CharField(max_length=500)
    room = models.ForeignKey(
        Room, null=True, blank=True, related_name="meetings", on_delete=models.RESTRICT
    )

    # Start and end are the same for a single meeting
    start = models.DateField()
    start_time = models.TimeField()
    expected_duration = models.DurationField()

    # recurrence
    recurrence = models.CharField(
        max_length=10, choices=INTERVAL_CHOICES, null=True, blank=True
    )
    frequency = models.PositiveIntegerField(default=1)
    recurring_until = models.DateField(null=True, blank=True)
    nb_occurrences = models.PositiveIntegerField(null=True, blank=True)
    weekdays = models.CharField(
        max_length=7, blank=True, null=True, validators=[weekdays_validator]
    )
    monthly_type = models.CharField(
        max_length=10, choices=MONTHLY_TYPE_CHOICES, default=DATE_DAY
    )

    is_public = models.BooleanField(default=True)

    users = models.ManyToManyField(
        User, through="MeetingUserAccess", related_name="meetings"
    )
    groups = models.ManyToManyField(
        Group, through="MeetingGroupAccess", blank=True, related_name="meetings"
    )
    labels = models.ManyToManyField(
        Label, blank=True, related_name="is_meeting_label_of"
    )

    class Meta:
        db_table = "magnify_meeting"
        ordering = ("-start", "-start_time")
        verbose_name = _("Meeting")
        verbose_name_plural = _("Meetings")
        constraints = [
            models.CheckConstraint(
                check=Q(recurring_until__gte=F("start"))
                | Q(recurring_until__isnull=True),
                name="recurring_until_greater_than_start",
            ),
            models.CheckConstraint(check=Q(frequency__gte=1), name="frequency_gte_1"),
            models.CheckConstraint(
                check=Q(recurring_until__isnull=True, nb_occurrences__isnull=True)
                | Q(recurring_until__isnull=False, nb_occurrences__isnull=False),
                name="recurring_until_and_nb_occurrences_mutually_null_or_not",
            ),
        ]

    def __str__(self):
        return self.name

    @property
    def jitsi_name(self):
        """The name used for the room in Jitsi."""
        # Get a unique identifier for the meeing
        if self.room:
            return f"{self.room.slug:s}-{self.id!s}"
        return str(self.id)

    def reset_recurrence(self):
        """
        Reset recurrence so everything indicates that the event occurs only once.
        Saving is left up to the caller.
        """
        self.recurrence = None
        self.weekdays = str(self.start.weekday())
        self.nb_occurrences = 1
        self.recurring_until = self.start

    # pylint: disable=too-many-branches
    def save(self, *args, **kwargs):
        """Compute the `recurring_until` field which is the date at which the recurrence ends."""
        if self.start and self.frequency:
            if self.recurrence == Meeting.WEEKLY:
                if self.weekdays is None:
                    self.reset_recurrence()

                if str(self.start.weekday()) not in self.weekdays:
                    raise ValidationError(
                        {"weekdays": _("Weekdays should contain the start date.")}
                    )

            if self.recurrence:
                if self.recurring_until:
                    if self.recurring_until < self.start:
                        self.recurring_until = self.start
                    all_occurrences = self.get_occurrences(
                        self.start, self.recurring_until
                    )
                    self.nb_occurrences = len(all_occurrences)
                    # Correct the date of end of recurrence
                    self.recurring_until = all_occurrences[-1]
                    if self.nb_occurrences <= 1:
                        self.reset_recurrence()

                elif self.nb_occurrences is not None:
                    if self.nb_occurrences <= 1:
                        self.reset_recurrence()
                    next_occurrence = self.start
                    for _i in range(self.nb_occurrences - 1):
                        next_occurrence = self.next_occurrence(next_occurrence)
                    self.recurring_until = next_occurrence

                # Infinite recurrence... do nothing

            else:
                self.reset_recurrence()
        else:
            self.reset_recurrence()

        super().save(*args, **kwargs)

    def next_occurrence(self, current_date):
        """
        This method takes as assumption that the current date passed in argument
        IS a valid occurrence. If it is not the case, it will return an irrelevant date.

        Returns the next occurrence without consideration for the end of the recurrence.
        """
        if self.recurrence == Meeting.DAILY:
            return current_date + timedelta(days=self.frequency)

        if self.recurrence == Meeting.WEEKLY:
            increment = 1
            # Look in the current week
            weekday = current_date.weekday()
            while weekday + increment <= 6:
                if str(weekday + increment) in self.weekdays:
                    return current_date + timedelta(days=increment)
                increment += 1
            # Skip the weeks not covered by frequency
            next_date = (
                current_date
                + timedelta(days=increment)
                + timedelta(weeks=self.frequency - 1)
            )

            # Look in this week and be sure to find
            weekday = 0
            increment = 1
            while weekday + increment <= 6:
                if str(weekday + increment) in self.weekdays:
                    return next_date + timedelta(days=increment)
                increment += 1

            raise RuntimeError(
                "You should have found the next weekly occurrence by now."
            )

        if self.recurrence == Meeting.MONTHLY:
            next_date = current_date + relativedelta(months=self.frequency)
            if self.monthly_type == Meeting.DATE_DAY:
                return next_date

            if self.monthly_type == Meeting.NTH_DAY:
                weekday = current_date.weekday()
                week_number = get_nth_week_number(current_date)
                return get_weekday_in_nth_week(
                    next_date.year, next_date.month, week_number, weekday
                )

            raise RuntimeError(
                "You should have found the next monthly occurrence by now."
            )

        if self.recurrence == Meeting.YEARLY:
            return current_date + relativedelta(years=self.frequency)

        raise RuntimeError("Non recurrent meetings don't have next occurences.")

    def get_occurrences(self, start, end=None):
        """
        Returns a list of occurrences for this meeting between start and end dates passed
        as arguments.
        """
        real_end = end or start
        if self.recurrence:
            if self.recurring_until and self.recurring_until < real_end:
                real_end = self.recurring_until

            occurrences = []
            new_start = self.start
            while new_start <= real_end:
                if new_start >= start:
                    occurrences.append(new_start)
                new_start = self.next_occurrence(new_start)
            return occurrences

        # check if event is in the period
        if self.start <= real_end and self.start + self.expected_duration >= start:
            return [self.start]

        return []


class MeetingUserAccess(BaseModel):
    """Link table between meetings and users"""

    user = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name="meeting_accesses",
    )
    meeting = models.ForeignKey(
        Meeting, on_delete=models.CASCADE, related_name="user_accesses"
    )
    is_administrator = models.BooleanField(default=False)

    class Meta:
        db_table = "magnify_meeting_user_access"
        unique_together = ("user", "meeting")
        verbose_name = _("Meeting user access")
        verbose_name_plural = _("Meeting user accesses")

    def __str__(self):
        admin_status = " (admin)" if self.is_administrator else ""
        return f"{capfirst(self.meeting.name):s} / {capfirst(self.user.name):s}{admin_status:s}"


class MeetingGroupAccess(BaseModel):
    """Link table between meetings and groups"""

    group = models.ForeignKey(
        Group, on_delete=models.CASCADE, related_name="meeting_accesses"
    )
    meeting = models.ForeignKey(
        Meeting, on_delete=models.CASCADE, related_name="group_accesses"
    )
    is_administrator = models.BooleanField(default=False)

    class Meta:
        db_table = "magnify_meeting_group_access"
        unique_together = ("group", "meeting")
        verbose_name = _("Meeting group access")
        verbose_name_plural = _("Meeting group accesses")

    def __str__(self):
        admin_status = " (admin)" if self.is_administrator else ""
        return f"{capfirst(self.meeting.name):s} / {capfirst(self.group.name):s}{admin_status:s}"
