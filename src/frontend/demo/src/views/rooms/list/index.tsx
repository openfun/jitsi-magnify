import {
  MagnifyQueryKeys,
  MyRooms,
  RegisterRoom,
  RoomsRepository,
  useTranslations,
} from '@jitsi-magnify/core';
import { useQuery } from '@tanstack/react-query';
import * as React from 'react';
import { defineMessages } from 'react-intl';
import { DefaultPage } from '../../../components/DefaultPage';

export const roomsListMessages = defineMessages({
  roomsListViewTitle: {
    defaultMessage: 'My Rooms',
    description: 'Page title for the rooms list page',
    id: 'view.rooms.list.roomsListViewTitle',
  },
  roomsListLabel: {
    id: 'view.rooms.list.roomsListLabel',
    defaultMessage: 'My rooms',
    description: 'Label for the list of rooms',
  },
});

export function RoomsListView() {
  const intl = useTranslations();

  const { data: rooms, isLoading } = useQuery([MagnifyQueryKeys.ROOMS], RoomsRepository.getAll);

  return (
    <DefaultPage
      actions={<RegisterRoom />}
      title={intl.formatMessage(roomsListMessages.roomsListViewTitle)}
    >
      <MyRooms baseJitsiUrl={'/j'} isLoading={isLoading} rooms={rooms ?? []} />
    </DefaultPage>
  );
}
