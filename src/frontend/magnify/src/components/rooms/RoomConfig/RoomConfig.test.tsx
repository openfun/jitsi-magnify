import { render, screen, waitFor } from '@testing-library/react';
import React from 'react';
import { MagnifyTestingProvider } from '../../app';
import RoomConfig from './RoomConfig';

describe('RoomConfig', () => {
  it('should fetch data from the controller', async () => {
    render(<RoomConfig room={undefined} />, { wrapper: MagnifyTestingProvider });

    // Wait for loading to finish
    const checkboxes = screen.getAllByRole('checkbox');
    await checkboxes.forEach(async (checkbox) => {
      await waitFor(() => expect(checkbox).toBeEnabled());
    });
  });
});
