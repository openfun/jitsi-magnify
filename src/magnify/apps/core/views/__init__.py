"""Magnify core views"""

from .room_token_view import RoomTokenView
from .user import UserViewSet

# Necessary precision to comply with PEP8
__all__ = ["RoomTokenView", "UserViewSet"]
