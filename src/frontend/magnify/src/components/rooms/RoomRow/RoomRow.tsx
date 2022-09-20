import { defineMessages } from '@formatjs/intl';
import { Box, Button, Card, Grid, Tag, Text } from 'grommet';
import React from 'react';
import { useIntl } from 'react-intl';
import { Link } from 'react-router-dom';

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
    <Card background="light-2" elevation="0" margin={{ bottom: '10px' }} pad="small">
      <Grid
        fill
        columns={['flex', 'auto']}
        gap="small"
        rows={['flex']}
        areas={[
          { name: 'title', start: [0, 0], end: [0, 0] },
          { name: 'action', start: [1, 0], end: [1, 0] },
        ]}
      >
        <Box gridArea="title">
          <Box direction="row" gap="small" margin="auto 0px">
            <Box margin="auto 0px">
              <Link to={`/rooms/${room.slug}`}>
                <Text color="brand" size="medium" weight="bold">
                  {room.name}
                </Text>
              </Link>
            </Box>
            {room.isAdmin && (
              <Tag
                as={(p) => <Text color="brand" {...p} />}
                value={intl.formatMessage(messages.admin)}
              />
            )}
          </Box>
        </Box>

        <Box align="center" gridArea="action">
          <Box direction="row" margin="auto">
            {room.isAdmin && (
              <Box margin={{ vertical: 'auto', horizontal: 'small' }}>
                <Link to={`/rooms/${room.slug}/settings`}>
                  <SettingsSVG color="brand" />
                </Link>
              </Box>
            )}
            <Button
              primary
              label={intl.formatMessage(messages.join)}
              as={({ children, type, className }) => (
                <Link className={className} to={`${baseJitsiUrl}/${room.slug}`} type={type}>
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
