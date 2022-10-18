import { defineMessages } from '@formatjs/intl';
import { useMutation, useQueryClient } from '@tanstack/react-query';

import { Box, Button, ButtonExtendedProps, Card, Menu, Notification, Spinner, Text } from 'grommet';
import { Configure, FormTrash, MoreVertical } from 'grommet-icons';
import React from 'react';
import { useIntl } from 'react-intl';

import { useModal } from '../../../context/modals';
import { useRouting } from '../../../context/routing';
import { useIsSmallSize } from '../../../hooks/useIsMobile';

import { commonMessages } from '../../../i18n/Messages/commonMessages';
import { RoomsRepository } from '../../../services/rooms/rooms.repository';
import { Room } from '../../../types/entities/room';
import { MagnifyQueryKeys } from '../../../utils/constants/react-query';
import { MagnifyModalTypes } from '../../design-system/Modal';
import { MagnifyMeeting } from '../../jitsi';

export interface RoomRowProps {
  /**
   * The room to display
   */
  room: Room;
  /**
   * The base path to the jitsi page to redirect on join
   * The room id will be appended to this path
   */
  baseJitsiUrl: string;
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
});

export default function RoomRow({ room, baseJitsiUrl }: RoomRowProps) {
  const intl = useIntl();
  const routing = useRouting();

  const isSmallSize = useIsSmallSize();
  const modals = useModal();
  const queryClient = useQueryClient();

  const { mutate, isLoading } = useMutation(
    async (roomId: string) => {
      return await RoomsRepository.delete(roomId);
    },
    {
      onSuccess: (newRoom) => {
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
      children: (
        <Notification message={intl.formatMessage(messages.warningDelete)} status={'info'} />
      ),
    });
  };

  const openJitsiMeetingModal = () => {
    modals.showModal({
      modalUniqueId: 'jitsiMeetingModal',
      showFooter: false,
      full: true,
      children: (
        <MagnifyMeeting
          configuration={room.configuration}
          jitsiDomain={'meeting.education'}
          jwt={room.jitsi?.token}
          roomName={room.jitsi?.room ?? `${room.name}-${room.id}`}
        />
      ),
    });
  };

  const getMoreActionsItems = (): ButtonExtendedProps[] => {
    const result: ButtonExtendedProps[] = [];

    if (room.is_administrable) {
      result.push({
        icon: (
          <Box alignSelf={'center'}>
            <Configure size={'14px'} />
          </Box>
        ),
        label: (
          <Box alignSelf={'center'} margin={{ left: 'xsmall' }}>
            {intl.formatMessage(commonMessages.settings)}
          </Box>
        ),
        onClick: () => routing.goToRoomSettings(room.id),
      });
    }

    result.push({
      icon: <FormTrash />,
      label: (
        <Box alignSelf={'center'} margin={{ left: 'xsmall' }}>
          {intl.formatMessage(commonMessages.delete)}
        </Box>
      ),
      onClick: openDeleteModal,
    });
    return result;
  };

  return (
    <Card background="light-2" elevation="0" pad="small" style={{ position: 'relative' }}>
      {isLoading && (
        <Box
          align={'center'}
          background={'#ffffff8c'}
          justify={'center'}
          style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }}
        >
          <Spinner />
        </Box>
      )}
      <Box
        align={'center'}
        direction={isSmallSize ? 'column' : 'row'}
        gap={'20px'}
        justify={isSmallSize ? 'center' : 'between'}
      >
        <Box direction="row" gap="small" margin="auto 0px">
          <Box margin="auto 0px">
            <Text color="brand" size="medium" truncate={'tip'} weight="bold">
              {room.name}
            </Text>
          </Box>
        </Box>

        <Box align={'center'} direction="row">
          <Button
            primary
            label={intl.formatMessage(messages.join)}
            margin={{ left: 'small' }}
            onClick={() => openJitsiMeetingModal()}
          />
          <Menu
            dropProps={{ align: { top: 'bottom', left: 'left' } }}
            icon={<MoreVertical size={'medium'} />}
            items={getMoreActionsItems()}
            justifyContent={'center'}
          />
        </Box>
      </Box>
    </Card>
  );
}
