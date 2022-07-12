import { defineMessages, useIntl } from 'react-intl';
import React from 'react';
import { RowsList } from '../../design-system';
import { useController } from '../../../controller';
import { useQuery } from 'react-query';
import { UserRow } from '../../users';
import { Box, Layer } from 'grommet';
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
        label={messages.usersLabel}
        addLabel={intl.formatMessage(messages.addUserToGroupLabel)}
        onAdd={() => setOpenAddUser(true)}
        Row={({ user }) => <UserRow user={user} />}
        rows={(group?.members || []).map((user) => ({ user, id: user.id }))}
        isLoading={isLoading}
      />
      {openAddUser && (
        <Layer onClickOutside={handleCloseAddUser} onEsc={handleCloseAddUser}>
          <Box pad="medium">
            <AddUserForm
              groupId={groupId}
              onSuccess={handleCloseAddUser}
              onCancel={handleCloseAddUser}
            />
          </Box>
        </Layer>
      )}
    </>
  );
};

export default GroupUserList;
