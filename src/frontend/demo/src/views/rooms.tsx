import { LayoutWithSidebar, MyRooms, useTranslations } from '@jitsi-magnify/core';
import { defineMessages } from 'react-intl';

export const messages = defineMessages({
  roomsViewTitle: {
    id: 'app.roomsViewTitle',
    description: 'Page title for the My rooms page',
    defaultMessage: 'My rooms',
  },
});

export default function RoomsView() {
  const intl = useTranslations();
  return (
    <LayoutWithSidebar title={intl.formatMessage(messages.roomsViewTitle)}>
      <MyRooms baseJitsiUrl="/jitsi" />
    </LayoutWithSidebar>
  );
}
