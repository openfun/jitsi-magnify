import { Box, Grid, ResponsiveContext } from 'grommet';
import React from 'react';
import { defineMessages, useIntl } from 'react-intl';
import { useQuery } from 'react-query';
import { useNavigate } from 'react-router-dom';
import { useController } from '../../../controller';
import RoomSettingsBlock from '../RoomSettingsBlock';

const messages = defineMessages({
  settingsTitle: {
    defaultMessage: `Settings`,
    description: 'Title for the room configuration section with general settings',
    id: 'components.rooms.config.settingsTitle',
  },
  enableChat: {
    defaultMessage: `Enable chat`,
    description: 'Label for the toggle in the room configuration that enables chat',
    id: 'components.rooms.config.enableChat',
  },
  enableScreenSharing: {
    defaultMessage: `Enable screen sharing`,
    description: 'Label for the toggle in the room configuration that enables screen sharing',
    id: 'components.rooms.config.enableScreenSharing',
  },
  moderationTitle: {
    defaultMessage: `Moderation`,
    description: 'Title for the room configuration section with moderation settings',
    id: 'components.rooms.config.moderationTitle',
  },
  everyoneStartsMuted: {
    defaultMessage: `Everyone starts muted`,
    description:
      'Label for the toggle in the room configuration that makes everyone starting muted',
    id: 'components.rooms.config.everyoneStartsMuted',
  },
  everyoneStartsWithoutCamera: {
    defaultMessage: `Everyone starts without camera`,
    description:
      'Label for the toggle in the room configuration that makes everyone starting without camera',
    id: 'components.rooms.config.everyoneStartsWithoutCamera',
  },
  securityTitle: {
    defaultMessage: `Security`,
    description: 'Title for the room configuration section with security settings',
    id: 'components.rooms.config.securityTitle',
  },
  enableWaitingRoom: {
    defaultMessage: `Enable waiting room`,
    description:
      'Label for the toggle in the room configuration (security) that enables the waiting room',
    id: 'components.rooms.config.enableWaitingRoom',
  },
  askForPassword: {
    defaultMessage: `Ask for password`,
    description:
      'Label for the toggle in the room configuration (security) that enables asking for a password when joining a room',
    id: 'components.rooms.config.askForPassword',
  },
  askForAuthentication: {
    defaultMessage: `Ask for authentication`,
    description:
      'Label for the toggle in the room configuration (security) that enables asking for authentication when joining a room',
    id: 'components.rooms.config.askForAuthentication',
  },
});

const RoomConfig = ({ roomName }: { roomName: string }) => {
  const intl = useIntl();
  const size = React.useContext(ResponsiveContext);
  const controller = useController();
  const navigate = useNavigate();
  const { data } = useQuery(['room', { name: roomName }], () => controller.getRoom(roomName), {
    onError: () => {
      console.log('Error getting room');
      navigate('/room-not-found');
    },
  });
  const mobile = size === 'small';

  return (
    <Grid
      columns={['1/2', '1/2']}
      gap="medium"
      rows={mobile ? ['1/3', '1/3', '1/3'] : ['1/2', '1/2']}
      areas={[
        { name: 'settingsBlock', start: [0, 0], end: [1, 0] },
        { name: 'moderationBlock', start: [0, 1], end: mobile ? [1, 1] : [0, 1] },
        { name: 'securityBlock', start: mobile ? [0, 2] : [1, 1], end: mobile ? [1, 2] : [1, 1] },
      ]}
    >
      <Box gridArea="settingsBlock">
        <RoomSettingsBlock
          room={data}
          roomName={roomName}
          title={intl.formatMessage(messages.settingsTitle)}
          toggles={[
            [
              { label: intl.formatMessage(messages.enableChat), settingKey: 'chatEnabled' },
              {
                label: intl.formatMessage(messages.enableScreenSharing),
                settingKey: 'screenSharingEnabled',
              },
            ],
          ]}
        />
      </Box>
      <Box gridArea="moderationBlock">
        <RoomSettingsBlock
          room={data}
          roomName={roomName}
          title={intl.formatMessage(messages.moderationTitle)}
          toggles={[
            [
              {
                label: intl.formatMessage(messages.everyoneStartsMuted),
                settingKey: 'everyoneStartsMuted',
              },
            ],
            [
              {
                label: intl.formatMessage(messages.everyoneStartsWithoutCamera),
                settingKey: 'everyoneStartsWithoutCamera',
              },
            ],
          ]}
        />
      </Box>
      <Box gridArea="securityBlock">
        <RoomSettingsBlock
          room={data}
          roomName={roomName}
          title={intl.formatMessage(messages.securityTitle)}
          toggles={[
            [
              {
                label: intl.formatMessage(messages.enableWaitingRoom),
                settingKey: 'waitingRoomEnabled',
              },
            ],
            [
              {
                label: intl.formatMessage(messages.askForPassword),
                settingKey: 'askForPassword',
              },
            ],
            [
              {
                label: intl.formatMessage(messages.askForAuthentication),
                settingKey: 'askForAuthentication',
              },
            ],
          ]}
        />
      </Box>
    </Grid>
  );
};

export default RoomConfig;
