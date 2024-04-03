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


def username_validator(value):
    """Wraps RegexValidator lazily to allow overriding the USERNAME_REGEX setting in tests."""
    RegexValidator(
        settings.USERNAME_REGEX,
        # We use a placeholder string here because the meaning of the sentence will only be
        # defined in translation files in order to allow customizing the regex and making the
        # message match the new behavior (it would be inconvenient to come up with a mechanism
        # that allows defining a message in multiple languages via the settings)
        message=_("username_validator_message"),
    )(value)


class User(BaseModel, AbstractBaseUser, PermissionsMixin):
    """
    User model with uername and name, admin-compliant permissions.
    Username and password are required. Other fields are optional.
    """

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
    email = models.EmailField(max_length=255, blank=True, null=True)
    language = models.CharField(
        max_length=10,
        choices=lazy(lambda: settings.LANGUAGES, tuple)(),
        default=settings.LANGUAGE_CODE,
        verbose_name=_("language"),
        help_text=_("The language in which the user wants to see the interface."),
    )
    jwt_sub = models.CharField(_("OIDC subject"), max_length=255, blank=True, null=True)
    timezone = TimeZoneField(
        choices_display="WITH_GMT_OFFSET", use_pytz=False, default=settings.TIME_ZONE
    )
    is_device = models.BooleanField(
        _("device"),
        default=False,
        help_text=_("Designates whether the user is a device or a real user."),
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


class Resource(BaseModel):
    """Model to define access control"""

    is_public = models.BooleanField(default=settings.DEFAULT_ROOM_IS_PUBLIC)
    users = models.ManyToManyField(
        User,
        through="ResourceAccess",
        through_fields=("resource", "user"),
        related_name="resources",
    )
    groups = models.ManyToManyField(
        Group,
        through="ResourceAccess",
        through_fields=("resource", "group"),
        blank=True,
        related_name="resources",
    )
    labels = models.ManyToManyField(
        Label, blank=True, related_name="is_resource_label_of"
    )

    class Meta:
        db_table = "magnify_resource"
        verbose_name = _("Resource")
        verbose_name_plural = _("Resources")

    def __str__(self):
        try:
            return self.name
        except AttributeError:
            return f"Resource {self.id!s}"

    def get_role(self, user):
        """
        Determine the role of a given user in this resource taking into account group ownership.
        """
        if not user or not user.is_authenticated:
            return None

        role = None
        for access in self.accesses.filter(
            Q(user=user) | Q(group__members=user) | Q(group__administrators=user)
        ):
            if access.role == RoleChoices.OWNER:
                return RoleChoices.OWNER
            if access.role == RoleChoices.ADMIN:
                role = RoleChoices.ADMIN
            if access.role == RoleChoices.MEMBER and role != RoleChoices.ADMIN:
                role = RoleChoices.MEMBER
        return role

    def is_administrator(self, user):
        """
        Check if a user is administrator of the resource.

        Users carrying the "owner" role are considered as administrators a fortiori.
        """
        return RoleChoices.check_administrator_role(self.get_role(user))

    def is_owner(self, user):
        """Check if a user is owner of the resource."""
        return RoleChoices.check_owner_role(self.get_role(user))


class ResourceAccess(BaseModel):
    """Link table between resources and users/groups"""

    resource = models.ForeignKey(
        Resource,
        on_delete=models.CASCADE,
        related_name="accesses",
    )
    user = models.ForeignKey(
        User, on_delete=models.CASCADE, related_name="accesses", blank=True, null=True
    )
    group = models.ForeignKey(
        Group, on_delete=models.CASCADE, related_name="accesses", blank=True, null=True
    )
    role = models.CharField(
        max_length=20, choices=RoleChoices.choices, default=RoleChoices.MEMBER
    )

    class Meta:
        db_table = "magnify_resource_access"
        verbose_name = _("Resource access")
        verbose_name_plural = _("Resource accesses")
        constraints = [
            # Uniqueness
            models.UniqueConstraint(
                fields=["user", "resource"],
                condition=Q(group__isnull=True),
                name="resource_access_unique_user_resource",
                violation_error_message=_(
                    "Resource access with this user and resource already exists."
                ),
            ),
            models.UniqueConstraint(
                fields=["group", "resource"],
                condition=Q(user__isnull=True),
                name="resources_access_unique_group_resource",
                violation_error_message=_(
                    "Resource access with this group and resource already exists."
                ),
            ),
            # Checks
            models.CheckConstraint(
                check=~Q(user__isnull=True, group__isnull=True),
                name="resource_access_not_user_and_group_both_null",
            ),
            models.CheckConstraint(
                check=~Q(user__isnull=False, group__isnull=False),
                name="resource_access_not_user_and_group_both_set",
            ),
            models.CheckConstraint(
                check=Q(group__isnull=True) | ~Q(role=RoleChoices.OWNER),
                name="resource_access_group_is_not_owner",
                violation_error_message=_(
                    "The 'owner' role can not be assigned to a group."
                ),
            ),
        ]

    def __str__(self):
        person = self.user or self.group
        role = capfirst(self.get_role_display())
        try:
            resource = self.resource.name
        except AttributeError:
            resource = f"resource {self.resource_id!s}"

        return f"{role:s} role for {person.name:s} on {resource:s}"

    def save(self, *args, **kwargs):
        """Make sure we keep at least one owner for the resource."""
        if self.pk and self.role != RoleChoices.OWNER:
            accesses = self._meta.model.objects.filter(
                resource=self.resource, role=RoleChoices.OWNER
            ).only("pk")
            if len(accesses) == 1 and accesses[0].pk == self.pk:
                raise PermissionDenied("A resource should keep at least one owner.")
        return super().save(*args, **kwargs)

    def delete(self, *args, **kwargs):
        """Disallow deleting the last of the Mohicans."""
        if (
            self.role == RoleChoices.OWNER
            and self._meta.model.objects.filter(
                resource=self.resource, role=RoleChoices.OWNER
            ).count()
            == 1
        ):
            raise PermissionDenied("A resource should keep at least one owner.")
        return super().delete(*args, **kwargs)


class Room(Resource):
    """Model for one room"""

    name = models.CharField(max_length=500)
    resource = models.OneToOneField(
        Resource,
        on_delete=models.CASCADE,
        parent_link=True,
        primary_key=True,
    )
    slug = models.SlugField(max_length=100, blank=True, null=True, unique=True)

    configuration = models.JSONField(
        blank=True,
        default=lambda : {
            "roomPassword": "",
            "askForPassword": False,
            "enableLobbyChat": True,
            "waitingRoomEnabled": True,
            "startWithAudioMuted": False,
            "startWithVideoMuted": True,
            "askForAuthentication": True,
            "screenSharingEnabled": True
        },
        verbose_name=_("Magnify room configuration"),
        help_text=_(
            "Values for Magnify parameters to configure the room."
        ),
    )

    class Meta:
        db_table = "magnify_room"
        ordering = ("name",)
        verbose_name = _("Room")
        verbose_name_plural = _("Rooms")

    def __str__(self):
        return capfirst(self.name)

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
    def livekit_name(self):
        """The name used for the room in LiveKit."""
        return f"{settings.LIVEKIT_ROOM_PREFIX}{self.id!s}".replace("-", "")


class Meeting(BaseModel):
    """Model for one meeting or a collection of meetings defined recursively."""

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
        Room,
        help_text=_("Room that hosts this meeting."),
        on_delete=models.SET_NULL,
        related_name="meetings",
        blank=True,
        null=True,
    )
    owner = models.ForeignKey(
        User,
        help_text=_("User who created the meeting."),
        on_delete=models.CASCADE,
        related_name="owner_of_meetings",
    )
    is_public = models.BooleanField(default=True)
    users = models.ManyToManyField(
        User,
        through="MeetingAccess",
        through_fields=("meeting", "user"),
        related_name="meetings",
    )
    groups = models.ManyToManyField(
        Group,
        through="MeetingAccess",
        through_fields=("meeting", "group"),
        blank=True,
        related_name="meetings",
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

    class Meta:
        db_table = "magnify_meeting"
        ordering = ("-start", "name")
        verbose_name = _("Meeting")
        verbose_name_plural = _("Meetings")
        constraints = [
            models.CheckConstraint(
                check=Q(end__gte=F("start")),
                name="end_greater_than_start",
                violation_error_message=_(
                    "The start date must be earlier than the end date."
                ),
            ),
            models.CheckConstraint(
                check=Q(recurring_until__gte=F("start"))
                | Q(recurring_until__isnull=True),
                name="recurring_until_greater_than_start",
                violation_error_message=_(
                    "The start date must be earlier than the date of end of recurrence."
                ),
            ),
            models.CheckConstraint(check=Q(frequency__gte=1), name="frequency_gte_1"),
            models.CheckConstraint(
                check=Q(recurring_until__isnull=True, nb_occurrences__isnull=True)
                | Q(recurring_until__isnull=False, nb_occurrences__isnull=False),
                name="recurring_until_and_nb_occurrences_mutually_null_or_not",
            ),
        ]

    def __str__(self):
        return capfirst(self.name)

    @property
    def jitsi_name(self):
        """The name used as Jitsi room for this meeting."""
        return f"{settings.LIVEKIT_ROOM_PREFIX}{self.id!s}".replace("-", "")

    def is_guest(self, user):
        """Return True if the user is a guest, either directly or via a group."""
        return (
            user.is_authenticated
            and self.accesses.filter(
                Q(user=user) | Q(group__members=user) | Q(group__administrators=user)
            ).exists()
        )

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
        Returns a list of occurrences for this meeting between start
        and end dates passed as arguments.
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


class MeetingAccess(BaseModel):
    """Link table between meetings and users/groups."""

    meeting = models.ForeignKey(
        Meeting,
        on_delete=models.CASCADE,
        related_name="accesses",
    )
    user = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name="meeting_relations",
        blank=True,
        null=True,
    )
    group = models.ForeignKey(
        Group,
        on_delete=models.CASCADE,
        related_name="meeting_relations",
        blank=True,
        null=True,
    )

    class Meta:
        db_table = "magnify_meeting_access"
        verbose_name = _("Meeting/guest relation")
        verbose_name_plural = _("Meeting/guest relations")
        constraints = [
            # Uniqueness
            models.UniqueConstraint(
                fields=["user", "meeting"],
                condition=Q(group__isnull=True),
                name="unique_user_meeting",
                violation_error_message=_(
                    "This user is already declared as a guest for this meeting."
                ),
            ),
            models.UniqueConstraint(
                fields=["group", "meeting"],
                condition=Q(user__isnull=True),
                name="unique_group_meeting",
                violation_error_message=_(
                    "This group is already declared as a guest for this meeting."
                ),
            ),
            # Checks
            models.CheckConstraint(
                check=~Q(user__isnull=True, group__isnull=True),
                name="meeting_guest_not_user_and_group_both_null",
            ),
            models.CheckConstraint(
                check=~Q(user__isnull=False, group__isnull=False),
                name="meeting_guest_not_user_and_group_both_set",
            ),
        ]

    def __str__(self):
        if self.user:
            return f"{self.user.name:s} is guest in meeting {self.meeting.id!s}"
        return f"Users in group {self.group.name} are guests in meeting {self.meeting.id!s}"
