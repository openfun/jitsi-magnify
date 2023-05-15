import { Box, Text } from 'grommet';
import { Heading, Spinner } from 'grommet/components';
import React from 'react';
import { defineMessages } from 'react-intl';
import { useRouting } from '../../../context';
import { useTranslations } from '../../../i18n';
import { KeycloakService } from '../../../services';
import { Room } from '../../../types/entities/room';
import { CustomCard } from '../../design-system';
import { RegisterRoom } from '../RegisterRoom';
import { RoomRow } from '../RoomRow';

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
  claim_room: {
    id: 'components.rooms.myRooms.claim_room',
    defaultMessage: 'Claiming a room',
    description: 'Claiming a room label',
  },
});

export interface MyRoomsProps {
  baseJitsiUrl: string;
  rooms?: Room[] | undefined;
  isLoading?: boolean;
}

export const MyRooms = ({ baseJitsiUrl, rooms = [], ...props }: MyRoomsProps) => {
  const intl = useTranslations();
  const routing = useRouting();
  const isLog = KeycloakService.isLoggedIn();
  const showClaimingRoom = !isLog && window.config.MAGNIFY_SHOW_REGISTER_LINK;

  if (!isLog && !showClaimingRoom) return null;

  return (
    <>
      <CustomCard>
        <Box align={'center'} direction={'row'} flex={true} justify={'between'}>
          <Heading level={4}>
            {intl.formatMessage(messages.myRoomCardTitle)}
            {rooms?.length > 0 ? ` (${rooms?.length})` : ''}
          </Heading>
          <div>{isLog && <RegisterRoom />}</div>
        </Box>
        {isLog && (
          <>
            {props.isLoading && (
              <Box align={'center'} height={'100px'} justify={'center'}>
                <Spinner />
              </Box>
            )}
            {rooms?.length > 0 ? (
              rooms.map((room) => {
                return <RoomRow key={room.slug} baseJitsiUrl={baseJitsiUrl} room={room} />;
              })
            ) : (
              <Text alignSelf="center" size="small">
                {intl.formatMessage(messages.emptyRoomListMessage)}
              </Text>
            )}
          </>
        )}
        {showClaimingRoom && (
          <Box
            align={'center'}
            direction={'row'}
            justify={'between'}
            onClick={routing.goToLogin}
            pad={'10px'}
            round={'8px'}
            border={{
              style: 'dashed',
              color: 'brand',
            }}
          >
            <Text color={'brand'} size={'small'} weight={'bold'}>
              {intl.formatMessage(messages.claim_room)}
            </Text>
            <Box
              align={'center'}
              background={'brand'}
              color={'white'}
              direction={'row'}
              height={'20px'}
              justify={'center'}
              round={'3px'}
              width={'20px'}
            >
              +
            </Box>
          </Box>
        )}
      </CustomCard>
    </>
  );
};
