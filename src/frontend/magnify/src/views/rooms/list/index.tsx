import { useQuery } from '@tanstack/react-query';
import * as React from 'react';
import { defineMessages } from 'react-intl';
import { MagnifyPageContent, MyRooms, RegisterRoom } from '../../../components';
import { useTranslations } from '../../../i18n';
import { RoomsRepository } from '../../../services/rooms/rooms.repository';
import { MagnifyQueryKeys } from '../../../utils/constants/react-query';

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

export interface RoomsViewProps {}

export function RoomsListView({ ...props }: RoomsViewProps) {
  const intl = useTranslations();

  const { data: rooms, isLoading } = useQuery([MagnifyQueryKeys.ROOMS], RoomsRepository.getAll);

  return (
    <MagnifyPageContent
      actions={<RegisterRoom />}
      title={intl.formatMessage(roomsListMessages.roomsListViewTitle)}
    >
      <MyRooms baseJitsiUrl={'/j'} isLoading={isLoading} rooms={rooms ?? []} />
    </MagnifyPageContent>
  );
}
