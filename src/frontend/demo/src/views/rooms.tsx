import { LayoutWithSidebar, MyRooms, useTranslations } from '@jitsi-magnify/core';
import { defineMessages } from 'react-intl';

export const messages = defineMessages({
  roomsViewTitle: {
    id: 'app.roomsViewTitle',
    description: 'H1 page title for the test',
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
