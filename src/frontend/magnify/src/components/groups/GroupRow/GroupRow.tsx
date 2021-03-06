import { Avatar, Box, Card, CheckBox, Grid, ResponsiveContext, Text } from 'grommet';
import React, { ChangeEvent, useContext } from 'react';
import { More } from 'grommet-icons';
import { Group } from '../../../types/group';
import { SquareAvatar } from '../../design-system';
import { Link } from 'react-router-dom';

export interface GroupRowProps {
  /**
   * The group to display
   */
  group: Group;
  /**
   * Callback when the group is selected or deselected
   */
  onToggle: (selected: boolean) => void;
  /**
   * Is the group currently selected
   */
  selected: boolean;
}

export default function GroupRow({ group, onToggle, selected }: GroupRowProps) {
  const screenSize = useContext(ResponsiveContext);
  const handleToggle = (event: ChangeEvent<HTMLInputElement>) => {
    onToggle(event.target.checked);
  };

  // Get a number between 0 and 3 representing the size of the screen
  // 0 = big, 1 = large, 2 = medium, 3 = small, 4 = xsmall
  const numberOfDisplayedMembers =
    {
      small: 2,
      medium: 4,
      large: 9,
    }[screenSize] || 9;

  return (
    <Card background="light-2" pad="small" elevation="0" margin={{ bottom: '10px' }}>
      <Grid
        fill
        areas={[
          { name: 'action', start: [0, 0], end: [0, 0] },
          { name: 'title', start: [1, 0], end: [1, 0] },
          { name: 'members', start: [2, 0], end: [2, 0] },
          { name: 'membersNumber', start: [3, 0], end: [3, 0] },
        ]}
        columns={['xxsmall', 'flex', 'flex', 'xsmall']}
        rows={['flex']}
        gap="small"
      >
        <Box gridArea="action" align="center">
          <Box margin="auto">
            <CheckBox checked={selected} onChange={handleToggle} title="Select Group" />
          </Box>
        </Box>
        <Box gridArea="title">
          <Box margin="auto 0px">
            <Link to={`/groups/${group.id}`}>
              <Text size="medium" color="brand" weight="bold">
                {group.name}
              </Text>
            </Link>
          </Box>
        </Box>
        <Box
          gridArea="members"
          direction="row"
          gap="small"
          justify="end"
          margin={{ vertical: 'auto' }}
        >
          {group.members.slice(0, numberOfDisplayedMembers).map((member) => (
            <SquareAvatar src={member.avatar} key={member.id} title={member.name} />
          ))}
          {numberOfDisplayedMembers < group.members.length ? (
            <SquareAvatar
              title={group.members
                .slice(numberOfDisplayedMembers)
                .map((member) => member.name)
                .join(', ')}
              more
            />
          ) : (
            <SquareAvatar />
          )}
        </Box>
        <Box gridArea="membersNumber" justify="center">
          <Avatar background="brand" margin="auto" pad="small" size="26px" round="xsmall">
            {group.members.length}
          </Avatar>
        </Box>
      </Grid>
    </Card>
  );
}
