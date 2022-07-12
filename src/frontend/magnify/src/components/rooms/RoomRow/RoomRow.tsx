import React from 'react';
import { Link } from 'react-router-dom';
import { Box, Button, Card, Grid, Tag, Text } from 'grommet';
import { defineMessages } from '@formatjs/intl';
import { useIntl } from 'react-intl';

import { Room } from '../../../types/room';
import { SettingsSVG } from '../../design-system';

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

  return (
    <Card background="light-2" pad="small" elevation="0" margin={{ bottom: '10px' }}>
      <Grid
        fill
        areas={[
          { name: 'title', start: [0, 0], end: [0, 0] },
          { name: 'action', start: [1, 0], end: [1, 0] },
        ]}
        columns={['flex', 'auto']}
        rows={['flex']}
        gap="small"
      >
        <Box gridArea="title">
          <Box margin="auto 0px" direction="row" gap="small">
            <Box margin="auto 0px">
              <Link to={`/rooms/${room.slug}`}>
                <Text size="medium" color="brand" weight="bold">
                  {room.name}
                </Text>
              </Link>
            </Box>
            {room.isAdmin && (
              <Tag
                value={intl.formatMessage(messages.admin)}
                as={(p) => <Text color="brand" {...p} />}
              />
            )}
          </Box>
        </Box>

        <Box gridArea="action" align="center">
          <Box margin="auto" direction="row">
            {room.isAdmin && (
              <Box margin={{ vertical: 'auto', horizontal: 'small' }}>
                <Link to={`/rooms/${room.slug}/settings`}>
                  <SettingsSVG color="brand" />
                </Link>
              </Box>
            )}
            <Button
              label={intl.formatMessage(messages.join)}
              primary
              as={({ children, type, className }) => (
                <Link type={type} className={className} to={`${baseJitsiUrl}/${room.slug}`}>
                  {children}
                </Link>
              )}
            />
          </Box>
        </Box>
      </Grid>
    </Card>
  );
}
