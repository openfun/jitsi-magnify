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
    """Model for one meeting or a collection of meetings defined reccursively"""
    name = models.CharField(max_length=100)

    # Start and end are the same for a single meeting
    start = models.DateTimeField()
    end = models.DateTimeField()

    # Set to True if there is a meeting on that day
    monday = models.BooleanField(default=False)
    tuesday = models.BooleanField(default=False)
    wednesday = models.BooleanField(default=False)
    thursday = models.BooleanField(default=False)
    friday = models.BooleanField(default=False)
    saturday = models.BooleanField(default=False)
    sunday = models.BooleanField(default=False)

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
    token_id = models.CharField(max_length=100)
    token = models.CharField(max_length=100)
    administrators = models.ManyToManyField(User)
    group_meeting = models.ManyToManyField(Meeting)
    group_room = models.ManyToManyField(Room)
    members = models.ManyToManyField(User, related_name="GroupMembers")

    class Meta:
        db_table = "magnify_group"
        verbose_name = _("Group")
        verbose_name_plural = _("Groups")

class GroupMembers(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    group = models.ForeignKey(Group, on_delete=models.CASCADE)
    is_administrator = models.BooleanField(default=False)

    class Meta:
        db_table = "magnify_group_member"
        verbose_name = _("Group Member")
        verbose_name_plural = _("Group Members")

class Label(models.Model):
    name = models.CharField(max_length=100)
    color = models.CharField(validators=[RegexValidator(regex='^#([a-fA-F0-9]{6}|[a-fA-F0-9]{3})$', message='Color must be a valid hexa code', code='nomatch')])
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