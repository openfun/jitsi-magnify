"""
Declare and configure the models for the customers part
"""
import django.contrib.auth.models as auth_models
from django.core.validators import RegexValidator
from django.db import models
from django.utils.translation import gettext_lazy as _


class User(auth_models.AbstractUser):
    """User model"""

    username_validator = RegexValidator(
        "^[a-zA-Z0-9_-]{3,16}$",
        message="""Username must be between 3 and 16 characters long
            and contain only letters, numbers, underscores and hyphens.""",
    )

    username = models.CharField(
        _("username"),
        max_length=150,
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
        validators=[
            RegexValidator(
                regex=r"^[a-zA-Z '-]+$",
                message=_("Only letters, spaces, apostrophe and hyphen are allowed"),
            )
        ],
    )
    email = models.EmailField(
        max_length=255,
        unique=True,
        validators=[
            RegexValidator(
                r"^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$",
                message="Invalid email address",
            )
        ],
    )

    avatar = models.ImageField("Avatar", upload_to="avatars", blank=True, null=True)
    REQUIRED_FIELDS = ["email", "password"]

    class Meta:
        db_table = "magnify_user"
        verbose_name = _("User")
        verbose_name_plural = _("Users")

    def __str__(self):
        return self.username


class Meeting(models.Model):
    """Model for one meeting or a collection of meetings defined recursively"""

    name = models.CharField(max_length=500)

    # Start and end are the same for a single meeting
    start = models.DateField()
    end = models.DateField()

    # Set to True if there is a meeting on that day
    held_on_monday = models.BooleanField(default=False)
    held_on_tuesday = models.BooleanField(default=False)
    held_on_wednesday = models.BooleanField(default=False)
    held_on_thursday = models.BooleanField(default=False)
    held_on_friday = models.BooleanField(default=False)
    held_on_saturday = models.BooleanField(default=False)
    held_on_sunday = models.BooleanField(default=False)

    start_time = models.TimeField()
    expected_duration = models.DurationField()
    administrators = models.ManyToManyField(User)

    class Meta:
        db_table = "magnify_meeting"
        verbose_name = _("Meeting")
        verbose_name_plural = _("Meetings")

    def __str__(self):
        return self.name


class Room(models.Model):
    """Model for one room"""

    name = models.CharField(max_length=100)
    slug = models.SlugField(max_length=100)
    administrators = models.ManyToManyField(User)

    class Meta:
        db_table = "magnify_room"
        verbose_name = _("Room")
        verbose_name_plural = _("Rooms")

    def __str__(self):
        return self.name


class Group(models.Model):
    """Group of users to be sent in rooms or in sub-rooms"""

    name = models.CharField(max_length=100)
    # token to join group with
    token = models.CharField(max_length=100)
    administrators = models.ManyToManyField(User, related_name="is_administrator_of")
    meetings = models.ManyToManyField(Meeting)
    rooms = models.ManyToManyField(Room)
    members = models.ManyToManyField(
        User, through="Membership", related_name="is_member_of"
    )

    class Meta:
        db_table = "magnify_group"
        verbose_name = _("Group")
        verbose_name_plural = _("Groups")


class Membership(models.Model):
    """Link table between users and groups"""

    user = models.ForeignKey(User, on_delete=models.CASCADE)
    group = models.ForeignKey(Group, on_delete=models.CASCADE)
    is_administrator = models.BooleanField(default=False)

    class Meta:
        db_table = "magnify_membership"
        verbose_name = _("Membership")
        verbose_name_plural = _("Memberships")


class Label(models.Model):
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
    groups = models.ManyToManyField(Group)
    rooms = models.ManyToManyField(Room)
    meetings = models.ManyToManyField(Meeting)

    class Meta:
        db_table = "magnify_label"
        verbose_name = _("Label")
        verbose_name_plural = _("Labels")


class JitsiConfiguration(models.Model):
    """Model for the Jitsi configuration of a room or a meeting"""

    meeting = models.ForeignKey(
        Meeting, on_delete=models.CASCADE, null=True, blank=True
    )
    room = models.ForeignKey(Room, on_delete=models.CASCADE, null=True, blank=True)
