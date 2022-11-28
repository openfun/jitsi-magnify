"""Magnify core serializers"""

from .groups import GroupSerializer
from .meetings import MeetingSerializer
from .rooms import (
    NestedRoomUserAccessSerializer,
    RoomGroupAccessSerializer,
    RoomSerializer,
    RoomUserAccessSerializer,
)
from .users import PasswordChangeSerializer, RegistrationSerializer, UserSerializer

# Necessary precision to comply with PEP8
__all__ = [
    "GroupSerializer",
    "MeetingSerializer",
    "NestedRoomUserAccessSerializer",
    "PasswordChangeSerializer",
    "RegistrationSerializer",
    "RoomGroupAccessSerializer",
    "RoomSerializer",
    "RoomUserAccessSerializer",
    "UserSerializer",
]
