import { useMutation, useQueryClient } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import { Formik } from 'formik';
import { AreasType, Box, Grid, GridColumnsType, GridSizeType, ResponsiveValue } from 'grommet';
import React from 'react';
import { defineMessages, useIntl } from 'react-intl';
import { useErrors } from '../../../hooks/useErrors';
import { useIsMobile } from '../../../hooks/useIsMobile';
import { RoomsRepository } from '../../../services/rooms/rooms.repository';
import { Room, RoomResponse, RoomSettings } from '../../../types';
import { Maybe } from '../../../types/misc';
import { MagnifyQueryKeys } from '../../../utils';
import { MagnifyCard } from '../../design-system';
import { FormikInput } from '../../design-system/Formik/Input/FormikInput';
import { FormikSwitch } from '../../design-system/Formik/Switch/FormikSwitch';
import { FormikValuesChange } from '../../design-system/Formik/ValuesChange/FormikValuesChange';

export const roomConfigMessages = defineMessages({
  askForAuthentication: {
    defaultMessage: 'Ask for authentication',
    description:
      'Label for the toggle in the room configuration (security) that enables asking for ' +
      'authentication when joining a room',
    id: 'components.rooms.config.askForAuthentication',
  },
  askForPassword: {
    defaultMessage: 'Ask for password',
    description:
      'Label for the toggle in the room configuration (security) that enables asking for a ' +
      'password when joining a room',
    id: 'components.rooms.config.askForPassword',
  },
  askForPasswordInputLabel: {
    defaultMessage: 'Room password',
    description: 'Label for the room password input',
    id: 'components.rooms.config.askForPasswordInputLabel',
  },
  askForPasswordInputPlaceholder: {
    defaultMessage: 'Choose password',
    description: 'Placeholder for the room password input',
    id: 'components.rooms.config.askForPasswordInputPlaceholder',
  },
  enableChat: {
    defaultMessage: 'Enable chat',
    description: 'Label for the toggle in the room configuration that enables chat',
    id: 'components.rooms.config.enableChat',
  },
  isPublicRoom: {
    defaultMessage: 'Public room',
    description: 'Label for the toggle in the room configuration that make private or public room',
    id: 'components.rooms.config.isPublic',
  },
  enableScreenSharing: {
    defaultMessage: 'Enable screen sharing',
    description: 'Label for the toggle in the room configuration that enables screen sharing',
    id: 'components.rooms.config.enableScreenSharing',
  },
  enableWaitingRoom: {
    defaultMessage: 'Enable waiting room',
    description:
      'Label for the toggle in the room configuration (security) that enables the waiting room',
    id: 'components.rooms.config.enableWaitingRoom',
  },
  everyoneStartsMuted: {
    defaultMessage: 'Everyone starts muted',
    description:
      'Label for the toggle in the room configuration that makes everyone starting muted',
    id: 'components.rooms.config.everyoneStartsMuted',
  },
  everyoneStartsWithoutCamera: {
    defaultMessage: 'Everyone starts without camera',
    description:
      'Label for the toggle in the room configuration that makes everyone starting without camera',
    id: 'components.rooms.config.everyoneStartsWithoutCamera',
  },
  moderationTitle: {
    defaultMessage: 'Moderation',
    description: 'Title for the room configuration section with moderation settings',
    id: 'components.rooms.config.moderationTitle',
  },
  securityTitle: {
    defaultMessage: 'Security',
    description: 'Title for the room configuration section with security settings',
    id: 'components.rooms.config.securityTitle',
  },
  settingsTitle: {
    defaultMessage: 'Settings',
    description: 'Title for the room configuration section with general settings',
    id: 'components.rooms.config.settingsTitle',
  },
});

interface RoomConfigValues extends RoomSettings {
  is_public: boolean;
}

export interface RoomConfigProps {
  room: Room;
}

