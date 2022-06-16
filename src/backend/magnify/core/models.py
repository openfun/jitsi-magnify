"""
Declare and configure the models for the customers part
"""
from django.db import models
import django.contrib.auth.models as auth_models
from django.core.validators import RegexValidator
from django.utils.translation import gettext_lazy as _


class User(auth_models.AbstractUser):
    """User model which follow courses or manage backend (is_staff)"""

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
    name = models.CharField(max_length=100)
    # token to join group with
    token = models.CharField(max_length=100)
    administrators = models.ManyToManyField(User, related_name="is_administrator_of")
    meetings = models.ManyToManyField(Meeting)
    rooms = models.ManyToManyField(Room)
    members = models.ManyToManyField(User, through="Membership", related_name="is_member_of")

    class Meta:
        db_table = "magnify_group"
        verbose_name = _("Group")
        verbose_name_plural = _("Groups")

class Membership(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    group = models.ForeignKey(Group, on_delete=models.CASCADE)
    is_administrator = models.BooleanField(default=False)

    class Meta:
        db_table = "magnify_membership"
        verbose_name = _("Membership")
        verbose_name_plural = _("Memberships")

class Label(models.Model):
    name = models.CharField(max_length=100)
    color = models.CharField(max_length=7, validators=[RegexValidator(regex='^#([a-fA-F0-9]{6}|[a-fA-F0-9]{3})$', message='Color must be a valid hexa code', code='nomatch')])
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
    meeting = models.ForeignKey(Meeting, on_delete=models.CASCADE)
    room = models.ForeignKey(Room, on_delete=models.CASCADE)
    
    # The following fields are to be changed when we learn more about what is configurable
    is_open = models.BooleanField(default=False)
    has_microphone_by_default = models.BooleanField(default=False)
    has_camera_by_default = models.BooleanField(default=False)

    class Meta:
        db_table = "magnify_jitsi_configuration"
        verbose_name = _("Jitsi Configuration")
        verbose_name_plural = _("Jitsi Configurations")
