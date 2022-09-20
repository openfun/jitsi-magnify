import { Box, Card, CheckBox, Grid, Tag, Text } from 'grommet';
import { Star } from 'grommet-icons';
import React from 'react';
import { defineMessages, useIntl } from 'react-intl';
import { Member } from '../../../types/member';
import { SquareAvatar } from '../../design-system';

export interface UserRowProps {
  user: Member;
  isAdmin?: boolean;
  selected?: boolean;
  onToggle?: (() => void) | null;
}

const messages = defineMessages({
  admin: {
    id: 'components.users.userList.admin',
    description: 'Admin label',
    defaultMessage: 'Admin',
  },
});

export default function UserRow({
  user,
  isAdmin = false,
  selected = false,
  onToggle = null,
}: UserRowProps) {
  const intl = useIntl();

  return (
    <Card
      background="light-2"
      direction="row"
      elevation="0"
      margin={{ bottom: '10px' }}
      pad="small"
    >
      <Grid
        fill
        align="center"
        columns={['auto', 'auto', 'auto', 'flex', 'auto']}
        gap="small"
        rows={['auto']}
        areas={[
          { name: 'actions', start: [0, 0], end: [0, 0] },
          { name: 'adminStar', start: [1, 0], end: [1, 0] },
          { name: 'avatar', start: [2, 0], end: [2, 0] },
          { name: 'name', start: [3, 0], end: [3, 0] },
          { name: 'admin', start: [4, 0], end: [4, 0] },
        ]}
      >
        {onToggle && (
          <Box gridArea="actions">
            <Box margin="auto">
              <CheckBox checked={selected} onChange={onToggle} title="Select Group" />
            </Box>
          </Box>
        )}

        <Box align="center" gridArea="adminStar" width="24px">
          {isAdmin && <Star color="brand" />}
        </Box>

        <Box gridArea="avatar">
          <SquareAvatar src={user.avatar} title={user.name} />
        </Box>

        <Box gridArea="name" margin={{ left: '10px' }}>
          <Text color="brand" weight="bold">
            {user.name}
          </Text>
        </Box>

        <Box gridArea="admin">
          {isAdmin && (
            <Tag
              as={(p) => <Text color="brand" {...p} />}
              value={intl.formatMessage(messages.admin)}
            />
          )}
        </Box>
      </Grid>
    </Card>
  );
}
