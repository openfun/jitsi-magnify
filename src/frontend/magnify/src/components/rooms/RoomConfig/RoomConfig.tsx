import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Formik } from 'formik';
import { AreasType, Box, Grid, GridColumnsType, GridSizeType, ResponsiveValue } from 'grommet';
import React from 'react';
import { defineMessages, useIntl } from 'react-intl';
import { useIsMobile } from '../../../hooks/useIsMobile';
import { RoomsRepository } from '../../../services/rooms/rooms.repository';
import { Room, RoomSettings } from '../../../types/entities/room';
import { Maybe } from '../../../types/misc';
import { MagnifyQueryKeys } from '../../../utils/constants/react-query';
import MagnifyCard from '../../design-system/Card';
import FormikSwitch from '../../design-system/Formik/FormikSwitch';
import { FormikValuesChange } from '../../design-system/Formik/ValuesChange/FormikValuesChange';

export const roomConfigMessages = defineMessages({
  askForAuthentication: {
    defaultMessage: `Ask for authentication`,
    description:
      'Label for the toggle in the room configuration (security) that enables asking for ' +
      'authentication when joining a room',
    id: 'components.rooms.config.askForAuthentication',
  },
  askForPassword: {
    defaultMessage: `Ask for password`,
    description:
      'Label for the toggle in the room configuration (security) that enables asking for a ' +
      'password when joining a room',
    id: 'components.rooms.config.askForPassword',
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
  enableWaitingRoom: {
    defaultMessage: `Enable waiting room`,
    description:
      'Label for the toggle in the room configuration (security) that enables the waiting room',
    id: 'components.rooms.config.enableWaitingRoom',
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
  moderationTitle: {
    defaultMessage: `Moderation`,
    description: 'Title for the room configuration section with moderation settings',
    id: 'components.rooms.config.moderationTitle',
  },
  securityTitle: {
    defaultMessage: `Security`,
    description: 'Title for the room configuration section with security settings',
    id: 'components.rooms.config.securityTitle',
  },
  settingsTitle: {
    defaultMessage: `Settings`,
    description: 'Title for the room configuration section with general settings',
    id: 'components.rooms.config.settingsTitle',
  },
});

interface Props {
  room: Maybe<Room>;
}

const RoomConfig = ({ room }: Props) => {
  const intl = useIntl();
  const queryClient = useQueryClient();
  const isMobile = useIsMobile();

  const { mutate } = useMutation(
    async (settings: RoomSettings) => {
      if (room?.id == null) {
        return;
      }
      return await RoomsRepository.update(room.id, { configuration: settings });
    },
    {
      onSuccess: (data) => {
        queryClient.setQueryData([MagnifyQueryKeys.ROOM, room?.id], data);
        queryClient.setQueryData([MagnifyQueryKeys.ROOMS], (rooms: Room[] = []) => {
          if (!data?.id) {
            return rooms;
          }
          const newRooms = [...rooms];
          const index = newRooms.findIndex((roomItem) => {
            return roomItem.id === data.id;
          });

          if (index >= 0) {
            newRooms[index] = data;
          }
          return newRooms;
        });
      },
    },
  );

  const initialValues: RoomSettings = {
    askForAuthentication: room?.configuration?.askForPassword ?? true,
    askForPassword: room?.configuration?.askForPassword ?? true,
    waitingRoomEnabled: room?.configuration?.waitingRoomEnabled ?? true,
    enableLobbyChat: room?.configuration?.enableLobbyChat ?? true,
    startAudioMuted: room?.configuration?.startAudioMuted ?? true,
    startWithVideoMuted: room?.configuration?.startWithVideoMuted ?? true,
    screenSharingEnabled: room?.configuration?.screenSharingEnabled ?? true,
  };

  const columns: Record<ResponsiveValue, GridColumnsType> = {
    small: ['auto'],
    medium: ['auto', 'auto'],
  };

  const rows: Record<ResponsiveValue, GridSizeType[]> = {
    small: ['auto', 'auto', 'auto'],
    medium: ['auto', 'auto'],
  };

  // set the different areas you need for every size
  const areas: Record<ResponsiveValue, AreasType> = {
    small: [
      { name: 'settings', start: [0, 0], end: [0, 0] },
      { name: 'moderation', start: [0, 1], end: [0, 1] },
      { name: 'security', start: [0, 2], end: [0, 2] },
    ],
    medium: [
      { name: 'settings', start: [0, 0], end: [1, 0] },
      { name: 'moderation', start: [0, 1], end: [0, 1] },
      { name: 'security', start: [1, 1], end: [1, 1] },
    ],
  };

  return (
    <Formik
      enableReinitialize={true}
      initialValues={initialValues}
      onSubmit={(values) => mutate(values)}
    >
      <FormikValuesChange>
        <Grid
          areas={isMobile ? areas.small : areas.medium}
          columns={isMobile ? columns.small : columns.medium}
          gap={'20px'}
          rows={isMobile ? rows.small : rows.medium}
        >
          <Box gridArea={'settings'}>
            <MagnifyCard title={intl.formatMessage(roomConfigMessages.settingsTitle)}>
              <Box gap={'10px'}>
                <FormikSwitch
                  label={intl.formatMessage(roomConfigMessages.enableChat)}
                  name={'enableLobbyChat'}
                />
                <FormikSwitch
                  label={intl.formatMessage(roomConfigMessages.enableScreenSharing)}
                  name={'screenSharingEnabled'}
                />
              </Box>
            </MagnifyCard>
          </Box>
          <Box gap={'10px'} gridArea={'moderation'}>
            <MagnifyCard title={intl.formatMessage(roomConfigMessages.moderationTitle)}>
              <Box gap={'medium'} height={'100%'}>
                <FormikSwitch
                  label={intl.formatMessage(roomConfigMessages.everyoneStartsMuted)}
                  name={'startAudioMuted'}
                />
                <FormikSwitch
                  label={intl.formatMessage(roomConfigMessages.everyoneStartsWithoutCamera)}
                  name={'startWithVideoMuted'}
                />
              </Box>
            </MagnifyCard>
          </Box>

          <Box gap={'10px'} gridArea={'security'}>
            <MagnifyCard title={intl.formatMessage(roomConfigMessages.securityTitle)}>
              <Box gap={'medium'}>
                <FormikSwitch
                  label={intl.formatMessage(roomConfigMessages.enableWaitingRoom)}
                  name={'waitingRoomEnabled'}
                />
                <FormikSwitch
                  label={intl.formatMessage(roomConfigMessages.askForPassword)}
                  name={'askForPassword'}
                />
                <FormikSwitch
                  label={intl.formatMessage(roomConfigMessages.askForAuthentication)}
                  name={'askForAuthentication'}
                />
              </Box>
            </MagnifyCard>
          </Box>
        </Grid>
      </FormikValuesChange>
    </Formik>
  );
};

export default RoomConfig;
