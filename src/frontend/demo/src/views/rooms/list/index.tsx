import {
  InstantRoom,
  MagnifyQueryKeys,
  MyRooms,
  RoomsRepository,
  useTranslations,
} from '@jitsi-magnify/core';
import { useQuery } from '@tanstack/react-query';
import { Box, Card, Heading } from 'grommet';
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
  startInstantRoomTitle: {
    id: 'view.rooms.list.startInstantRoomTitle',
    defaultMessage: 'Start a conference',
    description: 'Title for the start instant room block',
  },
});

export function RoomsListView() {
  const intl = useTranslations();

  const { data: rooms, isLoading } = useQuery([MagnifyQueryKeys.ROOMS], RoomsRepository.getAll);

  return (
    <DefaultPage title={intl.formatMessage(roomsListMessages.roomsListViewTitle)}>
      <Box gap={'20px'}>
        <Card background={'white'} gap={'medium'} pad={'medium'}>
          <Heading level={4} margin={'none'}>
            {intl.formatMessage(roomsListMessages.startInstantRoomTitle)}
          </Heading>
          <InstantRoom />
        </Card>
        <MyRooms baseJitsiUrl={'/j'} isLoading={isLoading} rooms={rooms ?? []} />
      </Box>
    </DefaultPage>
  );
}
