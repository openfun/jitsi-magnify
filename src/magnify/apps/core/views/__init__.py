"""Magnify core views"""

from .room_token_view import RoomTokenView
from .debug_emails import SignupEmailDebugView

# Necessary precision to comply with PEP8
__all__ = [
    "RoomTokenView",
    "SignupEmailDebugView",
]
