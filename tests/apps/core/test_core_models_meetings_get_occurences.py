"""Unit tests for the `get_occurrences` method on the Meeting model."""
import random
from datetime import datetime
from zoneinfo import ZoneInfo

from django.core.exceptions import ValidationError
from django.test import TestCase

from magnify.apps.core.factories import MeetingFactory

# pylint: disable=too-many-public-methods


class OccurencesMeetingsModelsTestCase(TestCase):
    """Unit test suite to validate the behavior of meeting occurrences."""

    # No recurence

    def test_models_meetings_get_occurrences_no_recurrence(self):
        """A meeting without recurrence should return 1 occurence."""
        meeting = MeetingFactory(
            start=datetime(2022, 7, 7, 9, 0, tzinfo=ZoneInfo("UTC")),
            recurrence=None,
        )
        self.assertEqual(
            meeting.get_occurrences(
                datetime(2020, 3, 15, 9, 0, tzinfo=ZoneInfo("UTC")),
                datetime(2050, 1, 1, 9, 0, tzinfo=ZoneInfo("UTC")),
            ),
            [datetime(2022, 7, 7, 9, 0, tzinfo=ZoneInfo("UTC"))],
        )
        self.assertEqual(
            meeting.get_occurrences(
                datetime(2022, 7, 8, 9, 0, tzinfo=ZoneInfo("UTC")),
                datetime(2050, 1, 1, 9, 0, tzinfo=ZoneInfo("UTC")),
            ),
            [],
        )

    # Daily

    def test_models_meetings_get_occurrences_daily_nb_occurrences_filled(self):
        """
        Daily occurences with date of end of reccurrence filled in but not number of occurrences.
        """
        meeting = MeetingFactory(
            start=datetime(2022, 10, 27, 9, 0, tzinfo=ZoneInfo("UTC")),
            recurrence="daily",
            frequency=1,
            timezone=ZoneInfo("Europe/Paris"),
            recurring_until=datetime(2022, 11, 8, 9, 0, tzinfo=ZoneInfo("UTC")),
            nb_occurrences=None,
        )
        self.assertEqual(meeting.nb_occurrences, 12)
        self.assertEqual(
            meeting.get_occurrences(
                datetime(2020, 3, 15, 9, 0, tzinfo=ZoneInfo("UTC")),
                datetime(2050, 1, 1, 9, 0, tzinfo=ZoneInfo("UTC")),
            ),
            [
                datetime(2022, 10, 27, 9, 0, tzinfo=ZoneInfo("UTC")),
                datetime(2022, 10, 28, 9, 0, tzinfo=ZoneInfo("UTC")),
                datetime(2022, 10, 29, 9, 0, tzinfo=ZoneInfo("UTC")),
                # After DST
                datetime(2022, 10, 30, 10, 0, tzinfo=ZoneInfo("UTC")),
                datetime(2022, 10, 31, 10, 0, tzinfo=ZoneInfo("UTC")),
                datetime(2022, 11, 1, 10, 0, tzinfo=ZoneInfo("UTC")),
                datetime(2022, 11, 2, 10, 0, tzinfo=ZoneInfo("UTC")),
                datetime(2022, 11, 3, 10, 0, tzinfo=ZoneInfo("UTC")),
                datetime(2022, 11, 4, 10, 0, tzinfo=ZoneInfo("UTC")),
                datetime(2022, 11, 5, 10, 0, tzinfo=ZoneInfo("UTC")),
                datetime(2022, 11, 6, 10, 0, tzinfo=ZoneInfo("UTC")),
                datetime(2022, 11, 7, 10, 0, tzinfo=ZoneInfo("UTC")),
            ],
        )

        meeting = MeetingFactory(
            start=datetime(2022, 10, 27, 9, 0, tzinfo=ZoneInfo("UTC")),
            recurrence="daily",
            frequency=3,
            timezone=ZoneInfo("Europe/Paris"),
            recurring_until=datetime(2022, 11, 8, 9, 0, tzinfo=ZoneInfo("UTC")),
            nb_occurrences=None,
        )
        self.assertEqual(meeting.nb_occurrences, 4)
        # The date of end of recurrence should be corrected
        self.assertEqual(
            meeting.recurring_until,
            datetime(2022, 11, 5, 10, 0, tzinfo=ZoneInfo("UTC")),
        )
        self.assertEqual(
            meeting.get_occurrences(
                datetime(2020, 3, 15, 9, 0, tzinfo=ZoneInfo("UTC")),
                datetime(2050, 1, 1, 9, 0, tzinfo=ZoneInfo("UTC")),
            ),
            [
                datetime(2022, 10, 27, 9, 0, tzinfo=ZoneInfo("UTC")),
                datetime(2022, 10, 30, 10, 0, tzinfo=ZoneInfo("UTC")),
                datetime(2022, 11, 2, 10, 0, tzinfo=ZoneInfo("UTC")),
                datetime(2022, 11, 5, 10, 0, tzinfo=ZoneInfo("UTC")),
            ],
        )

    def test_models_meetings_get_occurrences_daily_reset_recurring_until(self):
        """
        Daily occurences with date of end of reccurrence not leaving any possibility of
        repeated occurence.
        """
        meeting = MeetingFactory(
            start=datetime(2022, 7, 7, 9, 0, tzinfo=ZoneInfo("UTC")),
            recurrence="daily",
            timezone=ZoneInfo("Europe/Paris"),
            frequency=3,
            recurring_until=datetime(2022, 7, 9, 9, 0, tzinfo=ZoneInfo("UTC")),
            nb_occurrences=None,
        )
        self.assertIsNone(meeting.recurrence)
        self.assertEqual(meeting.nb_occurrences, 1)
        self.assertEqual(meeting.recurring_until, meeting.start)
        self.assertEqual(meeting.weekdays, "3")
        self.assertEqual(
            meeting.get_occurrences(
                datetime(2020, 3, 15, 9, 0, tzinfo=ZoneInfo("UTC")),
                datetime(2050, 1, 1, 9, 0, tzinfo=ZoneInfo("UTC")),
            ),
            [datetime(2022, 7, 7, 9, 0, tzinfo=ZoneInfo("UTC"))],
        )

    def test_models_meetings_get_occurrences_daily_recurring_until_filled(self):
        """
        Daily occurences with number of occurences filled in but not date of end of occurence.
        The date of end of reccurrence shoud be calculated if the number of occurrences is
        repeated.
        """
        meeting = MeetingFactory(
            start=datetime(2022, 10, 27, 9, 0, tzinfo=ZoneInfo("UTC")),
            recurrence="daily",
            frequency=1,
            timezone=ZoneInfo("Europe/Paris"),
            recurring_until=None,
            nb_occurrences=6,
        )
        self.assertEqual(
            meeting.recurring_until,
            datetime(2022, 11, 1, 10, 0, tzinfo=ZoneInfo("UTC")),
        )
        self.assertEqual(
            meeting.get_occurrences(
                datetime(2020, 3, 15, 9, 0, tzinfo=ZoneInfo("UTC")),
                datetime(2050, 1, 1, 9, 0, tzinfo=ZoneInfo("UTC")),
            ),
            [
                datetime(2022, 10, 27, 9, 0, tzinfo=ZoneInfo("UTC")),
                datetime(2022, 10, 28, 9, 0, tzinfo=ZoneInfo("UTC")),
                datetime(2022, 10, 29, 9, 0, tzinfo=ZoneInfo("UTC")),
                datetime(2022, 10, 30, 10, 0, tzinfo=ZoneInfo("UTC")),
                datetime(2022, 10, 31, 10, 0, tzinfo=ZoneInfo("UTC")),
                datetime(2022, 11, 1, 10, 0, tzinfo=ZoneInfo("UTC")),
            ],
        )

        meeting = MeetingFactory(
            start=datetime(2022, 10, 27, 9, 0, tzinfo=ZoneInfo("UTC")),
            recurrence="daily",
            frequency=3,
            timezone=ZoneInfo("Europe/Paris"),
            recurring_until=None,
            nb_occurrences=6,
        )
        self.assertEqual(
            meeting.recurring_until,
            datetime(2022, 11, 11, 10, 0, tzinfo=ZoneInfo("UTC")),
        )
        self.assertEqual(
            meeting.get_occurrences(
                datetime(2020, 3, 15, 9, 0, tzinfo=ZoneInfo("UTC")),
                datetime(2050, 1, 1, 9, 0, tzinfo=ZoneInfo("UTC")),
            ),
            [
                datetime(2022, 10, 27, 9, 0, tzinfo=ZoneInfo("UTC")),
                # After DST
                datetime(2022, 10, 30, 10, 0, tzinfo=ZoneInfo("UTC")),
                datetime(2022, 11, 2, 10, 0, tzinfo=ZoneInfo("UTC")),
                datetime(2022, 11, 5, 10, 0, tzinfo=ZoneInfo("UTC")),
                datetime(2022, 11, 8, 10, 0, tzinfo=ZoneInfo("UTC")),
                datetime(2022, 11, 11, 10, 0, tzinfo=ZoneInfo("UTC")),
            ],
        )

    def test_models_meetings_get_occurrences_daily_reset_nb_occurrences(self):
        """
        Daily occurences with number of occurrences less or equal to 1, should lead to
        resettings reccurrence.
        """
        meeting = MeetingFactory(
            start=datetime(2022, 7, 7, 9, 0, tzinfo=ZoneInfo("UTC")),
            recurrence="daily",
            frequency=3,
            timezone=ZoneInfo("Europe/Paris"),
            recurring_until=None,
            nb_occurrences=random.choice([0, 1]),
        )
        self.assertIsNone(meeting.recurrence)
        self.assertEqual(meeting.nb_occurrences, 1)
        self.assertEqual(meeting.recurring_until, meeting.start)
        self.assertEqual(meeting.weekdays, "3")
        self.assertEqual(
            meeting.get_occurrences(
                datetime(2020, 3, 15, 9, 0, tzinfo=ZoneInfo("UTC")),
                datetime(2050, 1, 1, 9, 0, tzinfo=ZoneInfo("UTC")),
            ),
            [datetime(2022, 7, 7, 9, 0, tzinfo=ZoneInfo("UTC"))],
        )

    def test_models_meetings_get_occurrences_daily_infinite(self):
        """Daily occurences can be infinite."""
        meeting = MeetingFactory(
            start=datetime(2022, 7, 7, 9, 0, tzinfo=ZoneInfo("UTC")),
            recurrence="daily",
            frequency=1,
            timezone=ZoneInfo("America/Toronto"),
            recurring_until=None,
            nb_occurrences=None,
        )
        self.assertIsNone(meeting.nb_occurrences)
        self.assertIsNone(meeting.recurring_until)

        occurrences = meeting.get_occurrences(
            datetime(2020, 3, 15, 9, 0, tzinfo=ZoneInfo("UTC")),
            datetime(2050, 1, 1, 10, 0, tzinfo=ZoneInfo("UTC")),
        )
        self.assertEqual(
            occurrences[-1], datetime(2050, 1, 1, 10, 0, tzinfo=ZoneInfo("UTC"))
        )
        self.assertEqual(len(occurrences), 10041)

        occurrences = meeting.get_occurrences(
            datetime(2020, 3, 15, 9, 0, tzinfo=ZoneInfo("UTC")),
            datetime(2050, 1, 1, 9, 59, tzinfo=ZoneInfo("UTC")),
        )
        self.assertEqual(
            occurrences[-1], datetime(2049, 12, 31, 10, 0, tzinfo=ZoneInfo("UTC"))
        )
        self.assertEqual(len(occurrences), 10040)

    # Weekly

    def test_models_meetings_get_occurrences_weekly_null_weekdays_is_reset(self):
        """
        Weekly recurrence should set weekdays or it is not really a recurrence and should
        be reset.
        """
        meeting = MeetingFactory(recurrence="weekly")
        self.assertIsNone(meeting.recurrence)

    def test_models_meetings_get_occurrences_weekly_weekdays_include_start(self):
        """
        For weekly recurrence, the weekday of the start date should be included in weekdays.
        """
        with self.assertRaises(ValidationError) as context:
            # 2022-7-7 is a Thursday, and weekday 2 is Tuesday
            MeetingFactory(
                start=datetime(2022, 7, 7, 9, 0, tzinfo=ZoneInfo("UTC")),
                recurrence="weekly",
                timezone=ZoneInfo("Europe/Paris"),
                weekdays="2",
            )

        self.assertEqual(
            context.exception.messages,
            ["Weekdays should contain the start date."],
        )

    def test_models_meetings_get_occurrences_weekly_reset_weekdays(self):
        """Reset weekdays when recurrence is set to something else than weekly"""
        meeting = MeetingFactory(
            start=datetime(2022, 7, 6, 9, 0, tzinfo=ZoneInfo("UTC")),
            recurrence="weekly",
            frequency=1,
            timezone=ZoneInfo("Europe/Paris"),
            recurring_until=datetime(2022, 8, 2, 9, 0, tzinfo=ZoneInfo("UTC")),
            nb_occurrences=None,
            weekdays="26",
        )
        self.assertEqual(meeting.weekdays, "26")
        meeting.recurrence = "daily"
        meeting.save()
        meeting.refresh_from_db()
        self.assertEqual(meeting.weekdays, None)
        meeting.recurrence = "weekly"
        meeting.weekdays = "126"
        meeting.save()
        meeting.refresh_from_db()
        self.assertEqual(meeting.weekdays, "126")

    def test_models_meetings_get_occurrences_weekly_recurring_until_filled(self):
        """
        Weekly occurences with date of end of reccurrence filled in but not number of occurrences.
        """
        # 2022-10-27 is a Thursday
        meeting = MeetingFactory(
            start=datetime(2022, 10, 27, 9, 0, tzinfo=ZoneInfo("UTC")),
            recurrence="weekly",
            frequency=1,
            timezone=ZoneInfo("Europe/Paris"),
            recurring_until=datetime(2022, 11, 8, 10, 0, tzinfo=ZoneInfo("UTC")),
            nb_occurrences=None,
            weekdays="135",  # Tuesday, Thursday and Saturday
        )
        self.assertEqual(meeting.nb_occurrences, 6)
        self.assertEqual(
            meeting.get_occurrences(
                datetime(2020, 3, 15, 9, 0, tzinfo=ZoneInfo("UTC")),
                datetime(2050, 1, 1, 9, 0, tzinfo=ZoneInfo("UTC")),
            ),
            [
                datetime(2022, 10, 27, 9, 0, tzinfo=ZoneInfo("UTC")),
                datetime(2022, 10, 29, 9, 0, tzinfo=ZoneInfo("UTC")),
                datetime(2022, 11, 1, 10, 0, tzinfo=ZoneInfo("UTC")),
                datetime(2022, 11, 3, 10, 0, tzinfo=ZoneInfo("UTC")),
                datetime(2022, 11, 5, 10, 0, tzinfo=ZoneInfo("UTC")),
                datetime(2022, 11, 8, 10, 0, tzinfo=ZoneInfo("UTC")),
            ],
        )

        self.assertEqual(
            meeting.get_occurrences(
                datetime(2022, 10, 27, 9, 1, tzinfo=ZoneInfo("UTC")),
                datetime(2022, 11, 1, 10, 0, tzinfo=ZoneInfo("UTC")),
            ),
            [
                datetime(2022, 10, 29, 9, 0, tzinfo=ZoneInfo("UTC")),
                datetime(2022, 11, 1, 10, 0, tzinfo=ZoneInfo("UTC")),
            ],
        )

        meeting = MeetingFactory(
            start=datetime(2022, 10, 27, 9, 0, tzinfo=ZoneInfo("UTC")),
            recurrence="weekly",
            frequency=3,
            timezone=ZoneInfo("Europe/Paris"),
            recurring_until=datetime(2022, 12, 7, 10, 0, tzinfo=ZoneInfo("UTC")),
            nb_occurrences=None,
            weekdays="135",
        )
        self.assertEqual(meeting.nb_occurrences, 6)
        self.assertEqual(
            meeting.get_occurrences(
                datetime(2020, 3, 15, 9, 0, tzinfo=ZoneInfo("UTC")),
                datetime(2050, 1, 1, 9, 0, tzinfo=ZoneInfo("UTC")),
            ),
            [
                datetime(2022, 10, 27, 9, 0, tzinfo=ZoneInfo("UTC")),
                datetime(2022, 10, 29, 9, 0, tzinfo=ZoneInfo("UTC")),
                datetime(2022, 11, 15, 10, 0, tzinfo=ZoneInfo("UTC")),
                datetime(2022, 11, 17, 10, 0, tzinfo=ZoneInfo("UTC")),
                datetime(2022, 11, 19, 10, 0, tzinfo=ZoneInfo("UTC")),
                datetime(2022, 12, 6, 10, 0, tzinfo=ZoneInfo("UTC")),
            ],
        )

    def test_models_meetings_get_occurrences_weekly_nb_occurrences_filled(self):
        """
        Weekly occurences with number of occurrences filled in but not date of end of reccurrence.
        """
        meeting = MeetingFactory(
            start=datetime(2022, 10, 27, 9, 0, tzinfo=ZoneInfo("UTC")),
            recurrence="weekly",
            frequency=1,
            timezone=ZoneInfo("Europe/Paris"),
            recurring_until=None,
            nb_occurrences=5,
            weekdays="36",  # Thursday and Sunday
        )

        self.assertEqual(
            meeting.get_occurrences(
                datetime(2020, 3, 15, 9, 0, tzinfo=ZoneInfo("UTC")),
                datetime(2050, 1, 1, 9, 0, tzinfo=ZoneInfo("UTC")),
            ),
            [
                datetime(2022, 10, 27, 9, 0, tzinfo=ZoneInfo("UTC")),
                datetime(2022, 10, 30, 10, 0, tzinfo=ZoneInfo("UTC")),
                datetime(2022, 11, 3, 10, 0, tzinfo=ZoneInfo("UTC")),
                datetime(2022, 11, 6, 10, 0, tzinfo=ZoneInfo("UTC")),
                datetime(2022, 11, 10, 10, 0, tzinfo=ZoneInfo("UTC")),
            ],
        )
        self.assertEqual(
            meeting.recurring_until,
            datetime(2022, 11, 10, 10, 0, tzinfo=ZoneInfo("UTC")),
        )

        meeting = MeetingFactory(
            start=datetime(2022, 10, 27, 9, 0, tzinfo=ZoneInfo("UTC")),
            recurrence="weekly",
            frequency=3,
            timezone=ZoneInfo("Europe/Paris"),
            recurring_until=None,
            nb_occurrences=3,
            weekdays="36",
        )
        self.assertEqual(
            meeting.get_occurrences(
                datetime(2020, 3, 15, 9, 0, tzinfo=ZoneInfo("UTC")),
                datetime(2050, 1, 1, 9, 0, tzinfo=ZoneInfo("UTC")),
            ),
            [
                datetime(2022, 10, 27, 9, 0, tzinfo=ZoneInfo("UTC")),
                datetime(2022, 10, 30, 10, 0, tzinfo=ZoneInfo("UTC")),
                datetime(2022, 11, 17, 10, 0, tzinfo=ZoneInfo("UTC")),
            ],
        )
        self.assertEqual(
            meeting.get_occurrences(
                datetime(2022, 11, 17, 9, 0, tzinfo=ZoneInfo("UTC")),
                datetime(2022, 11, 20, 9, 0, tzinfo=ZoneInfo("UTC")),
            ),
            [datetime(2022, 11, 17, 10, 0, tzinfo=ZoneInfo("UTC"))],
        )
        self.assertEqual(
            meeting.recurring_until,
            datetime(2022, 11, 17, 10, 0, tzinfo=ZoneInfo("UTC")),
        )

    def test_models_meetings_get_occurrences_weekly_infinite(self):
        """Weekly occurences can be infinite."""
        meeting = MeetingFactory(
            start=datetime(2022, 10, 27, 9, 0, tzinfo=ZoneInfo("UTC")),
            recurrence="weekly",
            frequency=1,
            timezone=ZoneInfo("Europe/Paris"),
            recurring_until=None,
            nb_occurrences=None,
            weekdays="3",  # Thursday
        )
        self.assertIsNone(meeting.nb_occurrences)
        self.assertIsNone(meeting.recurring_until)

        occurrences = meeting.get_occurrences(
            datetime(2020, 3, 15, 9, 0, tzinfo=ZoneInfo("UTC")),
            datetime(2050, 1, 1, 9, 0, tzinfo=ZoneInfo("UTC")),
        )
        self.assertEqual(
            occurrences[-1], datetime(2049, 12, 30, 10, 0, tzinfo=ZoneInfo("UTC"))
        )
        self.assertEqual(len(occurrences), 1419)

    def test_models_meetings_get_occurrences_weekly_weekdays_0(self):
        """
        Edge case of weekly recurrence is when the day of the week is monday (0).
        """
        meeting = MeetingFactory(
            start=datetime(2022, 8, 8, 9, 0, tzinfo=ZoneInfo("UTC")),
            recurrence="weekly",
            frequency=1,
            timezone=ZoneInfo("Europe/Paris"),
            nb_occurrences=2,
            weekdays="0",  # Monday
        )
        self.assertEqual(meeting.nb_occurrences, 2)
        self.assertEqual(
            meeting.get_occurrences(
                datetime(2020, 3, 15, 9, 0, tzinfo=ZoneInfo("UTC")),
                datetime(2050, 1, 1, 9, 0, tzinfo=ZoneInfo("UTC")),
            ),
            [
                datetime(2022, 8, 8, 9, 0, tzinfo=ZoneInfo("UTC")),
                datetime(2022, 8, 15, 9, 0, tzinfo=ZoneInfo("UTC")),
            ],
        )

        meeting = MeetingFactory(
            start=datetime(2022, 8, 8, 9, 0, tzinfo=ZoneInfo("UTC")),
            recurrence="weekly",
            frequency=3,
            timezone=ZoneInfo("Europe/Paris"),
            nb_occurrences=2,
            weekdays="0",  # Monday
        )
        self.assertEqual(meeting.nb_occurrences, 2)
        self.assertEqual(
            meeting.get_occurrences(
                datetime(2020, 3, 15, 9, 0, tzinfo=ZoneInfo("UTC")),
                datetime(2050, 1, 1, 9, 0, tzinfo=ZoneInfo("UTC")),
            ),
            [
                datetime(2022, 8, 8, 9, 0, tzinfo=ZoneInfo("UTC")),
                datetime(2022, 8, 29, 9, 0, tzinfo=ZoneInfo("UTC")),
            ],
        )

    # Monthly

    def test_models_meetings_get_occurrences_monthly_nb_occurrences_filled_datetime(
        self,
    ):
        """
        Monthly occurences with date of end of recurrence filled in but not number of occurences.
        The monthly reccurence is on the precise date each month
        """
        meeting = MeetingFactory(
            start=datetime(2022, 10, 7, 9, 0, tzinfo=ZoneInfo("UTC")),
            recurrence="monthly",
            frequency=1,
            timezone=ZoneInfo("Europe/Paris"),
            recurring_until=datetime(2023, 4, 8, 9, 0, tzinfo=ZoneInfo("UTC")),
            nb_occurrences=None,
        )

        self.assertEqual(meeting.nb_occurrences, 7)
        self.assertEqual(
            meeting.get_occurrences(
                datetime(2020, 3, 15, 9, 0, tzinfo=ZoneInfo("UTC")),
                datetime(2050, 1, 1, 9, 0, tzinfo=ZoneInfo("UTC")),
            ),
            [
                datetime(2022, 10, 7, 9, 0, tzinfo=ZoneInfo("UTC")),
                # beginning of DST
                datetime(2022, 11, 7, 10, 0, tzinfo=ZoneInfo("UTC")),
                datetime(2022, 12, 7, 10, 0, tzinfo=ZoneInfo("UTC")),
                datetime(2023, 1, 7, 10, 0, tzinfo=ZoneInfo("UTC")),
                datetime(2023, 2, 7, 10, 0, tzinfo=ZoneInfo("UTC")),
                datetime(2023, 3, 7, 10, 0, tzinfo=ZoneInfo("UTC")),
                # end of DST
                datetime(2023, 4, 7, 9, 0, tzinfo=ZoneInfo("UTC")),
            ],
        )

        meeting = MeetingFactory(
            start=datetime(2022, 10, 7, 9, 0, tzinfo=ZoneInfo("UTC")),
            recurrence="monthly",
            frequency=3,
            timezone=ZoneInfo("Europe/Paris"),
            recurring_until=datetime(2023, 4, 8, 9, 0, tzinfo=ZoneInfo("UTC")),
            nb_occurrences=None,
        )
        self.assertEqual(meeting.nb_occurrences, 3)
        self.assertEqual(
            meeting.get_occurrences(
                datetime(2020, 3, 15, 9, 0, tzinfo=ZoneInfo("UTC")),
                datetime(2050, 1, 1, 9, 0, tzinfo=ZoneInfo("UTC")),
            ),
            [
                datetime(2022, 10, 7, 9, 0, tzinfo=ZoneInfo("UTC")),
                datetime(2023, 1, 7, 10, 0, tzinfo=ZoneInfo("UTC")),
                datetime(2023, 4, 7, 9, 0, tzinfo=ZoneInfo("UTC")),
            ],
        )

    def test_models_meetings_get_occurrences_monthly_recurring_until_filled_datetime(
        self,
    ):
        """
        Monthly occurences with number of occurrences filled in but not date of end of reccurrence.
        The monthly reccurence is on the precise date each month
        """
        meeting = MeetingFactory(
            start=datetime(2022, 10, 7, 9, 0, tzinfo=ZoneInfo("UTC")),
            recurrence="monthly",
            frequency=1,
            timezone=ZoneInfo("Europe/Paris"),
            recurring_until=None,
            nb_occurrences=7,
        )
        self.assertEqual(
            meeting.recurring_until, datetime(2023, 4, 7, 9, 0, tzinfo=ZoneInfo("UTC"))
        )
        self.assertEqual(
            meeting.get_occurrences(
                datetime(2020, 3, 15, 9, 0, tzinfo=ZoneInfo("UTC")),
                datetime(2050, 1, 1, 9, 0, tzinfo=ZoneInfo("UTC")),
            ),
            [
                datetime(2022, 10, 7, 9, 0, tzinfo=ZoneInfo("UTC")),
                # Beginning of DST
                datetime(2022, 11, 7, 10, 0, tzinfo=ZoneInfo("UTC")),
                datetime(2022, 12, 7, 10, 0, tzinfo=ZoneInfo("UTC")),
                datetime(2023, 1, 7, 10, 0, tzinfo=ZoneInfo("UTC")),
                datetime(2023, 2, 7, 10, 0, tzinfo=ZoneInfo("UTC")),
                datetime(2023, 3, 7, 10, 0, tzinfo=ZoneInfo("UTC")),
                # End of DST
                datetime(2023, 4, 7, 9, 0, tzinfo=ZoneInfo("UTC")),
            ],
        )

        meeting = MeetingFactory(
            start=datetime(2022, 10, 7, 9, 0, tzinfo=ZoneInfo("UTC")),
            recurrence="monthly",
            frequency=3,
            timezone=ZoneInfo("Europe/Paris"),
            recurring_until=None,
            nb_occurrences=8,
        )
        self.assertEqual(
            meeting.recurring_until, datetime(2024, 7, 7, 9, 0, tzinfo=ZoneInfo("UTC"))
        )
        self.assertEqual(
            meeting.get_occurrences(
                datetime(2020, 3, 15, 9, 0, tzinfo=ZoneInfo("UTC")),
                datetime(2050, 1, 1, 9, 0, tzinfo=ZoneInfo("UTC")),
            ),
            [
                datetime(2022, 10, 7, 9, 0, tzinfo=ZoneInfo("UTC")),
                datetime(2023, 1, 7, 10, 0, tzinfo=ZoneInfo("UTC")),
                datetime(2023, 4, 7, 9, 0, tzinfo=ZoneInfo("UTC")),
                datetime(2023, 7, 7, 9, 0, tzinfo=ZoneInfo("UTC")),
                datetime(2023, 10, 7, 9, 0, tzinfo=ZoneInfo("UTC")),
                datetime(2024, 1, 7, 10, 0, tzinfo=ZoneInfo("UTC")),
                datetime(2024, 4, 7, 9, 0, tzinfo=ZoneInfo("UTC")),
                datetime(2024, 7, 7, 9, 0, tzinfo=ZoneInfo("UTC")),
            ],
        )

    def test_models_meetings_get_occurrences_monthly_nb_occurrences_filled_nth(self):
        """
        Monthly occurences with date of end of recurrence filled in but not number of occurences.
        The monthly reccurence is on the nth weekday of the month.
        """
        meeting = MeetingFactory(
            start=datetime(2022, 10, 21, 9, 0, tzinfo=ZoneInfo("UTC")),
            recurrence="monthly",
            timezone=ZoneInfo("Europe/Paris"),
            frequency=1,
            recurring_until=datetime(2023, 4, 21, 11, 0, tzinfo=ZoneInfo("UTC")),
            nb_occurrences=None,
            monthly_type="nth_day",
        )
        self.assertEqual(meeting.nb_occurrences, 7)
        self.assertEqual(
            meeting.get_occurrences(
                datetime(2020, 3, 15, 9, 0, tzinfo=ZoneInfo("UTC")),
                datetime(2050, 1, 1, 9, 0, tzinfo=ZoneInfo("UTC")),
            ),
            [
                datetime(2022, 10, 21, 9, 0, tzinfo=ZoneInfo("UTC")),
                # Beginning of DST
                datetime(2022, 11, 18, 10, 0, tzinfo=ZoneInfo("UTC")),
                datetime(2022, 12, 16, 10, 0, tzinfo=ZoneInfo("UTC")),
                datetime(2023, 1, 20, 10, 0, tzinfo=ZoneInfo("UTC")),
                datetime(2023, 2, 17, 10, 0, tzinfo=ZoneInfo("UTC")),
                datetime(2023, 3, 17, 10, 0, tzinfo=ZoneInfo("UTC")),
                # End of DST
                datetime(2023, 4, 21, 9, 0, tzinfo=ZoneInfo("UTC")),
            ],
        )
        self.assertEqual(
            meeting.recurring_until, datetime(2023, 4, 21, 9, 0, tzinfo=ZoneInfo("UTC"))
        )

        meeting = MeetingFactory(
            start=datetime(2022, 10, 21, 9, 0, tzinfo=ZoneInfo("UTC")),
            recurrence="monthly",
            frequency=3,
            timezone=ZoneInfo("Europe/Paris"),
            recurring_until=datetime(2023, 5, 2, 9, 0, tzinfo=ZoneInfo("UTC")),
            nb_occurrences=None,
            monthly_type="nth_day",
        )
        self.assertEqual(meeting.nb_occurrences, 3)
        self.assertEqual(
            meeting.get_occurrences(
                datetime(2020, 3, 15, 9, 0, tzinfo=ZoneInfo("UTC")),
                datetime(2050, 1, 1, 9, 0, tzinfo=ZoneInfo("UTC")),
            ),
            [
                datetime(2022, 10, 21, 9, 0, tzinfo=ZoneInfo("UTC")),
                # Beginning of DST
                datetime(2023, 1, 20, 10, 0, tzinfo=ZoneInfo("UTC")),
                # End of DST
                datetime(2023, 4, 21, 9, 0, tzinfo=ZoneInfo("UTC")),
            ],
        )

    def test_models_meetings_get_occurrences_monthly_recurring_until_filled_nth(self):
        """
        Monthly occurences with date of end of recurrence filled in but not number of occurrences.
        The monthly reccurence is on the nth weekday of the month.
        """
        meeting = MeetingFactory(
            start=datetime(2022, 10, 21, 9, 0, tzinfo=ZoneInfo("UTC")),
            recurrence="monthly",
            frequency=1,
            timezone=ZoneInfo("Europe/Paris"),
            recurring_until=None,
            nb_occurrences=12,
            monthly_type="nth_day",
        )
        self.assertEqual(
            meeting.recurring_until, datetime(2023, 9, 15, 9, 0, tzinfo=ZoneInfo("UTC"))
        )
        self.assertEqual(
            meeting.get_occurrences(
                datetime(2020, 3, 15, 9, 0, tzinfo=ZoneInfo("UTC")),
                datetime(2050, 1, 1, 9, 0, tzinfo=ZoneInfo("UTC")),
            ),
            [
                datetime(2022, 10, 21, 9, 0, tzinfo=ZoneInfo("UTC")),
                # Beginning of DST
                datetime(2022, 11, 18, 10, 0, tzinfo=ZoneInfo("UTC")),
                datetime(2022, 12, 16, 10, 0, tzinfo=ZoneInfo("UTC")),
                datetime(2023, 1, 20, 10, 0, tzinfo=ZoneInfo("UTC")),
                datetime(2023, 2, 17, 10, 0, tzinfo=ZoneInfo("UTC")),
                datetime(2023, 3, 17, 10, 0, tzinfo=ZoneInfo("UTC")),
                # End of DST
                datetime(2023, 4, 21, 9, 0, tzinfo=ZoneInfo("UTC")),
                datetime(2023, 5, 19, 9, 0, tzinfo=ZoneInfo("UTC")),
                datetime(2023, 6, 16, 9, 0, tzinfo=ZoneInfo("UTC")),
                datetime(2023, 7, 21, 9, 0, tzinfo=ZoneInfo("UTC")),
                datetime(2023, 8, 18, 9, 0, tzinfo=ZoneInfo("UTC")),
                datetime(2023, 9, 15, 9, 0, tzinfo=ZoneInfo("UTC")),
            ],
        )

        meeting = MeetingFactory(
            start=datetime(2022, 10, 21, 9, 0, tzinfo=ZoneInfo("UTC")),
            recurrence="monthly",
            frequency=3,
            timezone=ZoneInfo("Europe/Paris"),
            recurring_until=None,
            nb_occurrences=8,
            monthly_type="nth_day",
        )
        self.assertEqual(
            meeting.recurring_until, datetime(2024, 7, 19, 9, 0, tzinfo=ZoneInfo("UTC"))
        )
        self.assertEqual(
            meeting.get_occurrences(
                datetime(2020, 3, 15, 9, 0, tzinfo=ZoneInfo("UTC")),
                datetime(2050, 1, 1, 9, 0, tzinfo=ZoneInfo("UTC")),
            ),
            [
                datetime(2022, 10, 21, 9, 0, tzinfo=ZoneInfo("UTC")),
                datetime(2023, 1, 20, 10, 0, tzinfo=ZoneInfo("UTC")),  # DST
                datetime(2023, 4, 21, 9, 0, tzinfo=ZoneInfo("UTC")),
                datetime(2023, 7, 21, 9, 0, tzinfo=ZoneInfo("UTC")),
                datetime(2023, 10, 20, 9, 0, tzinfo=ZoneInfo("UTC")),
                datetime(2024, 1, 19, 10, 0, tzinfo=ZoneInfo("UTC")),  # DST
                datetime(2024, 4, 19, 9, 0, tzinfo=ZoneInfo("UTC")),
                datetime(2024, 7, 19, 9, 0, tzinfo=ZoneInfo("UTC")),
            ],
        )

    def test_models_meetings_get_occurrences_monthly_infinite(self):
        """Monthly occurences can be infinite."""
        meeting = MeetingFactory(
            start=datetime(2022, 7, 7, 9, 0, tzinfo=ZoneInfo("UTC")),
            recurrence="monthly",
            timezone=ZoneInfo("Europe/Paris"),
            frequency=1,
            recurring_until=None,
            nb_occurrences=None,
        )
        self.assertIsNone(meeting.nb_occurrences)
        self.assertIsNone(meeting.recurring_until)

        occurrences = meeting.get_occurrences(
            datetime(2020, 3, 15, 9, 0, tzinfo=ZoneInfo("UTC")),
            datetime(2050, 1, 1, 9, 0, tzinfo=ZoneInfo("UTC")),
        )
        self.assertEqual(
            occurrences[-1], datetime(2049, 12, 7, 10, 0, tzinfo=ZoneInfo("UTC"))  # DST
        )
        self.assertEqual(len(occurrences), 330)

    # Yearly

    def test_models_meetings_get_occurrences_yearly_nb_occurrences_filled(self):
        """
        Yearly occurences with date of end of recurrence filled in but not number of occurrences.
        """
        meeting = MeetingFactory(
            start=datetime(2022, 10, 7, 9, 0, tzinfo=ZoneInfo("UTC")),
            recurrence="yearly",
            timezone=ZoneInfo("Europe/Paris"),
            frequency=1,
            recurring_until=datetime(2028, 4, 2, 9, 0, tzinfo=ZoneInfo("UTC")),
            nb_occurrences=None,
        )
        self.assertEqual(meeting.nb_occurrences, 6)
        self.assertEqual(
            meeting.get_occurrences(
                datetime(2020, 3, 15, 9, 0, tzinfo=ZoneInfo("UTC")),
                datetime(2050, 1, 1, 9, 0, tzinfo=ZoneInfo("UTC")),
            ),
            [
                datetime(2022, 10, 7, 9, 0, tzinfo=ZoneInfo("UTC")),
                datetime(2023, 10, 7, 9, 0, tzinfo=ZoneInfo("UTC")),
                datetime(2024, 10, 7, 9, 0, tzinfo=ZoneInfo("UTC")),
                datetime(2025, 10, 7, 9, 0, tzinfo=ZoneInfo("UTC")),
                datetime(2026, 10, 7, 9, 0, tzinfo=ZoneInfo("UTC")),
                datetime(2027, 10, 7, 9, 0, tzinfo=ZoneInfo("UTC")),
            ],
        )

        meeting = MeetingFactory(
            start=datetime(2022, 10, 7, 9, 0, tzinfo=ZoneInfo("UTC")),
            recurrence="yearly",
            timezone=ZoneInfo("Europe/Paris"),
            frequency=3,
            recurring_until=datetime(2028, 4, 2, 9, 0, tzinfo=ZoneInfo("UTC")),
            nb_occurrences=None,
        )
        self.assertEqual(meeting.nb_occurrences, 2)
        self.assertEqual(
            meeting.get_occurrences(
                datetime(2020, 3, 15, 9, 0, tzinfo=ZoneInfo("UTC")),
                datetime(2050, 1, 1, 9, 0, tzinfo=ZoneInfo("UTC")),
            ),
            [
                datetime(2022, 10, 7, 9, 0, tzinfo=ZoneInfo("UTC")),
                datetime(2025, 10, 7, 9, 0, tzinfo=ZoneInfo("UTC")),
            ],
        )

    def test_models_meetings_get_occurrences_yearly_recurring_until_filled(self):
        """
        Yearly occurences with number of occurrences filled in but not date of end of reccurrence.
        """
        meeting = MeetingFactory(
            start=datetime(2022, 10, 7, 9, 0, tzinfo=ZoneInfo("UTC")),
            recurrence="yearly",
            timezone=ZoneInfo("Europe/Paris"),
            frequency=1,
            recurring_until=None,
            nb_occurrences=6,
        )
        self.assertEqual(
            meeting.recurring_until, datetime(2027, 10, 7, 9, 0, tzinfo=ZoneInfo("UTC"))
        )
        self.assertEqual(
            meeting.get_occurrences(
                datetime(2020, 3, 15, 9, 0, tzinfo=ZoneInfo("UTC")),
                datetime(2050, 1, 1, 9, 0, tzinfo=ZoneInfo("UTC")),
            ),
            [
                datetime(2022, 10, 7, 9, 0, tzinfo=ZoneInfo("UTC")),
                datetime(2023, 10, 7, 9, 0, tzinfo=ZoneInfo("UTC")),
                datetime(2024, 10, 7, 9, 0, tzinfo=ZoneInfo("UTC")),
                datetime(2025, 10, 7, 9, 0, tzinfo=ZoneInfo("UTC")),
                datetime(2026, 10, 7, 9, 0, tzinfo=ZoneInfo("UTC")),
                datetime(2027, 10, 7, 9, 0, tzinfo=ZoneInfo("UTC")),
            ],
        )

        meeting = MeetingFactory(
            start=datetime(2022, 10, 7, 9, 0, tzinfo=ZoneInfo("UTC")),
            recurrence="yearly",
            timezone=ZoneInfo("Europe/Paris"),
            frequency=3,
            recurring_until=None,
            nb_occurrences=8,
        )
        self.assertEqual(
            meeting.recurring_until, datetime(2043, 10, 7, 9, 0, tzinfo=ZoneInfo("UTC"))
        )
        self.assertEqual(
            meeting.get_occurrences(
                datetime(2020, 3, 15, 9, 0, tzinfo=ZoneInfo("UTC")),
                datetime(2050, 1, 1, 9, 0, tzinfo=ZoneInfo("UTC")),
            ),
            [
                datetime(2022, 10, 7, 9, 0, tzinfo=ZoneInfo("UTC")),
                datetime(2025, 10, 7, 9, 0, tzinfo=ZoneInfo("UTC")),
                datetime(2028, 10, 7, 9, 0, tzinfo=ZoneInfo("UTC")),
                datetime(2031, 10, 7, 9, 0, tzinfo=ZoneInfo("UTC")),
                datetime(2034, 10, 7, 9, 0, tzinfo=ZoneInfo("UTC")),
                datetime(2037, 10, 7, 9, 0, tzinfo=ZoneInfo("UTC")),
                datetime(2040, 10, 7, 9, 0, tzinfo=ZoneInfo("UTC")),
                datetime(2043, 10, 7, 9, 0, tzinfo=ZoneInfo("UTC")),
            ],
        )

    def test_models_meetings_get_occurrences_yearly_infinite(self):
        """Yearly occurences can be infinite."""
        meeting = MeetingFactory(
            start=datetime(2022, 7, 7, 9, 0, tzinfo=ZoneInfo("UTC")),
            recurrence="yearly",
            timezone=ZoneInfo("Europe/Paris"),
            frequency=1,
            recurring_until=None,
            nb_occurrences=None,
        )
        self.assertIsNone(meeting.nb_occurrences)
        self.assertIsNone(meeting.recurring_until)

        occurrences = meeting.get_occurrences(
            datetime(2020, 3, 15, 9, 0, tzinfo=ZoneInfo("UTC")),
            datetime(2050, 1, 1, 9, 0, tzinfo=ZoneInfo("UTC")),
        )
        self.assertEqual(
            occurrences[-1], datetime(2049, 7, 7, 9, 0, tzinfo=ZoneInfo("UTC"))
        )
        self.assertEqual(len(occurrences), 28)
