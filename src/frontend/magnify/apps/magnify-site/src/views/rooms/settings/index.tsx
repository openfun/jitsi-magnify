import {
  MagnifyQueryKeys,
  RoomAccessRole,
  RoomConfig,
  RoomsRepository,
  RoomUsersConfig,
  User,
  useTranslations,
} from '@openfun/magnify-components';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { Box, Spinner } from 'grommet';
import * as React from 'react';
import { defineMessages } from 'react-intl';
import { useParams } from 'react-router-dom';
import { DefaultPage } from '../../../components/DefaultPage';

export const roomSettingsMessages = defineMessages({
  roomSettingsTitle: {
    defaultMessage: 'Room settings',
    description: 'Page title for the rooms settings page',
    id: 'view.rooms.settings.roomSettingsTitle',
  },
});

export function RoomSettingsView() {
  const intl = useTranslations();
  const { id } = useParams();
  const queryClient = useQueryClient();
  const { data: room, isLoading } = useQuery([MagnifyQueryKeys.ROOM, id], () => {
    return RoomsRepository.get(id);
  });

  const invalidateAllQueries = (): void => {
    queryClient.invalidateQueries([MagnifyQueryKeys.ROOM, id]);
    queryClient.invalidateQueries([MagnifyQueryKeys.ROOM]);
  };

  const addUser = (user: User): void => {
    if (!room) {
      return;
    }
    RoomsRepository.addUser(room.id, RoomAccessRole.MEMBER, user.id).then(() => {
      invalidateAllQueries();
    });
  };

  const updateUser = (role: RoomAccessRole, userId: string, accessId: string): void => {
    if (!room) {
      return;
    }
    RoomsRepository.updateUser(room.id, role, userId, accessId).then(() => {
      invalidateAllQueries();
    });
  };

  const deleteUser = (accessId: string): void => {
    if (!room) {
      return;
    }
    RoomsRepository.deleteUser(accessId).then(() => {
      invalidateAllQueries();
    });
  };

  return (
    <DefaultPage title={intl.formatMessage(roomSettingsMessages.roomSettingsTitle)}>
      {isLoading && <Spinner />}
      {!isLoading && room && (
        <>
          <RoomConfig room={room} />
          <Box margin={'15px 0'}>
            <RoomUsersConfig
              addUser={addUser}
              onDeleteUser={deleteUser}
              onUpdateUser={updateUser}
              room={room}
            />
          </Box>
        </>
      )}
    </DefaultPage>
  );
}
