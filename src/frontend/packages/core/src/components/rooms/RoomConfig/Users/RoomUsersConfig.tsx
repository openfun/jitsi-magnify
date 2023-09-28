import { Button } from '@openfun/cunningham-react';
import * as React from 'react';
import { useCallback, useEffect, useState } from 'react';
import { defineMessages, useIntl } from 'react-intl';
import { useAuthContext } from '../../../../context';
import { commonRoomMessages } from '../../../../i18n/Messages/Room/commonRoomMessages';
import { Room, RoomAccessRole, RoomUser, RoomUserAccesses, User } from '../../../../types';
import { SelectOption } from '../../../../types/misc';
import { MagnifyCard } from '../../../design-system/Card';
import MagnifyList, { RowPropsExtended } from '../../../design-system/List/MagnifyList';
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

  const onSelectUser = (user?: User): void => {
    addUserModal.closeModal();
    if (!user) {
      return;
    }

    props.addUser(user);
  };

  const getAvailableOptions = (user: RoomUser, userRole: RoomAccessRole): SelectOption[] => {
    if (!room.is_administrable) {
      return [];
    }

    const isCurrentUSer = user.id === authContext.user?.id;
    const currentUserIsOwner = currentUserRole === RoomAccessRole.OWNER;
    const isOwner = userRole === RoomAccessRole.OWNER;
    const isLastUser = room.accesses?.length === 1;
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

  const RoomUserAccessRow = useCallback(
    (rowProps: RowPropsExtended<RoomUserAccesses>) => (
      <RoomUsersConfigRow
        {...rowProps}
        canUpdate={room.is_administrable}
        options={getAvailableOptions(rowProps.item.user, rowProps.item.role)}
        role={rowProps.item.role}
        user={rowProps.item.user}
        onDelete={() => {
          props.onDeleteUser(rowProps.item.id);
        }}
        onUpdateRole={(newRole: RoomAccessRole) =>
          updateRole(newRole, rowProps.item.user.id, rowProps.item.id)
        }
      />
    ),
    [room],
  );

  useEffect(() => {
    let countOfOwner = 0;
    room.accesses?.forEach((access) => {
      if (access.role === RoomAccessRole.OWNER) {
        countOfOwner++;
      }
      if (access.user.id === authContext.user?.id) {
        setCurrentUserRole(access.role);
      }
    });
    setNumberOfOwner(countOfOwner);
  }, [room]);

  return (
    <>
      <MagnifyCard
        gapContent="medium"
        title={intl.formatMessage(roomConfigUserMessages.sectionTitle)}
        actions={
          room.is_administrable && (
            <Button color="primary" onClick={addUserModal.openModal} size="small">
              {intl.formatMessage(roomConfigUserMessages.addMember)}
            </Button>
          )
        }
      >
        <MagnifyList rows={room.accesses ?? []} Row={RoomUserAccessRow} />
      </MagnifyCard>

      <UserSearchModal
        {...addUserModal}
        modalUniqueId="add-room-user"
        onSelectUser={onSelectUser}
      />
    </>
  );
};
