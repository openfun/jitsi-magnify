import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Grommet } from 'grommet';
import React from 'react';
import { IntlProvider } from 'react-intl';
import { ControllerProvider, MockController } from '../../../controller';
import createRandomRoom, { getRandomSetting } from '../../../factories/room';
import theme from '../../../themes/theme';
import RoomSettingToggle from './RoomSettingToggle';

function SettingToggleWrapper({
  children,
  controller,
}: {
  children: React.ReactNode;
  controller: MockController;
}) {
  const queryClient = new QueryClient();

  return (
    <Grommet theme={theme}>
      <IntlProvider locale="en">
        <QueryClientProvider client={queryClient}>
          <ControllerProvider controller={controller}>{children}</ControllerProvider>
        </QueryClientProvider>
      </IntlProvider>
    </Grommet>
  );
}

describe('SettingToggle', () => {
  it('should be disabled when data is undefined', async () => {
    const controller = new MockController();
    controller.getRoom.mockResolvedValue(createRandomRoom());

    render(
      <SettingToggleWrapper controller={controller}>
        <RoomSettingToggle label="My toggle" roomName="room-1" settingKey={getRandomSetting()} />
      </SettingToggleWrapper>,
    );

    expect(screen.getByRole('checkbox')).toBeDisabled();
  });

  it('should call right mutation when clicked', async () => {
    const room = createRandomRoom();
    const setting = getRandomSetting();
    const controller = new MockController();
    controller.getRoom.mockResolvedValue({
      ...createRandomRoom(),
      settings: { [setting]: true },
    });
    const user = userEvent.setup();

    async () => {
      render(
        <SettingToggleWrapper controller={controller}>
          <RoomSettingToggle
            checked={room.settings[setting]}
            label="My toggle"
            roomName={room.name}
            settingKey={setting}
          />
        </SettingToggleWrapper>,
      );
      user.click(screen.getByRole('checkbox'));
      await waitFor(() =>
        expect(controller.updateRoomSettings).toHaveBeenCalledWith({
          name: room.name,
          roomSettings: { [setting]: !room.settings[setting] },
        }),
      );
    };
  });
});
