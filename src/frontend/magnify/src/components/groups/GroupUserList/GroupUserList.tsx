import { useQuery } from '@tanstack/react-query';
import { Box, Layer } from 'grommet';
import React from 'react';
import { defineMessages, useIntl } from 'react-intl';
import { useController } from '../../../controller';
import { RowsList } from '../../design-system';
import { UserRow } from '../../users';
import AddUserForm from '../AddUserForm';

export interface GroupUserListProps {
  groupId: string;
}

const messages = defineMessages({
  usersLabel: {
    id: 'components.groups.GroupUserList.usersLabel',
    defaultMessage: 'Users',
    description: 'Users label',
  },
  addUserToGroupLabel: {
    id: 'components.groups.GroupUserList.addUserToGroupLabel',
    defaultMessage: 'Add user to group',
    description: 'Add user to group label',
  },
});

const GroupUserList = ({ groupId }: GroupUserListProps) => {
  const intl = useIntl();
  const [openAddUser, setOpenAddUser] = React.useState(false);
  const controller = useController();
  const { data: group, isLoading } = useQuery(['group', groupId], () =>
    controller.getGroup(groupId),
  );

  const handleCloseAddUser = () => setOpenAddUser(false);

  return (
    <>
      <RowsList
        Row={({ user }) => <UserRow user={user} />}
        addLabel={intl.formatMessage(messages.addUserToGroupLabel)}
        isLoading={isLoading}
        label={messages.usersLabel}
        onAdd={() => setOpenAddUser(true)}
        rows={(group?.members || []).map((user) => ({ user, id: user.id }))}
      />
      {openAddUser && (
        <Layer onClickOutside={handleCloseAddUser} onEsc={handleCloseAddUser}>
          <Box pad="medium">
            <AddUserForm
              groupId={groupId}
              onCancel={handleCloseAddUser}
              onSuccess={handleCloseAddUser}
            />
          </Box>
        </Layer>
      )}
    </>
  );
};

export default GroupUserList;
