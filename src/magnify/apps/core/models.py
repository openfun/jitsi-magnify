"""
Declare and configure the models for the customers part
"""
import uuid

from django.contrib.auth.base_user import AbstractBaseUser
from django.contrib.auth.models import UserManager
from django.core.validators import RegexValidator
from django.db import models
from django.db.models import F, Q
from django.utils import timezone
from django.utils.text import capfirst, slugify
from django.utils.translation import gettext_lazy as _


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


class User(BaseModel, AbstractBaseUser):
    """
    User model with uername and name, admin-compliant permissions.
    Username and password are required. Other fields are optional.
    """

    username_validator = RegexValidator(
        "^[a-zA-Z0-9_-]*$",
        message=_(
            "Username must contain only letters, numbers, underscores and hyphens."
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
    members = models.ManyToManyField(
        User, blank=True, through="Membership", related_name="is_member_of"
    )
    labels = models.ManyToManyField(Label, blank=True, related_name="is_group_label_of")

    class Meta:
        db_table = "magnify_group"
        ordering = ("name",)
        verbose_name = _("Group")
        verbose_name_plural = _("Groups")

    def __str__(self):
        return self.name


class Membership(BaseModel):
    """Link table between users and groups"""

    user = models.ForeignKey(
        User, on_delete=models.CASCADE, related_name="group_relations"
    )
    group = models.ForeignKey(
        Group, on_delete=models.CASCADE, related_name="user_relations"
    )
    is_administrator = models.BooleanField(default=False)

    class Meta:
        db_table = "magnify_membership"
        verbose_name = _("Membership")
        verbose_name_plural = _("Memberships")


class Meeting(BaseModel):
    """Model for one meeting or a collection of meetings defined recursively"""

    name = models.CharField(max_length=500)

    # Start and end are the same for a single meeting
    start = models.DateField()
    end = models.DateField()
    start_time = models.TimeField()
    expected_duration = models.DurationField()

    # Set to True if there is a meeting on that day
    held_on_monday = models.BooleanField(default=False)
    held_on_tuesday = models.BooleanField(default=False)
    held_on_wednesday = models.BooleanField(default=False)
    held_on_thursday = models.BooleanField(default=False)
    held_on_friday = models.BooleanField(default=False)
    held_on_saturday = models.BooleanField(default=False)
    held_on_sunday = models.BooleanField(default=False)

    is_public = models.BooleanField(default=True)

    users = models.ManyToManyField(User, through="MeetingUser", related_name="meetings")
    groups = models.ManyToManyField(
        Group, through="MeetingGroup", blank=True, related_name="meetings"
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
                check=Q(end__gte=F("start")), name="end_greater_than_start"
            )
        ]

    def __str__(self):
        return self.name


class MeetingUser(BaseModel):
    """Link table between meetings and users"""

    user = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name="meeting_relations",
    )
    meeting = models.ForeignKey(
        Meeting, on_delete=models.CASCADE, related_name="user_relations"
    )
    is_administrator = models.BooleanField(default=False)

    class Meta:
        db_table = "magnify_meeting_user"
        unique_together = ("user", "meeting")
        verbose_name = _("Meeting user relation")
        verbose_name_plural = _("Meeting user relations")

    def __str__(self):
        admin_status = " (admin)" if self.is_administrator else ""
        return f"{capfirst(self.meeting.name):s} / {capfirst(self.user.name):s}{admin_status:s}"


class MeetingGroup(BaseModel):
    """Link table between meetings and groups"""

    group = models.ForeignKey(
        Group, on_delete=models.CASCADE, related_name="meeting_relations"
    )
    meeting = models.ForeignKey(
        Meeting, on_delete=models.CASCADE, related_name="group_relations"
    )
    is_administrator = models.BooleanField(default=False)

    class Meta:
        db_table = "magnify_meeting_group"
        unique_together = ("group", "meeting")
        verbose_name = _("Meeting group relation")
        verbose_name_plural = _("Meeting group relations")

    def __str__(self):
        admin_status = " (admin)" if self.is_administrator else ""
        return f"{capfirst(self.meeting.name):s} / {capfirst(self.group.name):s}{admin_status:s}"


class Room(BaseModel):
    """Model for one room"""

    name = models.CharField(max_length=100)
    slug = models.SlugField(max_length=100, unique=True)

    is_public = models.BooleanField(default=True)

    users = models.ManyToManyField(User, through="RoomUser", related_name="rooms")
    groups = models.ManyToManyField(
        Group, through="RoomGroup", blank=True, related_name="rooms"
    )
    labels = models.ManyToManyField(Label, blank=True, related_name="is_room_label_of")

    class Meta:
        db_table = "magnify_room"
        ordering = ("name",)
        verbose_name = _("Room")
        verbose_name_plural = _("Rooms")

    def __str__(self):
        return self.name

    def save(self, *args, **kwargs):
        """Automatically generate the slug from the name."""
        self.slug = slugify(self.name)
        super().save(*args, **kwargs)

    def is_administrator(self, user):
        """check if a user is administrator of the room."""
        if not user.is_authenticated:
            return False

        return (
            self.user_relations.filter(is_administrator=True, user=user).exists()
            or self.group_relations.filter(
                is_administrator=True, group__user_relations__user=user
            ).exists()
        )


class RoomUser(BaseModel):
    """Link table between rooms and users"""

    user = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name="room_relations",
    )
    room = models.ForeignKey(
        Room, on_delete=models.CASCADE, related_name="user_relations"
    )
    is_administrator = models.BooleanField(default=False)

    class Meta:
        db_table = "magnify_room_user"
        unique_together = ("user", "room")
        verbose_name = _("Room user relation")
        verbose_name_plural = _("Room user relations")

    def __str__(self):
        admin_status = " (admin)" if self.is_administrator else ""
        return f"{capfirst(self.room.name):s} / {capfirst(self.user.name):s}{admin_status:s}"


class RoomGroup(BaseModel):
    """Link table between rooms and groups"""

    group = models.ForeignKey(
        Group, on_delete=models.CASCADE, related_name="room_relations"
    )
    room = models.ForeignKey(
        Room, on_delete=models.CASCADE, related_name="group_relations"
    )
    is_administrator = models.BooleanField(default=False)

    class Meta:
        db_table = "magnify_room_group"
        unique_together = ("group", "room")
        verbose_name = _("Room group relation")
        verbose_name_plural = _("Room group relations")

    def __str__(self):
        admin_status = " (admin)" if self.is_administrator else ""
        return f"{capfirst(self.room.name):s} / {capfirst(self.group.name):s}{admin_status:s}"


class JitsiConfiguration(BaseModel):
    """Model for the Jitsi configuration of a room or a meeting"""

    meeting = models.ForeignKey(
        Meeting, on_delete=models.CASCADE, null=True, blank=True
    )
    room = models.ForeignKey(Room, on_delete=models.CASCADE, null=True, blank=True)

    class Meta:
        db_table = "magnify_jitsi_configuration"
        verbose_name = _("Jitsi configuration")
        verbose_name_plural = _("Jitsi configurations")
