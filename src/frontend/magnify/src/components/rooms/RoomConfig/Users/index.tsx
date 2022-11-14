import { Box, Button, Spinner } from 'grommet';
import { ButtonExtendedProps } from 'grommet/components/Button';
import * as React from 'react';
import { useEffect, useState } from 'react';
import { useIntl } from 'react-intl';
import { useAuthContext } from '../../../../context';
import { commonMessages } from '../../../../i18n/Messages/commonMessages';
import { UsersRepository } from '../../../../services';
import { RoomUser, User } from '../../../../types';
import MagnifyCard from '../../../design-system/Card';
import MagnifyList from '../../../design-system/List';
import { useMagnifyModal } from '../../../design-system/Modal';
import { UserRow } from '../../../users/row';
import { UserSearchModal } from '../../../users/search-modal';
import { roomConfigMessages } from '../RoomConfig';

export interface RoomUsersConfigProps {
  addUser: (user: User) => void;
  loading?: boolean;
  users?: RoomUser[];
  onSearchUser: (term: string) => Promise<User[]>;
  onDeleteUser: (user: User) => void;
}

export const RoomUsersConfig = ({ onSearchUser, users = [], ...props }: RoomUsersConfigProps) => {
  const intl = useIntl();
  const addUserModal = useMagnifyModal();
  const user = useAuthContext();
  const [currentUserIsAdmin, setCurrentUserIsAdmin] = useState(false);

  const [allUsers, setAllUsers] = useState<User[]>([]);
  const [fetchUsersLoading, setFetchUsersLoading] = useState(false);

  const getAllUsers = async (newUsers: RoomUser[]): Promise<void> => {
    const allUsers: User[] = [];
    setFetchUsersLoading(true);
    await Promise.all(
      newUsers.map(async (item) => {
        const newUser = await UsersRepository.get(item.user);
        allUsers.push(newUser);
      }),
    );
    setFetchUsersLoading(false);
    setAllUsers(allUsers);
  };

  useEffect(() => {
    if (!users || users.length === 0) {
      return;
    }
    getAllUsers(users);
  }, [users]);

  const onSelectUser = (user?: User): void => {
    addUserModal.closeModal();
    if (!user) {
      return;
    }
    props.addUser(user);
  };

  const handleDeleteUser = (user: User): void => {
    props.onDeleteUser(user);
  };

  const getUserMoreActions = (user: User): ButtonExtendedProps[] => {
    return [
      {
        label: intl.formatMessage(commonMessages.delete),
        onClick: () => handleDeleteUser(user),
      },
    ];
  };

  return (
    <>
      <MagnifyCard gapContent={'medium'} style={{ position: 'relative' }} title={'administrators'}>
        {(props.loading || fetchUsersLoading) && (
          <Box
            align={'center'}
            background={'light-2'}
            justify={'center'}
            style={{ opacity: 0.65, position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }}
          >
            <Spinner />
          </Box>
        )}
        <Box direction={'row'} justify={'end'}>
          <Button
            primary
            label={intl.formatMessage(roomConfigMessages.addUser)}
            onClick={() => addUserModal.openModal()}
          />
        </Box>
        <MagnifyList
          rows={allUsers}
          Row={(props) => (
            <UserRow {...props} moreActions={getUserMoreActions(props.item)} user={props.item} />
          )}
        />
      </MagnifyCard>
      <UserSearchModal
        {...addUserModal}
        modalUniqueId={'add-room-user'}
        onSearchUser={onSearchUser}
        onSelectUser={onSelectUser}
      />
    </>
  );
};
