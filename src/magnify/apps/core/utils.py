"""
Utils that can be useful throughout Magnify's core app
"""
from datetime import date, timedelta

from django.conf import settings
from django.utils import timezone

from livekit import api

import jwt
from rest_framework_simplejwt.tokens import RefreshToken


def get_date_of_weekday_in_nth_week(year, month, nth_week, week_day):
    """
    Returns the date corresponding to the nth weekday of a month.
    e.g. 3rd Friday of July 2022 is July 15, 2002 so:

    > get_date_of_weekday_in_nth_week(2022, 7, 3, 4)
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


def create_video_grants(user, room, is_admin=False):
    """Creates video grants given room and user permission"""
    grants = api.VideoGrants(room_join = True, room = room, can_publish= True, room_admin=is_admin)
    return grants


def create_livekit_token(user, room, is_admin=False) :
    """Create the payload so that it contains each information jitsi requires"""
    expiration_seconds = int(
        settings.LIVEKIT_CONFIGURATION["livekit_token_expiration_seconds"]
    )

    video_grants = create_video_grants(user, room, is_admin)
    token_payload = api.AccessToken(
        settings.LIVEKIT_CONFIGURATION["livekit_api_key"],
        settings.LIVEKIT_CONFIGURATION["livekit_api_secret"],
    ).with_identity(settings.LIVEKIT_CONFIGURATION["livekit_domain"]).with_name(user.username).with_grants(video_grants).with_ttl(timedelta(seconds=expiration_seconds))

    return token_payload.to_jwt()


def generate_token(user, room, is_admin=False):
    """Generate the access token that will give access to the room"""
    token = create_livekit_token(user, room, is_admin)

    return token


def get_tokens_for_user(user):
    """Get JWT tokens for user authentication."""
    refresh = RefreshToken.for_user(user)
    test = settings.LIVEKIT_CONFIGURATION["livekit_token_expiration_seconds"]
    return {
        "refresh": str(refresh),
        "access": str(refresh.access_token),
    }
