import { render, screen, waitFor } from '@testing-library/react';
import React from 'react';
import { IntlProvider } from 'react-intl';
import RoomConfig from './RoomConfig';

describe('RoomConfig', () => {
  it('should fetch data from the controller', async () => {
    render(
      <IntlProvider locale="en">
        <RoomConfig roomName="room-1" />
      </IntlProvider>,
    );

    // Wait for loading to finish
    const checkboxes = screen.getAllByRole('checkbox');
    await checkboxes.forEach(async (checkbox) => {
      await waitFor(() => expect(checkbox).toBeEnabled());
    });
  });
});
