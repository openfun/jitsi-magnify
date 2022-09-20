import { LayoutWithSidebar, RoomConfig, useTranslations } from '@jitsi-magnify/core';
import { defineMessages } from 'react-intl';
import { Navigate, useParams } from 'react-router-dom';

export const messages = defineMessages({
  roomSettingsTitle: {
    defaultMessage: 'Room Settings',
    description: 'H1 page title for the room settings view',
    id: 'app.roomSettingsTitle',
  },
});

export default function RoomSettingsView() {
  const intl = useTranslations();
  const { slug } = useParams();

  if (!slug) return <Navigate replace to="/room-not-found" />;

  return (
    <LayoutWithSidebar title={intl.formatMessage(messages.roomSettingsTitle)}>
      <RoomConfig roomName={slug} />
    </LayoutWithSidebar>
  );
}
