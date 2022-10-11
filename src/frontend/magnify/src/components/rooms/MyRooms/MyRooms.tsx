import { Card } from 'grommet';
import React from 'react';
import { Room } from '../../../types/entities/room';
import RoomRow from '../RoomRow';

export interface MyRoomsProps {
  baseJitsiUrl: string;
  rooms?: Room[] | undefined;
  isLoading?: boolean;
}

const MyRooms = ({ baseJitsiUrl, ...props }: MyRoomsProps) => {
  return (
    <Card background={'white'} gap={'small'} pad={'medium'}>
      {props.rooms?.map((room) => {
        return <RoomRow key={room.slug} baseJitsiUrl={baseJitsiUrl} room={room} />;
      })}
    </Card>
  );
};

export default MyRooms;
