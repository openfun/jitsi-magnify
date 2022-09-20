import { LayoutWithSidebar, MyRooms, useTranslations } from '@jitsi-magnify/core';
import { defineMessages } from 'react-intl';

export const messages = defineMessages({
  roomsViewTitle: {
    defaultMessage: 'My rooms',
    description: 'Page title for the My rooms page',
    id: 'app.roomsViewTitle',
  },
});

export default function RoomsView() {
  const intl = useTranslations();
  return (
    <LayoutWithSidebar title={intl.formatMessage(messages.roomsViewTitle)}>
      <MyRooms baseJitsiUrl="/j" />
    </LayoutWithSidebar>
  );
}
