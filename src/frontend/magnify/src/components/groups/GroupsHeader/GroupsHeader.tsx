import { Box, Card, CheckBox, Grid, Text } from 'grommet';
import React, { ChangeEvent } from 'react';
import { defineMessages, useIntl } from 'react-intl';

export interface GroupsHeaderProps {
  /**
   * The selected groups
   */
  groupsSelected: { [id: string]: boolean };
  /**
   * A callback to handle toggleing groups
   */
  setGroupsSelected: (groupsSelected: { [id: string]: boolean }) => void;
}

const messages = defineMessages({
  selectAllHeaderLabel: {
    defaultMessage: 'Select all',
    description: 'The label for the select all checkbox',
    id: 'components.groups.GroupsHeader.selectAllHeaderLabel',
  },
});

export default function GroupsHeader({ groupsSelected, setGroupsSelected }: GroupsHeaderProps) {
  const intl = useIntl();

  const handleToggleAll = (event: ChangeEvent<HTMLInputElement>) => {
    setGroupsSelected(
      Object.fromEntries(
        Object.keys(groupsSelected).map((groupId) => [groupId, event.target.checked]),
      ),
    );
  };

  const numberChecked = Object.values(groupsSelected).filter((selected) => selected).length;
  const numberOfGroups = Object.keys(groupsSelected).length;

  return (
    <Card background="light-3" pad="small" elevation="0" margin={{ bottom: '10px' }}>
      <Grid
        fill
        areas={[
          { name: 'action', start: [0, 0], end: [0, 0] },
          { name: 'title', start: [1, 0], end: [1, 0] },
        ]}
        columns={['xxsmall', 'flex']}
        rows={['flex']}
        gap="small"
      >
        <Box gridArea="action" align="center">
          <Box margin="auto">
            <CheckBox
              checked={numberChecked === numberOfGroups}
              indeterminate={numberChecked > 0 && numberChecked < numberOfGroups}
              onChange={handleToggleAll}
              title={intl.formatMessage(messages.selectAllHeaderLabel)}
            />
          </Box>
        </Box>
        <Box gridArea="title">
          <Box margin="auto 0px">
            <Text size="medium" color="brand" weight="bold">
              {intl.formatMessage(messages.selectAllHeaderLabel)}
            </Text>
          </Box>
        </Box>
      </Grid>
    </Card>
  );
}
