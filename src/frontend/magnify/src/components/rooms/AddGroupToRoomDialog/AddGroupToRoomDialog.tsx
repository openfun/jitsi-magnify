import { useMutation, useQuery } from '@tanstack/react-query';
import { Box, Button, Heading, Layer, Select, Text } from 'grommet';
import { FormClose } from 'grommet-icons';
import React, { useState } from 'react';
import { defineMessages, useIntl } from 'react-intl';

import { useController } from '../../../controller';
import { Group } from '../../../types/group';
import { LoadingButton, WaitingRow } from '../../design-system';

const messages = defineMessages({
  AddGroupToRoomDialogTitle: {
    id: 'components.rooms.AddGroupToRoomDialog.AddGroupToRoomDialogTitle',
    defaultMessage: 'Add groups to room',
    description: 'Title of the add group to room dialog',
  },
  selectGroupsToAdd: {
    id: 'components.rooms.AddGroupToRoomDialog.selectGroupsToAdd',
    defaultMessage: 'Select groups to add',
    description: 'Label for the select groups to add',
  },
  addGroupsLabel: {
    id: 'components.rooms.AddGroupToRoomDialog.addGroupsLabel',
    defaultMessage:
      'Add {numberSelected} {numberSelected, plural, =0 {group} one {group} other {groups}}',
    description: 'Label for the add groups button',
  },
  cancelLabel: {
    id: 'components.rooms.AddGroupToRoomDialog.cancelLabel',
    defaultMessage: 'Cancel',
    description: 'Label for the cancel button',
  },
});

const renderGroup = (group: Group | undefined, onRemove: (id: string) => void) => {
  if (!group) return null;
  return (
    <Button
      key={group.id}
      href="#"
      onFocus={(event: React.FocusEvent) => event.stopPropagation()}
      onClick={(event: React.MouseEvent) => {
        event.preventDefault();
        event.stopPropagation();
        onRemove(group.id);
      }}
    >
      <Box
        align="center"
        background="brand"
        direction="row"
        gap="xsmall"
        height="calc(100% - 10px)"
        margin="xsmall"
        pad={{ vertical: 'xsmall', horizontal: 'small' }}
        round="xsmall"
        width="small"
      >
        <Text size="small">
          {group.name} ({group.members?.length})
        </Text>
        <Box margin={{ left: 'xsmall' }} round="full">
          <FormClose size="small" style={{ width: '12px', height: '12px' }} />
        </Box>
      </Box>
    </Button>
  );
};

export interface AddGroupToRoomDialogProps {
  open: boolean;
  onClose: () => void;
  roomSlug: string;
}

const AddGroupToRoomDialog = ({ open, onClose, roomSlug }: AddGroupToRoomDialogProps) => {
  const intl = useIntl();
  const controller = useController();
  const { data: groups, isLoading: groupsLoading } = useQuery(['groups'], controller.getGroups);
  const { mutate, isLoading } = useMutation(controller.addGroupsToRoom, {
    onSuccess: () => onClose(),
  });
  const [selected, setSelected] = useState<number[]>([]);

  const handleUnselect = (id: string) => {
    setSelected(selected.filter((groupIndex) => groups?.[groupIndex]?.id !== id));
  };

  const handleSubmit = () =>
    mutate({ roomSlug, groupIds: selected.map((index) => groups?.[index]?.id as string) });

  if (!open) return null;
  return (
    <Layer
      id="confirmDelete"
      onClickOutside={onClose}
      onEsc={onClose}
      position="center"
      role="dialog"
    >
      <Box pad="medium" width="large">
        <Heading color="brand" level={3} size="small">
          {intl.formatMessage(messages.AddGroupToRoomDialogTitle)}
        </Heading>
        {groupsLoading ? (
          <WaitingRow />
        ) : (
          <Select
            multiple
            closeOnChange={false}
            disabled={isLoading}
            options={(groups || []).map((group) => group.name)}
            selected={selected}
            onChange={({ selected: newSelected }) => {
              setSelected(newSelected);
            }}
            value={
              <Box wrap direction="row">
                {selected && selected.length > 0 ? (
                  selected.map((groupIndex) => renderGroup(groups?.[groupIndex], handleUnselect))
                ) : (
                  <Box pad="small">{intl.formatMessage(messages.selectGroupsToAdd)}</Box>
                )}
              </Box>
            }
          />
        )}
        <Box direction="row" justify="end" margin={{ top: 'medium' }}>
          <Button
            label={intl.formatMessage(messages.cancelLabel)}
            margin={{ right: 'small' }}
            onClick={onClose}
            onFocus={(event: React.FocusEvent) => event.stopPropagation()}
          />
          <LoadingButton
            primary
            disabled={groupsLoading || selected.length === 0}
            isLoading={isLoading}
            label={intl.formatMessage(messages.addGroupsLabel, { numberSelected: selected.length })}
            onClick={handleSubmit}
          />
        </Box>
      </Box>
    </Layer>
  );
};

export default AddGroupToRoomDialog;
