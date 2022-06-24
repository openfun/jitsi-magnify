import React from 'react';
import { defineMessages, useIntl } from 'react-intl';
import { Group } from '../../../types/group';
import { RowsList } from '../../design-system';
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
    defaultMessage: `Delete {numberOfSelected, plural, =0 {group} one {group} other {groups}}`,
    description: 'Call to action on the button to delete a group',
    id: 'components.groups.GroupsList.deleteGroupButtonLabel',
  },
  renameGroupButtonLabel: {
    defaultMessage: `Rename group`,
    description: 'Call to action on the button to rename a group',
    id: 'components.groups.GroupsList.renameGroupButtonLabel',
  },
  createRoomButtonLabel: {
    defaultMessage: `Create room for {numberOfSelected, plural, =0 {group} one {group} other {groups}}`,
    description: 'Call to action on the button to create a room for a group',
    id: 'components.groups.GroupsList.createRoomButtonLabel',
  },
  createMeetingButtonLabel: {
    defaultMessage: `Create meeting for {numberOfSelected, plural, =0 {group} one {group} other {groups}}`,
    description: 'Call to action on the button to create a meeting for a group',
    id: 'components.groups.GroupsList.createMeetingButtonLabel',
  },
  numGroupsLabel: {
    defaultMessage: `{numberOfRows, plural, =0 {No group yet} one {# group} other {# groups}}`,
    description: 'The label for the number of groups',
    id: 'components.groups.GroupsList.numGroupsLabel',
  },
});

export default function GroupList({ groups }: GroupsListProps) {
  const intl = useIntl();

  return (
    <RowsList
      label={messages.numGroupsLabel}
      addLabel={intl.formatMessage(messages.addGroupButtonLabel)}
      onAdd={() => {}}
      actionsLabel={intl.formatMessage(messages.actionGroupLabel)}
      Header={({ selected, setSelected }) => (
        <GroupsHeader groupsSelected={selected} setGroupsSelected={setSelected} />
      )}
      Row={({ group, selected, onToggle }) => (
        <GroupRow group={group} selected={selected} onToggle={onToggle} />
      )}
      rows={groups.map((group) => ({ group, id: group.id }))}
      actions={[
        { label: messages.deleteGroupButtonLabel, onClick: () => {}, disabled: (n) => n === 0 },
        { label: messages.renameGroupButtonLabel, onClick: () => {}, disabled: (n) => n !== 1 },
        { label: messages.createRoomButtonLabel, onClick: () => {}, disabled: (n) => n === 0 },
        { label: messages.createMeetingButtonLabel, onClick: () => {}, disabled: (n) => n === 0 },
      ]}
    />
  );
}
