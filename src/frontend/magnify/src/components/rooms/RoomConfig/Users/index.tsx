import { Box, Button } from 'grommet';
import * as React from 'react';
import { useEffect, useState } from 'react';
import { useIntl } from 'react-intl';
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
  users?: RoomUser[];
  onSearchUser: (term: string) => Promise<User[]>;
}

export const RoomUsersConfig = ({ onSearchUser, users = [], ...props }: RoomUsersConfigProps) => {
  const intl = useIntl();
  const addUserModal = useMagnifyModal();

  const [allUsers, setAllUsers] = useState<User[]>([]);

  const getAllUsers = async (newUsers: RoomUser[]): Promise<void> => {
    const allUsers: User[] = [];
    await Promise.all(
      newUsers.map(async (item) => {
        const newUser = await UsersRepository.get(item.user);
        console.log('newUser', newUser);
        allUsers.push(newUser);
      }),
    );
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

  return (
    <>
      <MagnifyCard gapContent={'medium'} title={'administrators'}>
        <Box direction={'row'} justify={'end'}>
          <Button
            primary
            label={intl.formatMessage(roomConfigMessages.addUser)}
            onClick={() => addUserModal.openModal()}
          />
        </Box>
        <MagnifyList Row={(props) => <UserRow {...props} user={props.item} />} rows={allUsers} />
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
