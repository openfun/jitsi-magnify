"""
Declare and configure the models for the customers part
"""
import uuid
from datetime import timedelta
from zoneinfo import ZoneInfo

from django.conf import settings
from django.contrib.auth.base_user import AbstractBaseUser
from django.contrib.auth.models import PermissionsMixin, UserManager
from django.core.exceptions import PermissionDenied, ValidationError
from django.core.validators import RegexValidator
from django.db import models
from django.db.models import F, Q
from django.utils import timezone as util_timezone
from django.utils.functional import lazy
from django.utils.text import capfirst, slugify
from django.utils.translation import gettext_lazy as _

from dateutil.relativedelta import relativedelta
from timezone_field import TimeZoneField

from .utils import get_date_of_weekday_in_nth_week, get_nth_week_number


class RoleChoices(models.TextChoices):
    """Role choices ."""

    MEMBER = "member", _("Member")
    ADMIN = "administrator", _("Administrator")
    OWNER = "owner", _("Owner")

    @classmethod
    def check_administrator_role(cls, role):
        """Check if a role is administrator."""
        return role in [cls.ADMIN, cls.OWNER]

    @classmethod
    def check_owner_role(cls, role):
        """Check if a role is owner."""
        return role == cls.OWNER


# Group roles do not have the "owner" role
GroupRoleChoices = models.TextChoices(
    "GroupRoleChoices",
    [(rc.name, rc.value) for rc in RoleChoices if rc.value != RoleChoices.OWNER],
)


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
    timezone = TimeZoneField(
        choices_display="WITH_GMT_OFFSET", use_pytz=False, default=settings.TIME_ZONE
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
    date_joined = models.DateTimeField(_("date joined"), default=util_timezone.now)

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

    is_public = models.BooleanField(default=False)

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

    def get_role(self, user, direct_only=False):
        """
        Determine the role of a given user in this room.

        direct_only: boolean
            Whether or not to take into account the roles a user inherits from
            its membership in a group.
        """
        if not user or not user.is_authenticated:
            return None

        try:
            # pylint: disable=no-member
            role = self.user_accesses.get(user=user).role
        except self.user_accesses.model.DoesNotExist:
            role = None

        if direct_only or role not in (None, RoleChoices.MEMBER):
            return role

        for access in self.group_accesses.filter(
            Q(group__members=user) | Q(group__administrators=user),
        ):
            if access.role == GroupRoleChoices.MEMBER:
                role = GroupRoleChoices.MEMBER
            if access.role == GroupRoleChoices.ADMIN:
                role = GroupRoleChoices.ADMIN
                break

        return role

    def is_administrator(self, user):
        """
        Check if a user is administrator of the room.

        Users carrying the "owner" role are considered as administrators a fortiori.
        """
        return RoleChoices.check_administrator_role(self.get_role(user))

    def is_owner(self, user):
        """Check if a user is owner of the room."""
        return RoleChoices.check_owner_role(self.get_role(user, direct_only=True))


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
    role = models.CharField(
        max_length=20, choices=RoleChoices.choices, default=RoleChoices.MEMBER
    )

    class Meta:
        db_table = "magnify_room_user_access"
        unique_together = ("user", "room")
        verbose_name = _("Room user access")
        verbose_name_plural = _("Room user accesses")

    def __str__(self):
        return (
            f"{capfirst(self.room.name):s} / {capfirst(self.user.name):s} "
            f"({self.get_role_display():s})"
        )

    def save(self, *args, **kwargs):
        """Make sure we keep at least one owner in a room."""
        if self.pk and self.role != RoleChoices.OWNER:
            accesses = self._meta.model.objects.filter(
                room=self.room, role=RoleChoices.OWNER
            ).only("pk")
            if len(accesses) == 1 and accesses[0].pk == self.pk:
                raise PermissionDenied("A room should keep at least one owner.")
        return super().save(*args, **kwargs)

    def delete(self, *args, **kwargs):
        """Disallow deleting the last of the Mohicans."""
        if (
            self.role == RoleChoices.OWNER
            and self._meta.model.objects.filter(
                room=self.room, role=RoleChoices.OWNER
            ).count()
            == 1
        ):
            raise PermissionDenied("A room should keep at least one owner.")
        return super().delete(*args, **kwargs)


class RoomGroupAccess(BaseModel):
    """Link table between rooms and groups"""

    group = models.ForeignKey(
        Group, on_delete=models.CASCADE, related_name="room_accesses"
    )
    room = models.ForeignKey(
        Room, on_delete=models.CASCADE, related_name="group_accesses"
    )
    role = models.CharField(
        max_length=20, choices=GroupRoleChoices.choices, default=GroupRoleChoices.MEMBER
    )

    class Meta:
        db_table = "magnify_room_group_access"
        unique_together = ("group", "room")
        verbose_name = _("Room group access")
        verbose_name_plural = _("Room group accesses")

    def __str__(self):
        return (
            f"{capfirst(self.room.name):s} / {capfirst(self.group.name):s} "
            f"({self.get_role_display():s})"
        )


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

    start = models.DateTimeField()
    end = models.DateTimeField()
    timezone = TimeZoneField(choices_display="WITH_GMT_OFFSET", use_pytz=False)

    # recurrence
    recurrence = models.CharField(
        max_length=10, choices=INTERVAL_CHOICES, null=True, blank=True
    )
    frequency = models.PositiveIntegerField(default=1)
    recurring_until = models.DateTimeField(null=True, blank=True)
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
        ordering = ("-start",)
        verbose_name = _("Meeting")
        verbose_name_plural = _("Meetings")
        constraints = [
            models.CheckConstraint(
                check=Q(end__gte=F("start")),
                name="end_greater_than_start",
            ),
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
        self.weekdays = str(self.start.astimezone(self.timezone).weekday())
        self.nb_occurrences = 1
        self.recurring_until = self.start

    # pylint: disable=too-many-branches
    def save(self, *args, **kwargs):
        """Compute the `recurring_until` field which is the date at which the recurrence ends."""
        if self.start and self.frequency:
            if self.recurrence == Meeting.WEEKLY:
                if self.weekdays is None:
                    self.reset_recurrence()

                weekday = self.start.astimezone(self.timezone).weekday()
                if str(weekday) not in self.weekdays:
                    raise ValidationError(
                        {"weekdays": _("Weekdays should contain the start date.")}
                    )
            else:
                self.weekdays = None
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

    def next_occurrence(self, current_datetime):
        """
        This method takes as assumption that the current date passed in argument
        IS a valid occurrence. If it is not the case, it will return an irrelevant date.

        Returns the next occurrence without consideration for the end of the recurrence.
        """
        current_datetime_tz = current_datetime.astimezone(self.timezone)
        if self.recurrence == Meeting.DAILY:
            return (current_datetime_tz + timedelta(days=self.frequency)).astimezone(
                ZoneInfo("UTC")
            )

        if self.recurrence == Meeting.WEEKLY:
            increment = 1
            # Look in the current week
            weekday = current_datetime.astimezone(self.timezone).weekday()
            while weekday + increment <= 6:
                if str(weekday + increment) in self.weekdays:
                    return (current_datetime_tz + timedelta(days=increment)).astimezone(
                        ZoneInfo("UTC")
                    )
                increment += 1
            # Skip the weeks not covered by frequency
            next_datetime_tz = (
                current_datetime_tz
                + timedelta(days=increment)
                + timedelta(weeks=self.frequency - 1)
            )

            # Look in this week and be sure to find
            weekday = -1
            increment = 1
            while weekday + increment <= 6:
                if str(weekday + increment) in self.weekdays:
                    return (
                        next_datetime_tz + timedelta(days=increment - 1)
                    ).astimezone(ZoneInfo("UTC"))
                increment += 1

            raise RuntimeError(
                "You should have found the next weekly occurrence by now."
            )

        if self.recurrence == Meeting.MONTHLY:
            next_datetime_tz = current_datetime_tz + relativedelta(
                months=self.frequency
            )
            if self.monthly_type == Meeting.DATE_DAY:
                return next_datetime_tz.astimezone(ZoneInfo("UTC"))

            if self.monthly_type == Meeting.NTH_DAY:
                weekday = current_datetime_tz.weekday()
                week_number = get_nth_week_number(current_datetime_tz.date())
                next_date = get_date_of_weekday_in_nth_week(
                    next_datetime_tz.year, next_datetime_tz.month, week_number, weekday
                )
                return current_datetime_tz.replace(
                    year=next_date.year, month=next_date.month, day=next_date.day
                ).astimezone(ZoneInfo("UTC"))

            raise RuntimeError(
                "You should have found the next monthly occurrence by now."
            )

        if self.recurrence == Meeting.YEARLY:
            return (
                current_datetime_tz + relativedelta(years=self.frequency)
            ).astimezone(ZoneInfo("UTC"))

        raise RuntimeError("Non recurrent meetings don't have next occurences.")

    def get_occurrences(self, start, end):
        """
        Returns a list of occurrences for this meeting between start and end dates passed
        as arguments.
        """
        if self.recurrence:
            if self.recurring_until and self.recurring_until < end:
                end = self.recurring_until

            occurrences = []
            new_start = self.start
            while new_start <= end:
                if new_start >= start:
                    occurrences.append(new_start)
                new_start = self.next_occurrence(new_start)
            return occurrences

        # check if event is in the period
        if self.start <= end and self.end >= start:
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
    role = models.CharField(
        max_length=20, choices=RoleChoices.choices, default=RoleChoices.MEMBER
    )

    class Meta:
        db_table = "magnify_meeting_user_access"
        unique_together = ("user", "meeting")
        verbose_name = _("Meeting user access")
        verbose_name_plural = _("Meeting user accesses")

    def __str__(self):
        return (
            f"{capfirst(self.meeting.name):s} / {capfirst(self.user.name):s} "
            f"({self.get_role_display():s})"
        )


class MeetingGroupAccess(BaseModel):
    """Link table between meetings and groups"""

    group = models.ForeignKey(
        Group, on_delete=models.CASCADE, related_name="meeting_accesses"
    )
    meeting = models.ForeignKey(
        Meeting, on_delete=models.CASCADE, related_name="group_accesses"
    )
    role = models.CharField(
        max_length=20, choices=GroupRoleChoices.choices, default=GroupRoleChoices.MEMBER
    )

    class Meta:
        db_table = "magnify_meeting_group_access"
        unique_together = ("group", "meeting")
        verbose_name = _("Meeting group access")
        verbose_name_plural = _("Meeting group accesses")

    def __str__(self):
        return (
            f"{capfirst(self.meeting.name):s} / {capfirst(self.group.name):s} "
            f"({self.get_role_display():s})"
        )
