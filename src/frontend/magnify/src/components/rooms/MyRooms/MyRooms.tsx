import { defineMessages } from 'react-intl';
import React from 'react';
import { useController } from '../../../controller';
import { useQuery } from 'react-query';
import { RowsList } from '../../design-system';
import RoomRow from '../RoomRow';
import RegisterRoom from '../RegisterRoom';

export interface MyRoomsProps {
  baseJitsiUrl: string;
}

const messages = defineMessages({
  roomsListLabel: {
    id: 'components.rooms.myRooms.roomsListLabel',
    defaultMessage: 'My rooms',
    description: 'Label for the list of rooms',
  },
});

const MyRooms = ({ baseJitsiUrl }: MyRoomsProps) => {
  const controller = useController();
  const { data: rooms, isLoading } = useQuery('rooms', controller.getMyRooms);

  return (
    <RowsList
      label={messages.roomsListLabel}
      rows={(rooms || []).map((room) => ({ room, id: room.id }))}
      Row={({ room }) => <RoomRow room={room} baseJitsiUrl={baseJitsiUrl} />}
      isLoading={isLoading}
      Header={RegisterRoom}
    />
  );
};

export default MyRooms;
