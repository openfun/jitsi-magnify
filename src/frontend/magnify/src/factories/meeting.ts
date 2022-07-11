import { faker } from '@faker-js/faker';
import { Meeting } from '../types/meeting';
import createRandomGroups from './groups';
const days = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];

function createFakeWorkingTime() {
  const hour = faker.datatype.number({ min: 8, max: 17 });
  const minute = faker.datatype.number({ min: 0, max: 3 }) * 15;
  return `${to2Digits(hour)}:${to2Digits(minute)}:00`;
}
function to2Digits(num: number) {
  const numStr = num.toString();
  return numStr.length === 1 ? `0${numStr}` : numStr;
}
function djangoFormatDate(date: Date) {
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();
  return `${year}-${to2Digits(month)}-${to2Digits(day)}`;
}

export function createMeetingInProgress(): Meeting {
  const startDate = new Date(Date.now());

  return createRandomMeeting({
    isSingle: true,
    startDate,
    startTime: `${to2Digits(startDate.getHours())}:00:00`,
  });
}

export function createMeetingOver(): Meeting {
  return createRandomMeeting({
    isSingle: true,
    startDate: faker.date.past(),
  });
}

export function createRandomSingleMeeting(): Meeting {
  return createRandomMeeting({
    isSingle: true,
  });
}

interface MeetingOptions {
  /**
   * Is it a single meeting or a repeated one?
   */
  isSingle?: boolean;
  /**
   * By default, the date will be in the future.
   */
  future?: boolean;
  /**
   * The number of weeks to repeat the meeting.
   */
  weeksLength?: number;
  /**
   * The number of meetings each week
   */
  numberOfMeetingPerWeek?: number;
  /**
   * Force the holds to be on a specific day.
   */
  heldOn?: Hold;
  /**
   * Force the start time to be a specific time.
   */
  startTime?: string;
  /**
   * Force the start date to be a specific date.
   */
  startDate?: Date;
  /**
   * Force the end date to be a specific date.
   */
  endDate?: Date;
  /**
   * Force the duration to be a specific time.
   */
  duration?: number;
}

/**
 * Create a random meeting, one-shot or with a repeating pattern.
 * Each param can be overriden using options
 *
 * @param options, an object of options to create a meeting with some constraints.
 * @returns
 */
export function createRandomMeeting({
  isSingle = false,
  future = true,
  numberOfMeetingPerWeek: customNumberOfMeetingPerWeek = 1,
  weeksLength: customWeeksLength,
  heldOn: customHeldOn,
  startDate: customStartDate,
  endDate: customEndDate,
  startTime: customStartTime,
  duration: customDuration,
}: MeetingOptions = {}): Meeting {
  const weeksLength = customWeeksLength || faker.datatype.number({ min: 1, max: 10 });
  const numberOfMeetingPerWeek = isSingle ? 0 : customNumberOfMeetingPerWeek;
  const start =
    customStartDate || (future ? faker.date.future() : faker.date.past(weeksLength / 52));
  const end =
    customEndDate ||
    (isSingle ? start : new Date(start.getTime() + 3600 * 1000 * 24 * 7 * weeksLength));

  const heldOnArray =
    customHeldOn?.days ||
    Array(7)
      .fill(false)
      .map((_, i) => i < numberOfMeetingPerWeek)
      .sort(() => Math.random() - 0.5);
  const heldOn = heldOnArray.map((held, i) => [`held_on_${days[i]}`, held]);

  return {
    id: faker.datatype.uuid(),
    name: faker.lorem.words(3),
    start: djangoFormatDate(start),
    end: djangoFormatDate(end),
    ...Object.fromEntries(heldOn),
    start_time: customStartTime || createFakeWorkingTime(),
    expected_duration: customDuration || 15 * faker.datatype.number({ min: 1, max: 12 }),
    groups: createRandomGroups(faker.datatype.number({ min: 1, max: 5 })),
  };
}

/**
 * Utility to generate a boolean array of 7 elements,
 * by calling names of days of the week.
 *
 * Example:
 * const holdOn = (new Hold()).monday().tuesday().friday().days;
 */
export class Hold {
  days = Array(7).fill(false);
  addDay(day: number) {
    this.days[day] = true;
    return this;
  }
  sunday() {
    return this.addDay(0);
  }
  monday() {
    return this.addDay(1);
  }
  tuesday() {
    return this.addDay(2);
  }
  wednesday() {
    return this.addDay(3);
  }
  thursday() {
    return this.addDay(4);
  }
  friday() {
    return this.addDay(5);
  }
  saturday() {
    return this.addDay(6);
  }
}
