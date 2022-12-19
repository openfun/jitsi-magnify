import { Box, Button, ButtonExtendedProps } from 'grommet';
import * as React from 'react';
import { useEffect, useState } from 'react';
import { defineMessages, useIntl } from 'react-intl';
import { useAuthContext } from '../../../../context';
import { commonRoomMessages } from '../../../../i18n/Messages/Room/commonRoomMessages';
import { Room, RoomAccessRole, RoomUser, User } from '../../../../types';
import { MagnifyCard } from '../../../design-system/Card';
import MagnifyList from '../../../design-system/List/MagnifyList';
import { useMagnifyModal } from '../../../design-system/Modal';
import { UserSearchModal } from '../../../users/search-modal';
import { RoomUsersConfigRow } from './Row';

const roomConfigUserMessages = defineMessages({
  sectionTitle: {
    defaultMessage: 'Members',
    description: 'Ttitle for the members section ',
    id: 'components.rooms.config.users.sectionTitle',
  },
  addMember: {
    defaultMessage: 'Add a member',
    description: 'Text for the add member button',
    id: 'components.rooms.config.users.addMember',
  },
});

export interface RoomUsersConfigProps {
  addUser: (user: User) => void;
  onUpdateUser: (role: RoomAccessRole, userId: string, accessId: string) => void;
  onDeleteUser: (accessId: string) => void;
  room: Room;
}

export const RoomUsersConfig = ({ room, ...props }: RoomUsersConfigProps) => {
  const intl = useIntl();
  const addUserModal = useMagnifyModal();
  const authContext = useAuthContext();
  const [currentUserRole, setCurrentUserRole] = useState<string>('owner');
  const [numberOfOwner, setNumberOfOwner] = useState(0);

  useEffect(() => {
    let numberOfOwner = 0;
    room.user_accesses?.forEach((access) => {
      if (access.role === RoomAccessRole.OWNER) {
        numberOfOwner++;
      }
      if (access.user.id === authContext.user?.id) {
        setCurrentUserRole(access.role);
      }
    });
    setNumberOfOwner(numberOfOwner);
  }, [room]);

  const onSelectUser = (user?: User): void => {
    addUserModal.closeModal();
    if (!user) {
      return;
    }

    props.addUser(user);
  };

  const getAvailableRoles = (user: RoomUser, userRole: RoomAccessRole): ButtonExtendedProps[] => {
    if (!room.is_administrable) {
      return [];
    }

    const isCurrentUSer = user.id === authContext.user?.id;
    const currentUserIsOwner = currentUserRole === RoomAccessRole.OWNER;
    const isOwner = userRole === RoomAccessRole.OWNER;
    const isLastUser = room.user_accesses?.length === 1;
    const isLastOwner = isOwner && numberOfOwner === 1;

    return [
      {
        value: RoomAccessRole.OWNER,
        label: intl.formatMessage(commonRoomMessages.role_owner),
        disabled:
          (isCurrentUSer && !currentUserIsOwner) ||
          (!isCurrentUSer && isOwner) ||
          isLastUser ||
          isLastOwner,
      },
      {
        value: RoomAccessRole.ADMINISTRATOR,
        label: intl.formatMessage(commonRoomMessages.role_administrator),
        disabled: (!isCurrentUSer && isOwner) || isLastUser || isLastOwner,
      },
      {
        value: RoomAccessRole.MEMBER,
        label: intl.formatMessage(commonRoomMessages.role_member),
        disabled: (!isCurrentUSer && isOwner) || isLastUser || isLastOwner,
      },
    ];
  };

  const updateRole = (newRole: RoomAccessRole, userId: string, accessId: string): void => {
    props.onUpdateUser(newRole, userId, accessId);
  };

  return (
    <>
      <MagnifyCard
        gapContent={'medium'}
        title={intl.formatMessage(roomConfigUserMessages.sectionTitle)}
      >
        <Box direction={'row'} justify={'end'}>
          {room.is_administrable && (
            <Button
              primary
              label={intl.formatMessage(roomConfigUserMessages.addMember)}
              onClick={() => addUserModal.openModal()}
            />
          )}
        </Box>
        <MagnifyList
          rows={room.user_accesses ?? []}
          Row={(rowProps) => (
            <RoomUsersConfigRow
              {...rowProps}
              canUpdate={room.is_administrable}
              options={getAvailableRoles(rowProps.item.user, rowProps.item.role)}
              role={rowProps.item.role}
              user={rowProps.item.user}
              onDelete={() => {
                props.onDeleteUser(rowProps.item.id);
              }}
              onUpdateRole={(newRole: RoomAccessRole) =>
                updateRole(newRole, rowProps.item.user.id, rowProps.item.id)
              }
            />
          )}
        />
      </MagnifyCard>

      <UserSearchModal
        {...addUserModal}
        modalUniqueId={'add-room-user'}
        onSelectUser={onSelectUser}
      />
    </>
  );
};
