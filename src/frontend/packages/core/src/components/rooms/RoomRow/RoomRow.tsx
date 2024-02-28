import { Button } from '@openfun/cunningham-react';
import { useMutation, useQueryClient } from '@tanstack/react-query';

import { Box, ButtonExtendedProps, Card, Menu, Notification, Spinner, Text } from 'grommet';
import { Clone, Configure, FormTrash, MoreVertical } from 'grommet-icons';

import React from 'react';
import { useIntl, defineMessages } from 'react-intl';

import { useNotification } from '../../../context';
import { useModal } from '../../../context/modals';
import { useRouting } from '../../../context/routing';
import { useIsSmallSize } from '../../../hooks/useIsMobile';

import { commonMessages } from '../../../i18n/Messages/commonMessages';
import { RoomsRepository } from '../../../services/rooms/rooms.repository';
import { Room } from '../../../types/entities/room';
import { MagnifyQueryKeys } from '../../../utils/constants/react-query';
import { MagnifyModalTypes } from '../../design-system/Modal';

export interface RoomRowProps {
  /**
   * The room to display
   */
  room: Room;
}

const messages = defineMessages({
  admin: {
    id: 'components.rooms.RoomRow.admin',
    defaultMessage: 'Admin',
    description: 'Indicates that the user is an admin of the room',
  },
  join: {
    id: 'components.rooms.RoomRow.join',
    defaultMessage: 'Join',
    description: 'Join the room',
  },
  warningDelete: {
    id: 'components.rooms.RoomRow.warningDelete',
    defaultMessage:
      'Are you sure you want to delete this room? Another user can therefore book this room',
    description: 'Waning message for a delete action',
  },
  deleteModalTitle: {
    id: 'components.rooms.RoomRow.deleteModalTitle',
    defaultMessage: 'Deleting a room',
    description: 'Title modal for delete action',
  },
  copyRoomLink: {
    id: 'components.rooms.RoomRow.copyRoomLink',
    defaultMessage: 'Copy link',
    description: 'Copy room link to the clipboard',
  },
  roomLinkWasCopied: {
    id: 'components.rooms.RoomRow.roomLinkWasCopied',
    defaultMessage: 'Room link copied to clipboard!',
    description: 'The link of the room was successfully copied',
  },
});

export const RoomRow = ({ room }: RoomRowProps) => {
  const intl = useIntl();
  const routing = useRouting();

  const isSmallSize = useIsSmallSize();
  const modals = useModal();
  const queryClient = useQueryClient();

  const notification = useNotification();

  const { mutate, isLoading } = useMutation(
    async (roomId: string) => {
      return RoomsRepository.delete(roomId);
    },
    {
      onSuccess: () => {
        queryClient.setQueryData([MagnifyQueryKeys.ROOMS], (rooms: Room[] = []) => {
          const newRooms = [...rooms];
          const index = newRooms.findIndex((roomItem) => {
            return roomItem.id === room.id;
          });

          if (index >= 0) {
            newRooms.splice(index, 1);
          }
          return newRooms;
        });
      },
    },
  );

  const openDeleteModal = () => {
    modals.showModal({
      modalUniqueId: 'deleteRoomModal',
      type: MagnifyModalTypes.WARNING,
      validateButtonColor: 'accent-1',
      validateButtonCallback: () => mutate(room.id),
      validateButtonLabel: intl.formatMessage(commonMessages.delete),
      titleModal: intl.formatMessage(messages.deleteModalTitle),
      children: <Notification message={intl.formatMessage(messages.warningDelete)} status="info" />,
    });
  };

  const copyLinkToClipboard = (): void => {
    navigator.clipboard.writeText(window.location.origin + '/' + room.slug).then(
      () => {
        notification.showNotification({
          status: 'info',
          title: intl.formatMessage(messages.roomLinkWasCopied),
        });
      },
      () => {},
    );
  };

  const getMoreActionsItems = (): ButtonExtendedProps[] => {
    let result: ButtonExtendedProps[] = [
      {
        icon: (
          <Box alignSelf="center">
            <Configure size="14px" />
          </Box>
        ),
        label: (
          <Box alignSelf="center" margin={{ left: 'xsmall' }}>
            {intl.formatMessage(commonMessages.settings)}
          </Box>
        ),
        onClick: () => routing.goToRoomSettings(room.id),
      },
      {
        icon: (
          <Box alignSelf="center">
            <Clone size="small" />
          </Box>
        ),
        label: (
          <Box alignSelf="center" margin={{ left: 'xsmall' }}>
            {intl.formatMessage(messages.copyRoomLink)}
          </Box>
        ),
        onClick: copyLinkToClipboard,
      },
    ];

    if (room.is_administrable) {
      const settingsButtonProps: ButtonExtendedProps = {
        icon: <FormTrash />,
        label: (
          <Box alignSelf="center" margin={{ left: 'xsmall' }}>
            {intl.formatMessage(commonMessages.delete)}
          </Box>
        ),
        onClick: openDeleteModal,
      };
      result = result.concat([settingsButtonProps]);
    }

    return result;
  };

  return (
    <Card background="light-2" elevation="0" pad="xsmall" style={{ position: 'relative' }}>
      {isLoading && (
        <Box
          align="center"
          background="#ffffff8c"
          justify="center"
          style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }}
        >
          <Spinner />
        </Box>
      )}
      <Box
        align="center"
        direction={isSmallSize ? 'column' : 'row'}
        gap="20px"
        justify={isSmallSize ? 'center' : 'between'}
      >
        <Box direction="row" gap="small" margin="auto 0px">
          <Box margin="auto 0px">
            <Text color="brand" size="medium" truncate="tip" weight="bold">
              {room.name}
            </Text>
          </Box>
        </Box>

        <Box align="center" direction="row">
          <Box margin={{ left: 'small' }} />
          <Button color="primary" onClick={() => routing.goToLiveKitRoom(room.slug)} size="small">
            {intl.formatMessage(messages.join)}
          </Button>
          <Menu
            dropProps={{ stretch: false, align: { top: 'bottom', right: 'right' } }}
            icon={<MoreVertical size="medium" />}
            items={getMoreActionsItems()}
            justifyContent="center"
          />
        </Box>
      </Box>
    </Card>
  );
};
