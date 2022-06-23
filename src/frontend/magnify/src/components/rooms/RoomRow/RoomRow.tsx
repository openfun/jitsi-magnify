import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Card, Grid, Tag, Text } from 'grommet';
import { defineMessages } from '@formatjs/intl';
import { useIntl } from 'react-intl';
import { useMutation } from 'react-query';

import { Room } from '../../../types/room';
import { useController } from '../../../controller';
import { LoadingButton } from '../../design-system';

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
  const controller = useController();
  const navigate = useNavigate();
  const { mutate, isLoading } = useMutation(controller.joinRoom, {
    onSuccess: (data) => {
      navigate(`${baseJitsiUrl}/${room.id}?token=${data.token}`);
    },
  });

  return (
    <Card background="light-2" pad="small" elevation="0" margin={{ bottom: '10px' }}>
      <Grid
        fill
        areas={[
          { name: 'title', start: [0, 0], end: [0, 0] },
          { name: 'action', start: [1, 0], end: [1, 0] },
        ]}
        columns={['flex', 'xsmall']}
        rows={['flex']}
        gap="small"
      >
        <Box gridArea="title">
          <Box margin="auto 0px" direction="row">
            <Text size="medium" color="brand" weight="bold" margin="auto 20px">
              {room.name}
            </Text>
            {room.isAdmin && (
              <Tag
                value={intl.formatMessage(messages.admin)}
                as={(p) => <Text color="brand" {...p} />}
              />
            )}
          </Box>
        </Box>

        <Box gridArea="action" align="center">
          <Box margin="auto">
            <LoadingButton
              label={intl.formatMessage(messages.join)}
              primary
              onClick={() => mutate(room.id)}
              isLoading={isLoading}
            />
          </Box>
        </Box>
      </Grid>
    </Card>
  );
}
