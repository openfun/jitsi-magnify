import { addToDate, getDateTime } from './getNextMeeting';

function to2digits(num: number) {
  return num < 10 ? `0${num}` : num;
}

/**
 * Function to compute the end time of a meeting, given the start time and duration
 * as "HH:MM:SS" string and number of minutes
 */
export function computeEnd(start: string, duration: number): string {
  const [hours, minutes, seconds] = start.split(':').map(Number);

  const begin = getDateTime(new Date(), hours, minutes, seconds);
  const end = addToDate(begin, 0, 0, duration);

  return `${to2digits(end.getHours())}:${to2digits(end.getMinutes())}:${to2digits(
    end.getSeconds(),
  )}`;
}
