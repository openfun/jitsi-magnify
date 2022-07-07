import { LayoutWithSidebar, RoomConfig, useTranslations } from '@jitsi-magnify/core';
import { defineMessages } from 'react-intl';
import { Navigate, useParams } from 'react-router-dom';

export const messages = defineMessages({
  roomSettingsTitle: {
    id: 'app.roomSettingsTitle',
    description: 'H1 page title for the room settings view',
    defaultMessage: 'Room Settings',
  },
});

export default function RoomSettingsView() {
  const intl = useTranslations();
  const { slug } = useParams();

  if (!slug) return <Navigate to="/room-not-found" replace />;

  return (
    <LayoutWithSidebar title={intl.formatMessage(messages.roomSettingsTitle)}>
      <RoomConfig roomName={slug} />
    </LayoutWithSidebar>
  );
}
