"""Magnify core serializers"""

from .rooms import RoomGroupSerializer, RoomSerializer, RoomUserSerializer
from .users import PasswordChangeSerializer, RegistrationSerializer, UserSerializer

# Necessary precision to comply with PEP8
__all__ = [
    "PasswordChangeSerializer",
    "RegistrationSerializer",
    "RoomSerializer",
    "RoomGroupSerializer",
    "RoomUserSerializer",
    "UserSerializer",
]
