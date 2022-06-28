import { Box, Card, CheckBox, Grid, Tag, Text } from 'grommet';
import React from 'react';
import { defineMessages, useIntl } from 'react-intl';
import { Member } from '../../../types/member';
import { SquareAvatar } from '../../design-system';
import { Star } from 'grommet-icons';

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
      pad="small"
      elevation="0"
      margin={{ bottom: '10px' }}
      direction="row"
    >
      <Grid
        columns={['auto', 'auto', 'auto', 'flex', 'auto']}
        rows={['auto']}
        areas={[
          { name: 'actions', start: [0, 0], end: [0, 0] },
          { name: 'adminStar', start: [1, 0], end: [1, 0] },
          { name: 'avatar', start: [2, 0], end: [2, 0] },
          { name: 'name', start: [3, 0], end: [3, 0] },
          { name: 'admin', start: [4, 0], end: [4, 0] },
        ]}
        gap="small"
        align="center"
        fill
      >
        {onToggle && (
          <Box gridArea="actions">
            <Box margin="auto">
              <CheckBox checked={selected} onChange={onToggle} title="Select Group" />
            </Box>
          </Box>
        )}

        <Box gridArea="adminStar" width="24px" align="center">
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
              value={intl.formatMessage(messages.admin)}
              as={(p) => <Text color="brand" {...p} />}
            />
          )}
        </Box>
      </Grid>
    </Card>
  );
}
