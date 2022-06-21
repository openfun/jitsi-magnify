import { Box, Button, Card, Grid, Menu, Text } from 'grommet';
import React, { useState } from 'react';
import { defineMessages, useIntl } from 'react-intl';
import { Group } from '../../../types/group';
import GroupRow from '../GroupRow/GroupRow';
import GroupsHeader from '../GroupsHeader/GroupsHeader';

export interface GroupsListProps {
  /**
   * The group to display
   */
  groups: Group[];
}

const messages = defineMessages({
  addGroupButtonLabel: {
    defaultMessage: `Add group`,
    description: 'Call to action on the button to add a group',
    id: 'components.groups.GroupsList.addGroupButtonLabel',
  },
  actionGroupLabel: {
    defaultMessage: `Actions`,
    description: 'The label for the action menu',
    id: 'components.groups.GroupsList.actionGroupLabel',
  },
  deleteGroupButtonLabel: {
    defaultMessage: `Delete {groupCount, plural, =0 {group} one {group} other {groups}}`,
    description: 'Call to action on the button to delete a group',
    id: 'components.groups.GroupsList.deleteGroupButtonLabel',
  },
  renameGroupButtonLabel: {
    defaultMessage: `Rename group`,
    description: 'Call to action on the button to rename a group',
    id: 'components.groups.GroupsList.renameGroupButtonLabel',
  },
  createRoomButtonLabel: {
    defaultMessage: `Create room for {groupCount, plural, =0 {group} one {group} other {groups}}`,
    description: 'Call to action on the button to create a room for a group',
    id: 'components.groups.GroupsList.createRoomButtonLabel',
  },
  createMeetingButtonLabel: {
    defaultMessage: `Create meeting for {groupCount, plural, =0 {group} one {group} other {groups}}`,
    description: 'Call to action on the button to create a meeting for a group',
    id: 'components.groups.GroupsList.createMeetingButtonLabel',
  },
  numGroupsLabel: {
    defaultMessage: `{groupCount, plural, =0 {No group yet} one {# group} other {# groups}}`,
    description: 'The label for the number of groups',
    id: 'components.groups.GroupsList.numGroupsLabel',
  },
});

export default function GroupList({ groups }: GroupsListProps) {
  const intl = useIntl();
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
              (
              {intl.formatMessage(messages.numGroupsLabel, {
                groupCount: groups.length,
              })}
              )
            </Text>
          </Box>
        </Box>
        <Box
          gridArea="actions"
          pad={{ vertical: 'medium', horizontal: 'small' }}
          direction="row"
          justify="end"
        >
          <Button
            primary
            label={intl.formatMessage(messages.addGroupButtonLabel)}
            margin={{ vertical: 'auto', horizontal: 'xsmall' }}
          />
          <Menu
            name={intl.formatMessage(messages.actionGroupLabel)}
            role="menu"
            label={intl.formatMessage(messages.actionGroupLabel)}
            aria-label={intl.formatMessage(messages.actionGroupLabel)}
            margin={{ vertical: 'auto', horizontal: 'xsmall' }}
            items={[
              {
                label: intl.formatMessage(messages.deleteGroupButtonLabel, {
                  groupCount: numberOfGroupsSelected,
                }),
                onClick: () => {},
                disabled: numberOfGroupsSelected === 0,
              },
              {
                label: intl.formatMessage(messages.renameGroupButtonLabel),
                onClick: () => {},
                disabled: numberOfGroupsSelected !== 1,
              },
              {
                label: intl.formatMessage(messages.createRoomButtonLabel, {
                  groupCount: numberOfGroupsSelected,
                }),
                onClick: () => {},
                disabled: numberOfGroupsSelected === 0,
              },
              {
                label: intl.formatMessage(messages.createMeetingButtonLabel, {
                  groupCount: numberOfGroupsSelected,
                }),
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
