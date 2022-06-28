"""Magnify core serializers"""

from .users import (
    UserCreateResponseErrorSerializer,
    UserCreateResponseSuccessSerializer,
    UserSerializer,
)

# Necessary precision to comply with PEP8
__all__ = [
    "UserSerializer",
    "UserCreateResponseSuccessSerializer",
    "UserCreateResponseErrorSerializer",
]
