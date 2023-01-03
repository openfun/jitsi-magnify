"""Magnify core serializers"""

from .groups import GroupSerializer
from .meetings import MeetingSerializer
from .rooms import (
    NestedResourceAccessSerializer,
    ResourceAccessSerializer,
    RoomSerializer,
)
from .users import PasswordChangeSerializer, RegistrationSerializer, UserSerializer

# Necessary precision to comply with PEP8
__all__ = [
    "GroupSerializer",
    "MeetingSerializer",
    "NestedResourceAccessSerializer",
    "PasswordChangeSerializer",
    "RegistrationSerializer",
    "RoomSerializer",
    "ResourceAccessSerializer",
    "UserSerializer",
]
