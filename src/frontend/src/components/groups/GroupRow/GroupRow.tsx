import { Avatar, Box, Card, CheckBox, Grid, Text } from 'grommet';
import React, { ChangeEvent, useRef, useState } from 'react';
import { More } from 'grommet-icons';
import { useMediaQuery } from 'react-responsive';

export interface Group {
  id: string;
  name: string;
  members: {
    id: string;
    name: string;
    avatar: string;
  }[];
}

export interface GroupRowProps {
  /**
   * The group to display
   */
  group: Group;
  /**
   * Callback when the group is selected or deselected
   */
  onToogle: (selected: boolean) => void;
}

export default function GroupRow(props: GroupRowProps) {
  const { group, onToogle } = props;
  const [checked, setChecked] = useState(false);
  const ref = useRef<HTMLInputElement>(null);

  const handleToogle = (event: ChangeEvent<HTMLInputElement>) => {
    setChecked(event.target.checked);
    onToogle(event.target.checked);
  };

  // Get a number between 0 and 3 representing the size of the screen
  // 0 = big, 1 = large, 2 = medium, 3 = small, 4 = xsmall
  const isBigScreen = useMediaQuery({ query: '(min-width: 1824px)' });
  const isLargeScreen = useMediaQuery({ query: '(min-width: 1224px)' });
  const isMediumScreen = useMediaQuery({ query: '(min-width: 824px)' });
  const isSmallScreen = useMediaQuery({ query: '(min-width: 424px)' });
  const matchingScreenSizes = [isBigScreen, isLargeScreen, isMediumScreen, isSmallScreen, true];
  const screenSize = matchingScreenSizes.findIndex((size) => size);
  const numberOfDisplayedMembers = 9 - 2 * screenSize;

  return (
    <Card background="light-2" pad="small" elevation="0">
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
        ref={ref}
      >
        <Box gridArea="action" align="center">
          <Box margin="auto">
            <CheckBox checked={checked} onChange={handleToogle} label="Select Group" />
          </Box>
        </Box>
        <Box gridArea="title">
          <Box margin="auto 0px">
            <Text size="medium" color="brand" weight="bold">
              {group.name}
            </Text>
          </Box>
        </Box>
        <Box gridArea="members" direction="row" gap="small" justify="end">
          {group.members.slice(0, numberOfDisplayedMembers).map((member) => (
            <Avatar
              round="xsmall"
              src={member.avatar}
              size="40px"
              key={member.id}
              title={member.name}
              data-testid="group-row-member-image"
            />
          ))}
          {numberOfDisplayedMembers < group.members.length && (
            <Avatar
              round="xsmall"
              size="40px"
              data-testid="more-members"
              title={group.members
                .slice(numberOfDisplayedMembers)
                .map((member) => member.name)
                .join(', ')}
            >
              <More color="brand" />
            </Avatar>
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
