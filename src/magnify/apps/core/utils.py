"""
Utils that can be useful throughout Magnify's core app
"""
from datetime import date, timedelta

from django.conf import settings
from django.utils import timezone

import jwt
from rest_framework_simplejwt.tokens import RefreshToken


def get_weekday_in_nth_week(year, month, nth_week, week_day):
    """
    Returns the date corresponding to the nth weekday of a month.
    e.g. 3rd Friday of July 2022 is July 15, 2002 so:

    > get_weekday_in_nth_week(2022, 7, 3, 4)
    date(2022, 7, 15)
    """
    new_date = date(year, month, 1)
    delta = (week_day - new_date.weekday()) % 7
    new_date += timedelta(days=delta)
    new_date += timedelta(weeks=nth_week - 1)
    return new_date


def get_nth_week_number(original_date):
    """
    Returns the number of the week within the month for the date passed in argment.
    e.g. July 15, 2022 is the 3rd Friday of the month of Juy 2022 so:

    > get_nth_week_number(date(2022, 7, 15))
    3
    """
    first_day = original_date.replace(day=1)
    first_week_last_day = 7 - first_day.weekday()
    day_of_month = original_date.day
    if day_of_month < first_week_last_day:
        return 1
    nb_weeks = 1 + (day_of_month - first_week_last_day) // 7
    if first_day.weekday() <= original_date.weekday():
        nb_weeks += 1
    return nb_weeks


def create_token_payload(user, room, is_admin=False):
    """Create the payload so that it contains each information jitsi requires"""
    expiration_seconds = int(settings.JWT_CONFIGURATION.get("token_expiration_seconds"))
    token_payload = {
        "exp": timezone.now() + timedelta(seconds=expiration_seconds),
        "iat": timezone.now(),
        "moderator": is_admin or user.is_staff,
        "aud": "jitsi",
        "iss": settings.JWT_CONFIGURATION["jitsi_app_id"],
        "sub": settings.JWT_CONFIGURATION["jitsi_xmpp_domain"],
        "room": room,
    }

    jitsi_user = {
        "avatar": settings.JWT_CONFIGURATION.get("guest_avatar"),
        "name": user.username
        if user.is_authenticated
        else settings.JWT_CONFIGURATION.get("guest_username"),
        "email": user.email if user.is_authenticated else "",
    }

    token_payload["context"] = {"user": jitsi_user}
    return token_payload


def generate_token(user, room, is_admin=False):
    """Generate the access token that will give access to the room"""
    token_payload = create_token_payload(user, room, is_admin=is_admin)
    token = jwt.encode(
        token_payload,
        settings.JWT_CONFIGURATION["jitsi_secret_key"],
        algorithm="HS256",
    )

    return token


def get_tokens_for_user(user):
    """Get JWT tokens for user authentication."""
    refresh = RefreshToken.for_user(user)

    return {
        "refresh": str(refresh),
        "access": str(refresh.access_token),
    }
