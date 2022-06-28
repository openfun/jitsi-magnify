"""
Declare and configure the models for the customers part
"""
import django.contrib.auth.models as auth_models
from django.core.validators import RegexValidator
from django.db import models
from django.db.models import F, Q
from django.utils.translation import gettext_lazy as _


class ValidateModelMixin:
    """Make `save` call `full_clean`.

    Should be the left most mixin in your models.
    Django doesn't validate models by default but we should do it.
    """

    def save(self, *args, **kwargs):
        """Call `full_clean` before saving."""
        self.full_clean()
        super().save(*args, **kwargs)


class User(ValidateModelMixin, auth_models.AbstractUser):
    """User model which follow courses or manage backend (is_staff)"""

    class Meta:
        db_table = "magnify_user"
        ordering = ("username",)
        verbose_name = _("User")
        verbose_name_plural = _("Users")

    def __str__(self):
        return self.username


class Label(ValidateModelMixin, models.Model):
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


class Meeting(ValidateModelMixin, models.Model):
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

    administrators = models.ManyToManyField(User)
    labels = models.ManyToManyField(Label, related_name="is_meeting_label_of")

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


class Room(ValidateModelMixin, models.Model):
    """Model for one room"""

    name = models.CharField(max_length=100)
    slug = models.SlugField(max_length=100)
    administrators = models.ManyToManyField(User)
    labels = models.ManyToManyField(Label, related_name="is_room_label_of")

    class Meta:
        db_table = "magnify_room"
        ordering = ("name",)
        verbose_name = _("Room")
        verbose_name_plural = _("Rooms")

    def __str__(self):
        return self.name


class Group(ValidateModelMixin, models.Model):
    """Group of users to be sent in rooms or in sub-rooms"""

    name = models.CharField(max_length=100)
    # token to join group with
    token = models.CharField(max_length=100)
    meetings = models.ManyToManyField(Meeting, related_name="allowed_groups")
    rooms = models.ManyToManyField(Room, related_name="allowed_groups")
    members = models.ManyToManyField(
        User, through="Membership", related_name="is_member_of"
    )
    labels = models.ManyToManyField(Label, related_name="is_group_label_of")

    class Meta:
        db_table = "magnify_group"
        ordering = ("name",)
        verbose_name = _("Group")
        verbose_name_plural = _("Groups")

    def __str__(self):
        return self.name


class Membership(ValidateModelMixin, models.Model):
    """Link table between users and groups"""

    user = models.ForeignKey(User, on_delete=models.CASCADE)
    group = models.ForeignKey(Group, on_delete=models.CASCADE)
    is_administrator = models.BooleanField(default=False)

    class Meta:
        db_table = "magnify_membership"
        verbose_name = _("Membership")
        verbose_name_plural = _("Memberships")


class JitsiConfiguration(ValidateModelMixin, models.Model):
    """Model for the Jitsi configuration of a room or a meeting"""

    meeting = models.ForeignKey(
        Meeting, on_delete=models.CASCADE, null=True, blank=True
    )
    room = models.ForeignKey(Room, on_delete=models.CASCADE, null=True, blank=True)
