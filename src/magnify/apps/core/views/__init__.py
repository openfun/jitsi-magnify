"""Magnify core views"""

from .room_token_view import RoomTokenView
from .user import UserCreateView, UserView

# Necessary precision to comply with PEP8
__all__ = ["RoomTokenView", "UserCreateView", "UserView"]
