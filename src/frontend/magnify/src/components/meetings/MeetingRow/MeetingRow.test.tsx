import { render, screen } from '@testing-library/react';
import React from 'react';
import { IntlProvider } from 'react-intl';
import { ControllerProvider, MockController } from '../../../controller';
import { createRandomMeeting, Hold } from '../../../factories/meeting';
import MeetingRow from './MeetingRow';
import userEvent from '@testing-library/user-event';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { Meeting } from '../../../types/meeting';
import DebugRoute from '../../../utils/DebugRoute';
import { QueryClient, QueryClientProvider } from 'react-query';

// Let's assume we are on friday, 12:00:00, June 24, 2022
function mockFridayMidday() {
  jest
    .spyOn(global.Date, 'now')
    .mockImplementationOnce(() => new Date(2022, 5, 24, 12, 0, 0).valueOf());
}

function renderMeetingRow(meeting: Meeting) {
  const controller = new MockController();
  const queryClient = new QueryClient();
  controller.joinMeeting.mockResolvedValue({ token: 'success-token' });

  render(
    <IntlProvider locale="en">
      <ControllerProvider controller={controller}>
        <QueryClientProvider client={queryClient}>
          <MemoryRouter>
            <Routes>
              <Route path="/" element={<MeetingRow meeting={meeting} baseJitsiUrl="" />} />
              <Route path="*" element={<DebugRoute />} />
            </Routes>
          </MemoryRouter>
        </QueryClientProvider>
      </ControllerProvider>
    </IntlProvider>,
  );
}

describe('MeetingRow.test.tsx', () => {
  it('should render a non repeating meeting', () => {
    mockFridayMidday();

    // A future, non repeating meeting
    const meeting = createRandomMeeting({
      isSingle: true,
      startTime: '09:00:00',
      duration: 60,
      startDate: new Date(2022, 6, 24, 0, 0, 0),
    });

    renderMeetingRow(meeting);

    screen.getByText(meeting.name);
    screen.getByText('09:00:00');
    screen.getByText('10:00:00');
    screen.getByText('7/24/2022');
  });

  it('should render a repeating, twice a week meeting', () => {
    mockFridayMidday();

    const meeting = createRandomMeeting({
      startDate: new Date(2022, 6, 24, 0, 0, 0),
      endDate: new Date(2022, 7, 24, 0, 0, 0),
      heldOn: new Hold().friday().wednesday(),
      startTime: '11:30:00',
      duration: 90,
    });

    renderMeetingRow(meeting);

    screen.getByText(meeting.name);
    screen.getByText('11:30:00');
    screen.getByText('13:00:00');
    screen.getByText('from 7/24/2022 to 8/24/2022');
    screen.getByText('7/27/2022');

    expect(screen.getByText('W')).toHaveStyle('font-weight: bold; color: rgb(125, 76, 219)');
    expect(screen.getByText('F')).toHaveStyle('font-weight: bold; color: rgb(125, 76, 219)');
    expect(screen.getByText('M')).toHaveStyle('font-weight: normal; color: inherit');
    expect(screen.getByRole('button', { name: 'Join' })).toBeDisabled();
  });

  it('should render a meeting in progress', async () => {
    mockFridayMidday();

    const user = userEvent.setup();
    const meeting = createRandomMeeting({
      startDate: new Date(2022, 5, 1, 0, 0, 0),
      endDate: new Date(2022, 7, 20, 0, 0, 0),
      heldOn: new Hold().friday().wednesday(),
      startTime: '11:30:00',
      duration: 90,
    });

    renderMeetingRow(meeting);

    screen.getByText(meeting.name);
    screen.getByText('11:30:00');
    screen.getByText('13:00:00');
    screen.getByText('from 6/1/2022 to 8/20/2022');
    screen.getByText('6/24/2022');

    expect(screen.getByText('W')).toHaveStyle('font-weight: bold; color: rgb(125, 76, 219)');
    expect(screen.getByText('F')).toHaveStyle('font-weight: bold; color: rgb(125, 76, 219)');
    expect(screen.getByText('M')).toHaveStyle('font-weight: normal; color: inherit');
    expect(screen.getByRole('button', { name: 'Join' })).toBeEnabled();

    await user.click(screen.getByText('Join'));
    await screen.findByText(`/${meeting.id}?token=success-token`);
  });

  it("should render a meeting that's over", () => {
    mockFridayMidday();

    const meeting = createRandomMeeting({
      startDate: new Date(2022, 2, 1, 0, 0, 0),
      endDate: new Date(2022, 3, 20, 0, 0, 0),
      numberOfMeetingPerWeek: 3,
      startTime: '11:30:00',
      duration: 90,
    });

    renderMeetingRow(meeting);

    screen.getByText(meeting.name);
    screen.getByText('11:30:00');
    screen.getByText('13:00:00');
    screen.getByText('from 3/1/2022 to 4/20/2022');
    screen.getByText('Ended');
  });
});
