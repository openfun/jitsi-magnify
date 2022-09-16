import React from 'react';
import { IntlProvider } from 'react-intl';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import RegisterRoomForm from './RegisterRoomForm';
import { ControllerProvider, MockController } from '../../../controller';
import createRandomRoom from '../../../factories/room';
import { QueryClient, QueryClientProvider } from 'react-query';

describe('RegisterRoomForm', () => {
  it('should be possible to submit the form', async () => {
    const controller = new MockController();
    const roomToCreate = createRandomRoom();
    const queryClient = new QueryClient();
    queryClient.setQueryData = jest.fn();
    controller.registerRoom.mockResolvedValue(roomToCreate);
    const onSuccess = jest.fn();
    const user = userEvent.setup();

    render(
      <ControllerProvider controller={controller}>
        <QueryClientProvider client={queryClient}>
          <IntlProvider locale="en">
            <RegisterRoomForm onSuccess={onSuccess} />
          </IntlProvider>
        </QueryClientProvider>
      </ControllerProvider>,
    );

    // 1) Fill in the form
    screen.getByRole('button', { name: 'Register room' });
    await user.type(screen.getByRole('textbox', { name: 'Name' }), roomToCreate.name);
    await user.click(screen.getByRole('button', { name: `Register room` }));

    // 2) Verify that mutation is called
    await waitFor(() => {
      expect(controller.registerRoom).toHaveBeenCalledWith(roomToCreate.name);
    });

    // 3) Verify that the query data is updated
    await waitFor(() => {
      expect(queryClient.setQueryData).toHaveBeenCalled();
      const key = (queryClient.setQueryData as jest.Mock).mock.calls[0][0];
      const value = (queryClient.setQueryData as jest.Mock).mock.calls[0][1]([]);
      expect(key).toBe('rooms');
      expect(value).toEqual([roomToCreate]);
    });

    // 4) Verify that the onSuccess callback is called
    expect(onSuccess).toHaveBeenCalled();
  });
});
