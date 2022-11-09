import {
  MagnifyQueryKeys,
  RoomConfig,
  RoomsRepository,
  RoomUsersConfig,
  UsersRepository,
  useTranslations,
} from '@jitsi-magnify/core';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Spinner } from 'grommet';
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

  const mutation = useMutation(
    (data: { roomId: string; userId: string; isAdmin?: boolean }) =>
      RoomsRepository.addUser(data.roomId, data.userId, data.isAdmin),
    {
      onSuccess: (newRoom) => {
        console.log(newRoom);
      },
    },
  );

  return (
    <DefaultPage title={intl.formatMessage(roomSettingsMessages.roomSettingsTitle)}>
      {isLoading && <Spinner />}
      {!isLoading && room && (
        <>
          <RoomConfig room={room} />
          <RoomUsersConfig
            onSearchUser={UsersRepository.search}
            users={room.users ?? []}
            addUser={(user) =>
              mutation.mutate({
                roomId: room.id,
                userId: user.id,
              })
            }
          />
        </>
      )}
    </DefaultPage>
  );
}
