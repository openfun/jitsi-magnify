from django.db import models
import django.contrib.auth.models as auth_models

class User(auth_models.AbstractUser):
    """User model which follow courses or manage backend (is_staff)"""

    class Meta:
        db_table = "magnify_user"
        verbose_name = "Users"

    def __str__(self):
        return self.username
