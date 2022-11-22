"""Unit tests for the `get_occurrences` method on the Meeting model."""
import random
from datetime import date

from django.core.exceptions import ValidationError
from django.test import TestCase

from magnify.apps.core.factories import MeetingFactory


class OccurencesMeetingsModelsTestCase(TestCase):
    """Unit test suite to validate the behavior of meeting occurrences."""

    # No recurence

    def test_models_meetings_get_occurrences_no_recurrence(self):
        """A meeting without recurrence should return 1 occurence."""
        meeting = MeetingFactory(
            start=date(2022, 7, 7),
            recurrence=None,
        )
        self.assertEqual(
            meeting.get_occurrences(date(2020, 3, 15), date(2050, 1, 1)),
            [date(2022, 7, 7)],
        )
        self.assertEqual(
            meeting.get_occurrences(date(2022, 7, 8), date(2050, 1, 1)),
            [],
        )

    # Daily

    def test_models_meetings_get_occurrences_daily_nb_occurrences_filled(self):
        """
        Daily occurences with date of end of reccurrence filled in but not number of occurrences.
        """
        meeting = MeetingFactory(
            start=date(2022, 7, 7),
            recurrence="daily",
            frequency=1,
            recurring_until=date(2022, 8, 2),
            nb_occurrences=None,
        )
        self.assertEqual(meeting.nb_occurrences, 27)
        self.assertEqual(
            meeting.get_occurrences(date(2020, 3, 15), date(2050, 1, 1)),
            [date(2022, 7, i) for i in range(7, 32)]
            + [date(2022, 8, 1), date(2022, 8, 2)],
        )

        meeting = MeetingFactory(
            start=date(2022, 7, 7),
            recurrence="daily",
            frequency=3,
            recurring_until=date(2022, 8, 2),
            nb_occurrences=None,
        )
        self.assertEqual(meeting.nb_occurrences, 9)
        # The date of end of recurrence should be corrected
        self.assertEqual(meeting.recurring_until, date(2022, 7, 31))
        self.assertEqual(
            meeting.get_occurrences(date(2020, 3, 15), date(2050, 1, 1)),
            [
                date(2022, 7, 7),
                date(2022, 7, 10),
                date(2022, 7, 13),
                date(2022, 7, 16),
                date(2022, 7, 19),
                date(2022, 7, 22),
                date(2022, 7, 25),
                date(2022, 7, 28),
                date(2022, 7, 31),
            ],
        )

    def test_models_meetings_get_occurrences_daily_reset_recurring_until(self):
        """
        Daily occurences with date of end of reccurrence not leaving any possibliity of
        repeated occurence.
        """
        meeting = MeetingFactory(
            start=date(2022, 7, 7),
            recurrence="daily",
            frequency=3,
            recurring_until=date(2022, 7, 9),
            nb_occurrences=None,
        )
        self.assertIsNone(meeting.recurrence)
        self.assertEqual(meeting.nb_occurrences, 1)
        self.assertEqual(meeting.recurring_until, meeting.start)
        self.assertEqual(meeting.weekdays, "3")
        self.assertEqual(
            meeting.get_occurrences(date(2020, 3, 15), date(2050, 1, 1)),
            [date(2022, 7, 7)],
        )

    def test_models_meetings_get_occurrences_daily_recurring_until_filled(self):
        """
        Daily occurences with number of occurences filled in but not date of end of occurence.
        The date of end of reccurrence shoud be calculated if the number of occurrences is
        repeated.
        """
        meeting = MeetingFactory(
            start=date(2022, 7, 7),
            recurrence="daily",
            frequency=1,
            recurring_until=None,
            nb_occurrences=6,
        )
        self.assertEqual(meeting.recurring_until, date(2022, 7, 12))
        self.assertEqual(
            meeting.get_occurrences(date(2020, 3, 15), date(2050, 1, 1)),
            [
                date(2022, 7, 7),
                date(2022, 7, 8),
                date(2022, 7, 9),
                date(2022, 7, 10),
                date(2022, 7, 11),
                date(2022, 7, 12),
            ],
        )

        meeting = MeetingFactory(
            start=date(2022, 7, 7),
            recurrence="daily",
            frequency=3,
            recurring_until=None,
            nb_occurrences=6,
        )
        self.assertEqual(meeting.recurring_until, date(2022, 7, 22))
        self.assertEqual(
            meeting.get_occurrences(date(2020, 3, 15), date(2050, 1, 1)),
            [
                date(2022, 7, 7),
                date(2022, 7, 10),
                date(2022, 7, 13),
                date(2022, 7, 16),
                date(2022, 7, 19),
                date(2022, 7, 22),
            ],
        )

    def test_models_meetings_get_occurrences_daily_reset_nb_occurrences(self):
        """
        Daily occurences with number of occurrences less or equal to 1, should lead to
        resettings reccurrence.
        """
        meeting = MeetingFactory(
            start=date(2022, 7, 7),
            recurrence="daily",
            frequency=3,
            recurring_until=None,
            nb_occurrences=random.choice([0, 1]),
        )
        self.assertIsNone(meeting.recurrence)
        self.assertEqual(meeting.nb_occurrences, 1)
        self.assertEqual(meeting.recurring_until, meeting.start)
        self.assertEqual(meeting.weekdays, "3")
        self.assertEqual(
            meeting.get_occurrences(date(2020, 3, 15), date(2050, 1, 1)),
            [date(2022, 7, 7)],
        )

    def test_models_meetings_get_occurrences_daily_infinite(self):
        """Daily occurences can be infinite."""
        meeting = MeetingFactory(
            start=date(2022, 7, 7),
            recurrence="daily",
            frequency=1,
            recurring_until=None,
            nb_occurrences=None,
        )
        self.assertIsNone(meeting.nb_occurrences)
        self.assertIsNone(meeting.recurring_until)

        occurrences = meeting.get_occurrences(date(2020, 3, 15), date(2050, 1, 1))
        self.assertEqual(occurrences[-1], date(2050, 1, 1))
        self.assertEqual(len(occurrences), 10041)

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
            MeetingFactory(start=date(2022, 7, 7), recurrence="weekly", weekdays="2")

        self.assertEqual(
            context.exception.messages,
            ["Weekdays should contain the start date."],
        )

    def test_models_meetings_get_occurrences_weekly_reset_weekdays(self):
        """reset weekdays if recurrence not equal to weekly"""
        meeting = MeetingFactory(
            start=date(2022, 7, 6),
            recurrence="weekly",
            frequency=1,
            recurring_until=date(2022, 8, 2),
            nb_occurrences=None,
            meeting.weekdays = "26"
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
        meeting = MeetingFactory(
            start=date(2022, 7, 7),
            recurrence="weekly",
            frequency=1,
            recurring_until=date(2022, 8, 2),
            nb_occurrences=None,
            weekdays="135",
        )
        self.assertEqual(meeting.nb_occurrences, 12)
        self.assertEqual(
            meeting.get_occurrences(date(2020, 3, 15), date(2050, 1, 1)),
            [
                date(2022, 7, 7),
                date(2022, 7, 9),
                date(2022, 7, 12),
                date(2022, 7, 14),
                date(2022, 7, 16),
                date(2022, 7, 19),
                date(2022, 7, 21),
                date(2022, 7, 23),
                date(2022, 7, 26),
                date(2022, 7, 28),
                date(2022, 7, 30),
                date(2022, 8, 2),
            ],
        )
        self.assertEqual(
            meeting.get_occurrences(date(2022, 7, 24), date(2022, 7, 29)),
            [
                date(2022, 7, 26),
                date(2022, 7, 28),
            ],
        )

        meeting = MeetingFactory(
            start=date(2022, 7, 7),
            recurrence="weekly",
            frequency=3,
            recurring_until=date(2022, 8, 2),
            nb_occurrences=None,
            weekdays="135",
        )
        self.assertEqual(meeting.nb_occurrences, 5)
        self.assertEqual(
            meeting.get_occurrences(date(2020, 3, 15), date(2050, 1, 1)),
            [
                date(2022, 7, 7),
                date(2022, 7, 9),
                date(2022, 7, 26),
                date(2022, 7, 28),
                date(2022, 7, 30),
            ],
        )

    def test_models_meetings_get_occurrences_weekly_nb_occurrences_filled(self):
        """
        Weekly occurences with number of occurrences filled in but not date of end of reccurrence.
        """
        meeting = MeetingFactory(
            start=date(2022, 7, 6),
            recurrence="weekly",
            frequency=1,
            recurring_until=None,
            nb_occurrences=12,
            weekdays="26",
        )
        self.assertEqual(meeting.recurring_until, date(2022, 8, 14))
        self.assertEqual(
            meeting.get_occurrences(date(2020, 3, 15), date(2050, 1, 1)),
            [
                date(2022, 7, 6),
                date(2022, 7, 10),
                date(2022, 7, 13),
                date(2022, 7, 17),
                date(2022, 7, 20),
                date(2022, 7, 24),
                date(2022, 7, 27),
                date(2022, 7, 31),
                date(2022, 8, 3),
                date(2022, 8, 7),
                date(2022, 8, 10),
                date(2022, 8, 14),
            ],
        )

        meeting = MeetingFactory(
            start=date(2022, 7, 6),
            recurrence="weekly",
            frequency=3,
            recurring_until=None,
            nb_occurrences=3,
            weekdays="26",
        )
        self.assertEqual(meeting.recurring_until, date(2022, 7, 27))
        self.assertEqual(
            meeting.get_occurrences(date(2020, 3, 15), date(2050, 1, 1)),
            [date(2022, 7, 6), date(2022, 7, 10), date(2022, 7, 27)],
        )
        self.assertEqual(
            meeting.get_occurrences(date(2022, 7, 7), date(2022, 7, 26)),
            [date(2022, 7, 10)],
        )

    def test_models_meetings_get_occurrences_weekly_infinite(self):
        """Weekly occurences can be infinite."""
        meeting = MeetingFactory(
            start=date(2022, 7, 7),
            recurrence="weekly",
            frequency=1,
            recurring_until=None,
            nb_occurrences=None,
            weekdays="3",
        )
        self.assertIsNone(meeting.nb_occurrences)
        self.assertIsNone(meeting.recurring_until)

        occurrences = meeting.get_occurrences(date(2020, 3, 15), date(2050, 1, 1))
        self.assertEqual(occurrences[-1], date(2049, 12, 30))
        self.assertEqual(len(occurrences), 1435)

    # Monthly

    def test_models_meetings_get_occurrences_monthly_nb_occurrences_filled_date(self):
        """
        Monthly occurences with date of end of recurrence filled in but not number of occurences.
        The monthly reccurence is on the precise date each month
        """
        meeting = MeetingFactory(
            start=date(2022, 10, 7),
            recurrence="monthly",
            frequency=1,
            recurring_until=date(2023, 4, 2),
            nb_occurrences=None,
        )
        self.assertEqual(meeting.nb_occurrences, 6)
        self.assertEqual(
            meeting.get_occurrences(date(2020, 3, 15), date(2050, 1, 1)),
            [
                date(2022, 10, 7),
                date(2022, 11, 7),
                date(2022, 12, 7),
                date(2023, 1, 7),
                date(2023, 2, 7),
                date(2023, 3, 7),
            ],
        )

        meeting = MeetingFactory(
            start=date(2022, 10, 7),
            recurrence="monthly",
            frequency=3,
            recurring_until=date(2023, 4, 2),
            nb_occurrences=None,
        )
        self.assertEqual(meeting.nb_occurrences, 2)
        self.assertEqual(
            meeting.get_occurrences(date(2020, 3, 15), date(2050, 1, 1)),
            [date(2022, 10, 7), date(2023, 1, 7)],
        )

    def test_models_meetings_get_occurrences_monthly_recurring_until_filled_date(self):
        """
        Monthly occurences with number of occurrences filled in but not date of end of reccurrence.
        The monthly reccurence is on the nth weekday of the month.
        """
        meeting = MeetingFactory(
            start=date(2022, 10, 7),
            recurrence="monthly",
            frequency=1,
            recurring_until=None,
            nb_occurrences=6,
        )
        self.assertEqual(meeting.recurring_until, date(2023, 3, 7))
        self.assertEqual(
            meeting.get_occurrences(date(2020, 3, 15), date(2050, 1, 1)),
            [
                date(2022, 10, 7),
                date(2022, 11, 7),
                date(2022, 12, 7),
                date(2023, 1, 7),
                date(2023, 2, 7),
                date(2023, 3, 7),
            ],
        )

        meeting = MeetingFactory(
            start=date(2022, 10, 7),
            recurrence="monthly",
            frequency=3,
            recurring_until=None,
            nb_occurrences=8,
        )
        self.assertEqual(meeting.recurring_until, date(2024, 7, 7))
        self.assertEqual(
            meeting.get_occurrences(date(2020, 3, 15), date(2050, 1, 1)),
            [
                date(2022, 10, 7),
                date(2023, 1, 7),
                date(2023, 4, 7),
                date(2023, 7, 7),
                date(2023, 10, 7),
                date(2024, 1, 7),
                date(2024, 4, 7),
                date(2024, 7, 7),
            ],
        )

    def test_models_meetings_get_occurrences_monthly_nb_occurrences_filled_nth(self):
        """
        Monthly occurences with date of end of recurrence filled in but not number of occurences.
        The monthly reccurence is on the nth weekday of the month.
        """
        meeting = MeetingFactory(
            start=date(2022, 10, 21),
            recurrence="monthly",
            frequency=1,
            recurring_until=date(2023, 4, 2),
            nb_occurrences=None,
            monthly_type="nth_day",
        )
        self.assertEqual(meeting.nb_occurrences, 6)
        self.assertEqual(
            meeting.get_occurrences(date(2020, 3, 15), date(2050, 1, 1)),
            [
                date(2022, 10, 21),
                date(2022, 11, 18),
                date(2022, 12, 16),
                date(2023, 1, 20),
                date(2023, 2, 17),
                date(2023, 3, 17),
            ],
        )

        meeting = MeetingFactory(
            start=date(2022, 10, 21),
            recurrence="monthly",
            frequency=3,
            recurring_until=date(2023, 5, 2),
            nb_occurrences=None,
            monthly_type="nth_day",
        )
        self.assertEqual(meeting.nb_occurrences, 3)
        self.assertEqual(
            meeting.get_occurrences(date(2020, 3, 15), date(2050, 1, 1)),
            [
                date(2022, 10, 21),
                date(2023, 1, 20),
                date(2023, 4, 21),
            ],
        )

    def test_models_meetings_get_occurrences_monthly_recurring_until_filled_nth(self):
        """
        Monthly occurences with date of end of recurrence filled in but not number of occurrences.
        The monthly reccurence is on the nth weekday of the month.
        """
        meeting = MeetingFactory(
            start=date(2022, 10, 21),
            recurrence="monthly",
            frequency=1,
            recurring_until=None,
            nb_occurrences=12,
            monthly_type="nth_day",
        )
        self.assertEqual(meeting.recurring_until, date(2023, 9, 15))
        self.assertEqual(
            meeting.get_occurrences(date(2020, 3, 15), date(2050, 1, 1)),
            [
                date(2022, 10, 21),
                date(2022, 11, 18),
                date(2022, 12, 16),
                date(2023, 1, 20),
                date(2023, 2, 17),
                date(2023, 3, 17),
                date(2023, 4, 21),
                date(2023, 5, 19),
                date(2023, 6, 16),
                date(2023, 7, 21),
                date(2023, 8, 18),
                date(2023, 9, 15),
            ],
        )

        meeting = MeetingFactory(
            start=date(2022, 10, 21),
            recurrence="monthly",
            frequency=3,
            recurring_until=None,
            nb_occurrences=8,
            monthly_type="nth_day",
        )
        self.assertEqual(meeting.recurring_until, date(2024, 7, 19))
        self.assertEqual(
            meeting.get_occurrences(date(2020, 3, 15), date(2050, 1, 1)),
            [
                date(2022, 10, 21),
                date(2023, 1, 20),
                date(2023, 4, 21),
                date(2023, 7, 21),
                date(2023, 10, 20),
                date(2024, 1, 19),
                date(2024, 4, 19),
                date(2024, 7, 19),
            ],
        )

    def test_models_meetings_get_occurrences_monthly_infinite(self):
        """Monthly occurences can be infinite."""
        meeting = MeetingFactory(
            start=date(2022, 7, 7),
            recurrence="monthly",
            frequency=1,
            recurring_until=None,
            nb_occurrences=None,
        )
        self.assertIsNone(meeting.nb_occurrences)
        self.assertIsNone(meeting.recurring_until)

        occurrences = meeting.get_occurrences(date(2020, 3, 15), date(2050, 1, 1))
        self.assertEqual(occurrences[-1], date(2049, 12, 7))
        self.assertEqual(len(occurrences), 330)

    # Yearly

    def test_models_meetings_get_occurrences_yearly_nb_occurrences_filled(self):
        """
        Yearly occurences with date of end of recurrence filled in but not number of occurrences.
        """
        meeting = MeetingFactory(
            start=date(2022, 10, 7),
            recurrence="yearly",
            frequency=1,
            recurring_until=date(2028, 4, 2),
            nb_occurrences=None,
        )
        self.assertEqual(meeting.nb_occurrences, 6)
        self.assertEqual(
            meeting.get_occurrences(date(2020, 3, 15), date(2050, 1, 1)),
            [
                date(2022, 10, 7),
                date(2023, 10, 7),
                date(2024, 10, 7),
                date(2025, 10, 7),
                date(2026, 10, 7),
                date(2027, 10, 7),
            ],
        )

        meeting = MeetingFactory(
            start=date(2022, 10, 7),
            recurrence="yearly",
            frequency=3,
            recurring_until=date(2028, 4, 2),
            nb_occurrences=None,
        )
        self.assertEqual(meeting.nb_occurrences, 2)
        self.assertEqual(
            meeting.get_occurrences(date(2020, 3, 15), date(2050, 1, 1)),
            [
                date(2022, 10, 7),
                date(2025, 10, 7),
            ],
        )

    def test_models_meetings_get_occurrences_yearly_recurring_until_filled(self):
        """
        Yearly occurences with number of occurrences filled in but not date of end of reccurrence.
        """
        meeting = MeetingFactory(
            start=date(2022, 10, 7),
            recurrence="yearly",
            frequency=1,
            recurring_until=None,
            nb_occurrences=6,
        )
        self.assertEqual(meeting.recurring_until, date(2027, 10, 7))
        self.assertEqual(
            meeting.get_occurrences(date(2020, 3, 15), date(2050, 1, 1)),
            [
                date(2022, 10, 7),
                date(2023, 10, 7),
                date(2024, 10, 7),
                date(2025, 10, 7),
                date(2026, 10, 7),
                date(2027, 10, 7),
            ],
        )

        meeting = MeetingFactory(
            start=date(2022, 10, 7),
            recurrence="yearly",
            frequency=3,
            recurring_until=None,
            nb_occurrences=8,
        )
        self.assertEqual(meeting.recurring_until, date(2043, 10, 7))
        self.assertEqual(
            meeting.get_occurrences(date(2020, 3, 15), date(2050, 1, 1)),
            [
                date(2022, 10, 7),
                date(2025, 10, 7),
                date(2028, 10, 7),
                date(2031, 10, 7),
                date(2034, 10, 7),
                date(2037, 10, 7),
                date(2040, 10, 7),
                date(2043, 10, 7),
            ],
        )

    def test_models_meetings_get_occurrences_yearly_infinite(self):
        """Yearly occurences can be infinite."""
        meeting = MeetingFactory(
            start=date(2022, 7, 7),
            recurrence="yearly",
            frequency=1,
            recurring_until=None,
            nb_occurrences=None,
        )
        self.assertIsNone(meeting.nb_occurrences)
        self.assertIsNone(meeting.recurring_until)

        occurrences = meeting.get_occurrences(date(2020, 3, 15), date(2050, 1, 1))
        self.assertEqual(occurrences[-1], date(2049, 7, 7))
        self.assertEqual(len(occurrences), 28)
