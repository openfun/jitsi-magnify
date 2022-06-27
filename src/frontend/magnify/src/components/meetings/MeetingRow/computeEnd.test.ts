import { computeEnd } from './computeEnd';

describe('computeEnd', () => {
  it.each([
    { start: '09:00:00', duration: 60, expected: '10:00:00' },
    { start: '09:00:00', duration: 12, expected: '09:12:00' },
    { start: '08:55:00', duration: 10, expected: '09:05:00' },
  ])('should return the end time', ({ start, duration, expected }) => {
    const endTime = computeEnd(start, duration);
    expect(endTime).toBe(expected);
  });
});
