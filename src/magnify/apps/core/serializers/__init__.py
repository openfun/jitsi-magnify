"""Magnify core serializers"""

from .users import (
    UserCreateResponseErrorSerializer,
    UserCreateResponseSuccessSerializer,
    UserCreateSerializer,
)

# Necessary precision to comply with PEP8
__all__ = [
    "UserCreateSerializer",
    "UserCreateResponseSuccessSerializer",
    "UserCreateResponseErrorSerializer",
]
