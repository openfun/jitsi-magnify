import { useQuery } from '@tanstack/react-query';
import { Spinner } from 'grommet';
import * as React from 'react';
import { defineMessages } from 'react-intl';
import { useParams } from 'react-router-dom';
import { MagnifyPageContent, RoomConfig } from '../../../components';
import { useTranslations } from '../../../i18n';
import { RoomsRepository } from '../../../services/rooms/rooms.repository';
import { MagnifyQueryKeys } from '../../../utils/constants/react-query';

export const roomSettingsMessages = defineMessages({
  roomSettingsTitle: {
    defaultMessage: 'Room settings',
    description: 'Page title for the rooms settings page',
    id: 'view.rooms.settings.roomSettingsTitle',
  },
});

export interface RoomSettingsViewProps {}

export function RoomSettingsView({ ...props }: RoomSettingsViewProps) {
  const intl = useTranslations();
  const { id } = useParams();

  const { data: room, isLoading } = useQuery([MagnifyQueryKeys.ROOM, id], () => {
    return RoomsRepository.get(id);
  });

  return (
    <MagnifyPageContent title={intl.formatMessage(roomSettingsMessages.roomSettingsTitle)}>
      {isLoading && <Spinner />}
      {!isLoading && room && <RoomConfig room={room} />}
    </MagnifyPageContent>
  );
}
