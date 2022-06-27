import { Hold } from '../../../factories/meeting';
import { getNextMeeting } from './getNextMeeting';

const testCases = [
  {
    description: 'all meetings are over',
    start: '2022-02-01',
    end: '2022-02-02',
    holdOn: new Hold().monday().friday().days,
    time: '11:00:00',
    duration: 120,
    nextMeeting: null,
    inProgress: false,
    mayBeInProgress: false,
  },
  {
    description: 'single meeting is over',
    start: '2022-02-01',
    end: '2022-02-01',
    holdOn: new Hold().days,
    time: '11:00:00',
    duration: 120,
    nextMeeting: null,
    inProgress: false,
    mayBeInProgress: false,
  },
  {
    description: 'single meeting is in progress',
    start: '2022-06-24',
    end: '2022-06-24',
    holdOn: new Hold().days,
    time: '11:00:00',
    duration: 120,
    nextMeeting: new Date(2022, 5, 24, 11, 0, 0),
    inProgress: true,
    mayBeInProgress: true,
  },
  {
    description: 'repeated meeting is in progress',
    start: '2022-04-24',
    end: '2022-07-24',
    holdOn: new Hold().friday().sunday().days,
    time: '11:00:00',
    duration: 120,
    nextMeeting: new Date(2022, 5, 24, 11, 0, 0),
    inProgress: true,
    mayBeInProgress: true,
  },
  {
    description: 'single meeting is almost in progress',
    start: '2022-06-24',
    end: '2022-06-24',
    holdOn: new Hold().days,
    time: '10:50:00',
    duration: 60, // ends at 11:50
    nextMeeting: new Date(2022, 5, 24, 10, 50, 0),
    inProgress: false,
    mayBeInProgress: true,
  },
  {
    description: 'repeated meeting is almost in progress',
    start: '2022-04-24',
    end: '2022-07-24',
    holdOn: new Hold().friday().sunday().days,
    time: '10:50:00',
    duration: 60, // ends at 11:50
    nextMeeting: new Date(2022, 5, 24, 10, 50, 0),
    inProgress: false,
    mayBeInProgress: true,
  },
  {
    description: 'meeting is later today',
    start: '2022-04-24',
    end: '2022-07-24',
    holdOn: new Hold().friday().days,
    time: '16:00:00',
    duration: 60,
    nextMeeting: new Date(2022, 5, 24, 16, 0, 0),
    inProgress: false,
    mayBeInProgress: false,
  },
  {
    description: 'meeting is today, but already finished',
    start: '2022-04-24',
    end: '2022-07-24',
    holdOn: new Hold().friday().days,
    time: '10:00:00',
    duration: 60,
    nextMeeting: new Date(2022, 6, 1, 10, 0, 0),
    inProgress: false,
    mayBeInProgress: false,
  },
  {
    description: 'meeting is tomorrow',
    start: '2022-04-24',
    end: '2022-07-24',
    holdOn: new Hold().saturday().days,
    time: '10:00:00',
    duration: 60,
    nextMeeting: new Date(2022, 5, 25, 10, 0, 0),
    inProgress: false,
    mayBeInProgress: false,
  },
  {
    description: 'meeting is next tuesday',
    start: '2022-04-24',
    end: '2022-07-24',
    holdOn: new Hold().tuesday().days,
    time: '10:00:00',
    duration: 60,
    nextMeeting: new Date(2022, 5, 28, 10, 0, 0),
    inProgress: false,
    mayBeInProgress: false,
  },
  {
    description: 'meetings are next sunday and tuesday',
    start: '2022-04-24',
    end: '2022-07-24',
    holdOn: new Hold().tuesday().sunday().days,
    time: '10:00:00',
    duration: 60,
    nextMeeting: new Date(2022, 5, 26, 10, 0, 0),
    inProgress: false,
    mayBeInProgress: false,
  },
];

describe('getNextMeeting on friday 12:00:00', () => {
  it.each(testCases)(
    'should return {$nextMeeting, $inProgress} if $description',
    ({
      start,
      end,
      holdOn,
      time,
      duration,
      nextMeeting: expectedNextMeeting,
      inProgress: expectedInProgress,
      mayBeInProgress: expectedMayBeInProgress,
    }) => {
      // mock a friday 12:00
      jest
        .spyOn(global.Date, 'now')
        .mockImplementationOnce(() => new Date(2022, 5, 24, 12, 0, 0).valueOf());

      const { nextMeeting, inProgress, maybeInProgress } = getNextMeeting(
        start,
        end,
        holdOn,
        time,
        duration,
      );

      expect(nextMeeting).toEqual(expectedNextMeeting);
      expect(inProgress).toBe(expectedInProgress);
      expect(maybeInProgress).toBe(expectedMayBeInProgress);
    },
  );
});
