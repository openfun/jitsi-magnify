"""Magnify core serializers"""

from .rooms import RoomSerializer
from .users import PasswordChangeSerializer, RegistrationSerializer, UserSerializer

# Necessary precision to comply with PEP8
__all__ = [
    "PasswordChangeSerializer",
    "RegistrationSerializer",
    "RoomSerializer",
    "UserSerializer",
]
