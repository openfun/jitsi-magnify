import {
  MagnifyPageContent,
  ResponsiveLayout,
  RoomOverview,
  useTranslations,
} from '@jitsi-magnify/core';
import { defineMessages } from 'react-intl';
import { Navigate, useParams } from 'react-router-dom';

export const messages = defineMessages({
  roomViewTitle: {
    defaultMessage: 'Room « {roomName} »',
    description: 'Page title for the room view',
    id: 'app.roomViewTitle',
  },
});

export default function RoomView() {
  const { slug } = useParams();
  const intl = useTranslations();

  if (!slug) {
    return <Navigate to="/rooms" />;
  }

  return (
    <ResponsiveLayout>
      <MagnifyPageContent title={intl.formatMessage(messages.roomViewTitle, { roomName: slug })}>
        <RoomOverview baseJitsiUrl="/j" roomSlug={slug} />
      </MagnifyPageContent>
    </ResponsiveLayout>
  );
}
