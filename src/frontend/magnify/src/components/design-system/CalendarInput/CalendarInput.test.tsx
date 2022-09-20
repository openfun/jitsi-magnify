import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import React from 'react';
import { IntlProvider } from 'react-intl';
import CalendarInput from './CalendarInput';

describe('CalendarInput', () => {
  it('should render successfully a button to open a calendar', async () => {
    const onChange = jest.fn();
    const user = userEvent.setup();

    render(
      <IntlProvider locale="en">
        <CalendarInput
          label="calendar"
          name="date"
          onChange={onChange}
          value={[new Date('2022-05-01').toUTCString(), new Date('2022-05-02').toUTCString()]}
        />
      </IntlProvider>,
    );

    const openCalendar = screen.getByRole('button', { name: 'Open Drop' });
    await user.click(openCalendar);

    await user.click(screen.getByText('12'));
    await user.click(screen.getByText('21'));
    await user.click(screen.getByText('calendar'));

    expect(onChange).toHaveBeenCalledTimes(2);
    expect(onChange).toHaveBeenNthCalledWith(1, {
      value: ['2022-05-12T00:00:00.000Z', '2022-05-12T00:00:00.000Z'],
    });
    expect(onChange).toHaveBeenNthCalledWith(2, {
      value: ['2022-05-12T00:00:00.000Z', '2022-05-21T00:00:00.000Z'],
    });
  });
});