export const RoomConfig = ({ room }: RoomConfigProps) => {
  const intl = useIntl();
  const queryClient = useQueryClient();
  const isMobile = useIsMobile();
  const errors = useErrors();

  const updateQueryRoom = (newRoom: Room) => {
    queryClient.setQueryData([MagnifyQueryKeys.ROOM, room?.id], newRoom);
    queryClient.setQueryData([MagnifyQueryKeys.ROOM, room?.slug], newRoom);
    queryClient.setQueryData([MagnifyQueryKeys.ROOMS], (rooms: Room[] = []) => {
      if (rooms.length === 0) {
        queryClient.invalidateQueries([MagnifyQueryKeys.ROOM]);
        return;
      }

      if (!newRoom?.id) {
        return rooms;
      }
      const newRooms = [...rooms];
      const index = newRooms.findIndex((roomItem) => {
        return roomItem.id === newRoom.id;
      });

      if (index >= 0) {
        newRooms[index] = newRoom;
      } else {
        newRooms.push(newRoom);
      }
      return newRooms;
    });
  };

  const { mutate } = useMutation<Maybe<RoomResponse>, AxiosError, RoomConfigValues>(
    async (settings) => {
      if (room == null) {
        return;
      }
      const { is_public, ...roomConfiguration } = settings;
      return await RoomsRepository.update(room.id, { is_public, configuration: roomConfiguration });
    },
    {
      onSuccess: (newRoom) => {
        if (newRoom) {
          updateQueryRoom(newRoom);
        }
      },
      onError: (error) => {
        errors.onError(error);
        queryClient.invalidateQueries({
          predicate: (query) => {
            return query.queryKey.includes(MagnifyQueryKeys.ROOMS);
          },
        });
      },
    },
  );

  const initialValues: RoomConfigValues = {
    askForAuthentication: room?.configuration?.askForAuthentication ?? true,
    askForPassword: room?.configuration?.askForPassword ?? false,
    roomPassword: room?.configuration?.roomPassword ?? '',
    waitingRoomEnabled: room?.configuration?.waitingRoomEnabled ?? true,
    enableLobbyChat: room?.configuration?.enableLobbyChat ?? true,
    startWithAudioMuted: room?.configuration?.startWithAudioMuted ?? false,
    startWithVideoMuted: room?.configuration?.startWithVideoMuted ?? true,
    screenSharingEnabled: room?.configuration?.screenSharingEnabled ?? true,
    is_public: room.is_public,
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

  if (room && !room.is_administrable) {
    return null;
  }

  return (
    <>
      <Formik initialValues={initialValues} onSubmit={(values) => mutate(values)}>
        {(props) => (
          <FormikValuesChange
            onChange={(values: RoomConfigValues) => {
              const { is_public, ...roomConfiguration } = values;
              const newRoom: Room = { ...room, is_public, configuration: roomConfiguration };
              updateQueryRoom(newRoom);
            }}
          >
            <Grid
              areas={isMobile ? areas.small : areas.medium}
              columns={isMobile ? columns.small : columns.medium}
              gap={'20px'}
              rows={isMobile ? rows.small : rows.medium}
            >
              <Box gridArea={'settings'}>
                <MagnifyCard title={intl.formatMessage(roomConfigMessages.settingsTitle)}>
                  <Box gap="xxsmall">
                    <FormikSwitch
                      label={intl.formatMessage(roomConfigMessages.enableChat)}
                      name="enableLobbyChat"
                    />
                    <FormikSwitch
                      label={intl.formatMessage(roomConfigMessages.enableScreenSharing)}
                      name="screenSharingEnabled"
                    />
                  </Box>
                </MagnifyCard>
              </Box>
              <Box gap={'10px'} gridArea={'moderation'}>
                <MagnifyCard title={intl.formatMessage(roomConfigMessages.moderationTitle)}>
                  <Box gap="xxsmall" height="100%">
                    <FormikSwitch
                      label={intl.formatMessage(roomConfigMessages.everyoneStartsMuted)}
                      name="startWithAudioMuted"
                    />
                    <FormikSwitch
                      label={intl.formatMessage(roomConfigMessages.everyoneStartsWithoutCamera)}
                      name="startWithVideoMuted"
                    />
                  </Box>
                </MagnifyCard>
              </Box>
              <Box gap={'10px'} gridArea={'security'}>
                <MagnifyCard title={intl.formatMessage(roomConfigMessages.securityTitle)}>
                  <Box gap="xxsmall">
                    <FormikSwitch
                      label={intl.formatMessage(roomConfigMessages.isPublicRoom)}
                      name="is_public"
                    />
                    <FormikSwitch
                      label={intl.formatMessage(roomConfigMessages.enableWaitingRoom)}
                      name="waitingRoomEnabled"
                    />
                    <Box gap={'10px'}>
                      <FormikSwitch
                        label={intl.formatMessage(roomConfigMessages.askForPassword)}
                        name="askForPassword"
                      />
                      {props.values.askForPassword === true && (
                        <FormikInput
                          fullWidth={true}
                          label={intl.formatMessage(roomConfigMessages.askForPasswordInputLabel)}
                          name="roomPassword"
                          type={'password'}
                        />
                      )}
                    </Box>
                  </Box>
                </MagnifyCard>
              </Box>
            </Grid>
          </FormikValuesChange>
        )}
      </Formik>
    </>
  );
};
