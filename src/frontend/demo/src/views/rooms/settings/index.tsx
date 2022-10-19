import {
  MagnifyPageContent,
  MagnifyQueryKeys,
  RoomConfig,
  RoomsRepository,
  useTranslations,
} from '@jitsi-magnify/core';
import { useQuery } from '@tanstack/react-query';
import { Spinner } from 'grommet';
import * as React from 'react';
import { defineMessages } from 'react-intl';
import { useParams } from 'react-router-dom';

export const roomSettingsMessages = defineMessages({
  roomSettingsTitle: {
    defaultMessage: 'Room settings',
    description: 'Page title for the rooms settings page',
    id: 'view.rooms.settings.roomSettingsTitle',
  },
});

export function RoomSettingsView() {
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
