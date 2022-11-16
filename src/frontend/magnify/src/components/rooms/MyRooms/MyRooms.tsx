import { Box, Card, Text } from 'grommet';
import { Heading } from 'grommet/components';
import React from 'react';
import { defineMessages } from 'react-intl';
import { useTranslations } from '../../../i18n';
import { Room } from '../../../types/entities/room';
import RegisterRoom from '../RegisterRoom';
import RoomRow from '../RoomRow';

const messages = defineMessages({
  myRoomCardTitle: {
    id: 'components.rooms.myRooms.myRoomCardTitle',
    defaultMessage: 'List of rooms',
    description: 'Label for the button to register a new room',
  },
  emptyRoomListMessage: {
    id: 'components.rooms.myRooms.emptyRoomListMessage',
    defaultMessage: 'No room was created yet. Click on the button " + Room" to create one.',
    description: 'The message to display when there are no rooms.',
  },
});

export interface MyRoomsProps {
  baseJitsiUrl: string;
  rooms?: Room[] | undefined;
  isLoading?: boolean;
}

const MyRooms = ({ baseJitsiUrl, rooms = [], ...props }: MyRoomsProps) => {
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
      {rooms?.length > 0 ? (
        rooms.map((room) => {
          return <RoomRow key={room.slug} baseJitsiUrl={baseJitsiUrl} room={room} />;
        })
      ) : (
        <Text alignSelf="center" size="small">
          {intl.formatMessage(messages.emptyRoomListMessage)}
        </Text>
      )}
    </Card>
  );
};

export default MyRooms;
