import { LayoutWithSidebar, RoomOverview, useTranslations } from '@jitsi-magnify/core';
import { defineMessages } from 'react-intl';
import { Navigate, useParams } from 'react-router-dom';

export const messages = defineMessages({
  roomViewTitle: {
    id: 'app.roomViewTitle',
    description: 'Page title for the room view',
    defaultMessage: 'Room « {roomName} »',
  },
});

export default function RoomView() {
  const { slug } = useParams();
  const intl = useTranslations();

  if (!slug) {
    return <Navigate to="/rooms" />;
  }

  return (
    <LayoutWithSidebar title={intl.formatMessage(messages.roomViewTitle, { roomName: slug })}>
      <RoomOverview baseJitsiUrl="/jitsi" roomSlug={slug} />
    </LayoutWithSidebar>
  );
}
