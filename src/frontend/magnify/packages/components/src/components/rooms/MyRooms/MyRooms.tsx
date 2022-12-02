import { Box, Card } from 'grommet';
import { Heading } from 'grommet/components';
import React from 'react';
import { defineMessages } from 'react-intl';
import { useTranslations } from '../../../i18n';
import { Room } from '../../../types/entities/room';
import { RegisterRoom } from '../RegisterRoom';
import { RoomRow } from '../RoomRow';

const messages = defineMessages({
  myRoomCardTitle: {
    id: 'components.rooms.myRooms.myRoomCardTitle',
    defaultMessage: 'List of rooms',
    description: 'Label for the button to register a new room',
  },
});

export interface MyRoomsProps {
  baseJitsiUrl: string;
  rooms?: Room[] | undefined;
  isLoading?: boolean;
}

export const MyRooms = ({ baseJitsiUrl, rooms = [], ...props }: MyRoomsProps) => {
  const intl = useTranslations();
  return (
    <Card background={'white'} gap={'small'} pad={'medium'}>
      <Box align={'center'} direction={'row'} flex={true} justify={'between'}>
        <Heading level={4}>
          {intl.formatMessage(messages.myRoomCardTitle)}
          {rooms?.length > 0 ? ` (${rooms?.length})` : ''}
        </Heading>
        <div>
          <RegisterRoom />
        </div>
      </Box>
      {rooms.map((room) => {
        return <RoomRow key={room.slug} baseJitsiUrl={baseJitsiUrl} room={room} />;
      })}
    </Card>
  );
};