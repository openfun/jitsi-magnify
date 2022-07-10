"""Magnify core serializers"""

from .meetings import MeetingSerializer
from .rooms import RoomGroupAccessSerializer, RoomSerializer, RoomUserAccessSerializer
from .users import PasswordChangeSerializer, RegistrationSerializer, UserSerializer

# Necessary precision to comply with PEP8
__all__ = [
    "MeetingSerializer",
    "PasswordChangeSerializer",
    "RegistrationSerializer",
    "RoomSerializer",
    "RoomGroupAccessSerializer",
    "RoomUserAccessSerializer",
    "UserSerializer",
]
