import { useQuery, useQueryClient } from '@tanstack/react-query';
import { Box, Notification, Spinner } from 'grommet';
import * as React from 'react';
import { useEffect } from 'react';
import { defineMessages } from 'react-intl';
import { useNavigate, useParams } from 'react-router-dom';
import { RoomConfig, RoomUsersConfig } from '../../../components';
import { DefaultPage } from '../../../components/DefaultPage';
import { BackButton } from '../../../components/design-system/Button/Back/BackButton';
import { useTranslations } from '../../../i18n';
import { commonMessages } from '../../../i18n/commonMessages';
import { RoomsRepository } from '../../../services';
import { RoomAccessRole, User } from '../../../types';
import { MagnifyQueryKeys } from '../../../utils';
import { RoomsPath } from '../../../utils/routes/rooms';

export const roomSettingsMessages = defineMessages({
  roomSettingsTitle: {
    defaultMessage: 'Room settings',
    description: 'Page title for the rooms settings page',
    id: 'view.rooms.settings.roomSettingsTitle',
  },
});

export const RoomSettingsView = () => {
  const intl = useTranslations();
  const { id } = useParams();
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const {
    data: room,
    isLoading,
    error,
  } = useQuery([MagnifyQueryKeys.ROOM, id], () => {
    return RoomsRepository.get(id);
  });

  useEffect(() => {
    if (room && room.accesses == null) {
      navigate(RoomsPath.ROOMS);
    }
  }, [room]);

  const invalidateAllQueries = (): void => {
    if (room) {
      queryClient.invalidateQueries([MagnifyQueryKeys.ROOM, room.slug]);
    }
    queryClient.invalidateQueries([MagnifyQueryKeys.ROOM, id]);
    queryClient.invalidateQueries([MagnifyQueryKeys.ROOM]);
  };

  const addUser = (user: User): void => {
    if (!room) {
      return;
    }
    RoomsRepository.addUser(room.id, RoomAccessRole.MEMBER, user.id).then(() => {
      invalidateAllQueries();
    });
  };

  const updateUser = (role: RoomAccessRole, userId: string, accessId: string): void => {
    if (!room) {
      return;
    }
    RoomsRepository.updateUser(room.id, role, userId, accessId).then(() => {
      invalidateAllQueries();
    });
  };

  const deleteUser = (accessId: string): void => {
    if (!room) {
      return;
    }
    RoomsRepository.deleteUser(accessId).then(() => {
      invalidateAllQueries();
    });
  };

  return (
    <DefaultPage
      enableBreadcrumb={false}
      title={intl.formatMessage(roomSettingsMessages.roomSettingsTitle)}
    >
      <>
        {isLoading && <Spinner />}
        {!isLoading && error && (
          <Notification
            message={intl.formatMessage(commonMessages.requestError)}
            status="critical"
            title={intl.formatMessage(commonMessages.error)}
          />
        )}
        {!isLoading && error == null && room && (
          <Box gap="15px">
            <BackButton />
            <RoomConfig room={room} />
            <Box margin="15px 0">
              <RoomUsersConfig
                addUser={addUser}
                onDeleteUser={deleteUser}
                onUpdateUser={updateUser}
                room={room}
              />
            </Box>
          </Box>
        )}
      </>
    </DefaultPage>
  );
};
