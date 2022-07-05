import { render, screen, waitFor } from '@testing-library/react';
import { Grommet } from 'grommet';
import { createMemoryHistory, MemoryHistory } from 'history';
import React from 'react';
import { IntlProvider } from 'react-intl';
import { QueryClient, QueryClientProvider } from 'react-query';
import { Router } from 'react-router-dom';
import { ControllerProvider, MockController } from '../../../controller';
import createRandomRoom from '../../../factories/room';
import theme from '../../../themes/theme';
import RoomConfig from './RoomConfig';

function SettingWrapper({
  children,
  controller,
  history,
}: {
  children: React.ReactNode;
  controller: MockController;
  history: MemoryHistory;
}) {
  const queryClient = new QueryClient();

  return (
    <Grommet theme={theme}>
      <IntlProvider locale="en">
        <QueryClientProvider client={queryClient}>
          <ControllerProvider controller={controller}>
            <Router location={history.location} navigator={history}>
              {children}
            </Router>
          </ControllerProvider>
        </QueryClientProvider>
      </IntlProvider>
    </Grommet>
  );
}

describe('RoomConfig', () => {
  it('should fetch data from the controller', async () => {
    const controller = new MockController();
    controller.getRoom.mockResolvedValue(createRandomRoom());

    const history = createMemoryHistory();

    render(
      <SettingWrapper controller={controller} history={history}>
        <RoomConfig roomName="room-1" />
      </SettingWrapper>,
    );

    // Wait for loading to finish
    const checkboxes = screen.getAllByRole('checkbox');
    await checkboxes.forEach(async (checkbox) => {
      await waitFor(() => expect(checkbox).toBeEnabled());
    });

    // Actual test
    expect(controller.getRoom).toHaveBeenCalled();
  });
});
