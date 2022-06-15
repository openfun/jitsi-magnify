import { Box, Button, Card, CheckBox, Grid, Menu, Text } from 'grommet';
import React, { useState } from 'react';
import { Group } from '../../../types/group.interface';
import GroupRow from '../GroupRow/GroupRow';
import GroupsHeader from '../GroupsHeader/GroupsHeader';

export interface GroupsListProps {
  /**
   * The group to display
   */
  groups: Group[];
}

export default function GroupList({ groups }: GroupsListProps) {
  const [groupsSelected, setGroupsSelected] = useState(
    Object.fromEntries(groups.map((group) => [group.id, false])),
  );

  const handleToggle = (groupId: string, selected: boolean) => {
    setGroupsSelected({ ...groupsSelected, [groupId]: selected });
  };

  const numberOfGroupsSelected = Object.values(groupsSelected).filter(
    (selected) => selected,
  ).length;

  return (
    <Card background="white" pad="small" elevation="0">
      <Grid
        fill
        areas={[
          { name: 'title', start: [0, 0], end: [0, 0] },
          { name: 'actions', start: [1, 0], end: [1, 0] },
        ]}
        columns={['flex', 'flex']}
        rows={['flex']}
        gap="small"
      >
        <Box gridArea="title" pad={{ vertical: 'medium', horizontal: 'small' }}>
          <Box margin="auto 0px">
            <Text size="medium" color="brand" weight="bold">
              ({groups.length} groups)
            </Text>
          </Box>
        </Box>
        <Box
          gridArea="actions"
          pad={{ vertical: 'medium', horizontal: 'small' }}
          direction="row"
          justify="end"
        >
          <Button primary label="Add Group" margin={{ vertical: 'auto', horizontal: 'xsmall' }} />
          <Menu
            name="Actions"
            role="menu"
            label="Actions"
            aria-label="Actions"
            margin={{ vertical: 'auto', horizontal: 'xsmall' }}
            items={[
              {
                label: numberOfGroupsSelected > 1 ? 'Delete groups' : 'Delete group',
                onClick: () => {},
                disabled: numberOfGroupsSelected === 0,
              },
              {
                label: numberOfGroupsSelected > 1 ? 'Rename groups' : 'Rename group',
                onClick: () => {},
                disabled: numberOfGroupsSelected === 0,
              },
              {
                label:
                  numberOfGroupsSelected > 1 ? 'Create room for groups' : 'Create room for group',
                onClick: () => {},
                disabled: numberOfGroupsSelected === 0,
              },
              {
                label:
                  numberOfGroupsSelected > 1
                    ? 'Create meeting for groups'
                    : 'Create meeting for group',
                onClick: () => {},
                disabled: numberOfGroupsSelected === 0,
              },
            ]}
          />
        </Box>
      </Grid>
      <GroupsHeader groupsSelected={groupsSelected} setGroupsSelected={setGroupsSelected} />
      {groups.map((group) => (
        <GroupRow
          group={group}
          key={group.id}
          selected={groupsSelected[group.id]}
          onToggle={(selected: boolean) => handleToggle(group.id, selected)}
        />
      ))}
    </Card>
  );
}
