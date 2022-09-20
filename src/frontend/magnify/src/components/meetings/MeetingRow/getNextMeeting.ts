/**
 * Get a datetime that has the same date as the given datetime, but is at the
 * given time.
 *
 * @param date The base datetime, for which to extract the date
 * @param hours The hours to set
 * @param minutes The minutes to set
 * @param seconds The seconds to set
 * @returns A new datetime with the given hours, minutes and seconds, but the same date as the basis
 */
export function getDateTime(date: Date, hours: number, minutes: number, seconds: number): Date {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate(), hours, minutes, seconds);
}

/**
 * Add a number of days, hours, minues, seconds to a date.
 *
 * @param date The date to start from.
 * @param daysDiff The number of days to add to the date.
 * @param hoursDif The number of hours to add to the date.
 * @param minutesDiff The number of minutes to add to the date.
 * @param secondsDiff The number of seconds to add to the date.
 * @returns A new date, results of the addition.
 */
export function addToDate(
  date: Date,
  daysDiff = 0,
  hoursDif = 0,
  minutesDiff = 0,
  secondsDiff = 0,
): Date {
  return new Date(
    date.getTime() + (((daysDiff * 24 + hoursDif) * 60 + minutesDiff) * 60 + secondsDiff) * 1000,
  );
}

/**
 * Analyse the meeting generator to get the next date of the meeting
 * It also gets if the meeting is currently in progress or not, and if
 * it is finished for more than the error margin or not
 *
 * @param start The start date of the meeting
 * @param end The end date of the meeting
 * @param heldOn The days of the week the meeting is held on
 * @param time The time the meeting starts
 * @param duration The duration of each meeting
 * @param options (including the margin of error for the duration)
 *
 * @returns the date of the next meeting, and if the meeting is running, or finished for
 * less than the margin
 */
export function getNextMeeting(
  start: string,
  end: string,
  heldOn: boolean[],
  time: string,
  duration: number,
  { margin = 30 } = {},
): {
  nextMeeting: Date | null;
  inProgress: boolean;
  maybeInProgress: boolean;
} {
  // Dates
  const now = new Date(Date.now());
  const [hours, minutes, seconds] = time.split(':').map(Number);
  const todayMeetingTime = getDateTime(now, hours, minutes, seconds);
  const todayEndMeetingTime = addToDate(todayMeetingTime, 0, 0, duration);
  const todayEndMeetingTimeWithMargin = addToDate(todayEndMeetingTime, 0, 0, margin);
  const startDateMorning = getDateTime(new Date(start), 0, 0, 0);
  const startDateStartMeeting = getDateTime(new Date(start), hours, minutes, seconds);
  const endDateMorning = getDateTime(new Date(end), 0, 0, 0);
  const endDateEndMeeting = addToDate(endDateMorning, 0, hours, minutes + duration, seconds);
  const endDateEndMeetingWithMargin = addToDate(endDateEndMeeting, 0, 0, margin);
  const endDateNight = addToDate(getDateTime(new Date(end), 0, 0, 0), 1);

  // CASE 0: Meeting is over
  if (now > endDateEndMeetingWithMargin)
    return { nextMeeting: null, inProgress: false, maybeInProgress: false };

  // CASE 1: Meeting is a single one
  if (start === end)
    return {
      nextMeeting: startDateStartMeeting,
      inProgress: startDateStartMeeting < now && now < endDateEndMeeting,
      maybeInProgress: startDateStartMeeting < now && now < endDateEndMeetingWithMargin,
    };

  // CASE 2: Meeting is a multiple one, but there is a meeting today, later in the day
  // example, if we are friday 12:00, we accept meetings finishing after 11:30 (because we
  // may want to join even a meeting that is still running late)
  const isMeetingToday = heldOn[now.getDay()] && startDateMorning < now && now < endDateNight;
  const isMeetingEndLater = now < todayEndMeetingTimeWithMargin;
  if (isMeetingToday && isMeetingEndLater) {
    return {
      nextMeeting: todayMeetingTime,
      inProgress: todayMeetingTime < now && now < todayEndMeetingTime,
      maybeInProgress: todayMeetingTime < now,
    };
  }

  // CASE 4a: Meeting is a multiple one, and there is a meeting later in the week
  // relatively to either today or the start date of the meetings
  const referenceDate = now > startDateMorning ? now : startDateMorning;
  const referenceDay = referenceDate.getDay();
  const nextMeetingDay = heldOn.findIndex((held, i) => i > referenceDay && held);

  // CASE 4b: Meeting is a multiple one, and there is a meeting sooner in the week
  // relatively to either today or the start date of the meetings
  const previousMeetingDay = heldOn.findIndex((held, i) => i <= referenceDay && held);

  // CASE 4, synthesis: Meeting is a multiple one, and there is a meeting sooner or later in
  // the week
  // Let's verify it's still before the end limit
  if (nextMeetingDay !== -1 || previousMeetingDay !== -1) {
    // Compute the date of the next meeting, either (+a few days) later,
    // or (a week - a few days) later
    const nextMeetingDate =
      nextMeetingDay !== -1
        ? addToDate(
            getDateTime(referenceDate, hours, minutes, seconds),
            nextMeetingDay - referenceDay,
          )
        : addToDate(
            getDateTime(referenceDate, hours, minutes, seconds),
            7 + previousMeetingDay - referenceDay,
          );

    // Check if the next meeting is still before the end limit
    if (nextMeetingDate > endDateNight)
      return { nextMeeting: null, inProgress: false, maybeInProgress: false };

    // It is, so we can return the next meeting
    return {
      nextMeeting: nextMeetingDate,
      inProgress: false,
      maybeInProgress: false,
    };
  }

  // DEFAULT: no matching meeting, return null
  return {
    nextMeeting: null,
    inProgress: false,
    maybeInProgress: false,
  };
}
