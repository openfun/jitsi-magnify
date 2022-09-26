import { defineMessages } from '@formatjs/intl';
import { Box, Button, Card, Text } from 'grommet';
import { Configure } from 'grommet-icons';
import React from 'react';
import { useIntl } from 'react-intl';
import { useNavigate } from 'react-router-dom';

import { useIsSmallSize } from '../../../hooks/useIsMobile';
import { Room } from '../../../types/room';

import MagnifyRouterLink from '../../design-system/RouterLink/MagnifyRouterLink';

export interface RoomRowProps {
  /**
   * The room to display
   */
  room: Room;
  /**
   * The base path to the jitsi page to redirect on join
   * The room id will be appended to this path
   */
  baseJitsiUrl: string;
}

const messages = defineMessages({
  admin: {
    id: 'components.rooms.RoomRow.admin',
    defaultMessage: 'Admin',
    description: 'Indicates that the user is an admin of the room',
  },
  join: {
    id: 'components.rooms.RoomRow.join',
    defaultMessage: 'Join',
    description: 'Join the room',
  },
});

export default function RoomRow({ room, baseJitsiUrl }: RoomRowProps) {
  const intl = useIntl();
  const navigate = useNavigate();
  const isSmallSize = useIsSmallSize();

  return (
    <Card background="light-2" elevation="0" pad="small">
      <Box
        align={'center'}
        direction={isSmallSize ? 'column' : 'row'}
        gap={'20px'}
        justify={isSmallSize ? 'center' : 'between'}
      >
        <Box direction="row" gap="small" margin="auto 0px">
          <Box margin="auto 0px">
            <Text color="brand" size="medium" truncate={'tip'} weight="bold">
              <MagnifyRouterLink to={'/'}>{room.name}</MagnifyRouterLink>
            </Text>
          </Box>
        </Box>

        <Box align={'center'} direction="row">
          {room.isAdmin && (
            <Box margin={{ left: 'small' }}>
              <MagnifyRouterLink to={`/rooms/${room.slug}/settings`}>
                <Configure color="brand" />
              </MagnifyRouterLink>
            </Box>
          )}
          <Button
            primary
            label={intl.formatMessage(messages.join)}
            margin={{ left: 'small' }}
            onClick={() => navigate(`/rooms/${room.slug}/meeting`)}
          />
        </Box>
      </Box>
    </Card>
  );
}
