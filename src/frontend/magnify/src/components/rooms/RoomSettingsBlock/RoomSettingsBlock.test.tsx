import { render, screen } from '@testing-library/react';
import { Grommet } from 'grommet';
import React from 'react';
import { IntlProvider } from 'react-intl';
import { QueryClient, QueryClientProvider } from 'react-query';
import { ControllerProvider, MockController } from '../../../controller';
import createRandomRoom from '../../../factories/room';
import theme from '../../../themes/theme';
import RoomSettingsBlock from './RoomSettingsBlock';

function SettingWrapper({
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

describe('RoomSettingsBlock', () => {
  it('should render successfully', () => {
    const controller = new MockController();
    controller.getRoom.mockResolvedValue(createRandomRoom());
    const room = createRandomRoom();
    render(
      <SettingWrapper controller={controller}>
        <RoomSettingsBlock room={room} roomName={room.name} toggles={[]} />
      </SettingWrapper>,
    );
  });

  it('should render the section title', () => {
    const controller = new MockController();
    controller.getRoom.mockResolvedValue(createRandomRoom());
    const room = createRandomRoom();
    render(
      <SettingWrapper controller={controller}>
        <RoomSettingsBlock room={room} roomName={room.name} title="Settings" toggles={[]} />
      </SettingWrapper>,
    );
    expect(screen.getByText('Settings')).toBeInTheDocument();
  });

  it('should render given toggles', () => {
    const room = createRandomRoom();
    const controller = new MockController();
    controller.getRoom.mockResolvedValue(createRandomRoom());
    render(
      <SettingWrapper controller={controller}>
        <RoomSettingsBlock
          room={room}
          roomName={room.name}
          title="Settings"
          toggles={[
            [
              { label: 'Chat Toggle', settingKey: 'chatEnabled' },
              { label: 'Ask for auth Toggle', settingKey: 'askForAuthentication' },
            ],
            [{ label: 'Ask for password Toggle', settingKey: 'askForPassword' }],
          ]}
        />
      </SettingWrapper>,
    );
    expect(screen.getByRole('checkbox', { name: 'Chat Toggle' })).toBeInTheDocument();
    expect(screen.getByRole('checkbox', { name: 'Ask for auth Toggle' })).toBeInTheDocument();
    expect(screen.getByRole('checkbox', { name: 'Ask for password Toggle' })).toBeInTheDocument();
  });
});
