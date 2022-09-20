import React from 'react';
import { defineMessages } from 'react-intl';
import { useQuery } from 'react-query';
import { useController } from '../../../controller';
import { RowsList } from '../../design-system';
import RegisterRoom from '../RegisterRoom';
import RoomRow from '../RoomRow';

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
      Header={RegisterRoom}
      Row={({ room }) => <RoomRow baseJitsiUrl={baseJitsiUrl} room={room} />}
      isLoading={isLoading}
      label={messages.roomsListLabel}
      rows={(rooms || []).map((room) => ({ room, id: room.id }))}
    />
  );
};

export default MyRooms;
