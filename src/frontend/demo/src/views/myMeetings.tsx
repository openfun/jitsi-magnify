import { MagnifyPageContent, MyRooms, useTranslations } from '@jitsi-magnify/core';
import { defineMessages } from 'react-intl';

export const messages = defineMessages({
  meetingsViewTitle: {
    defaultMessage: 'My Rooms',
    description: 'Page title for the My meetings page',
    id: 'app.meetingsViewTitle',
  },
});

export default function MeetingsView() {
  const intl = useTranslations();
  return (
    <MagnifyPageContent title={intl.formatMessage(messages.meetingsViewTitle)}>
      <MyRooms baseJitsiUrl="/j" />
    </MagnifyPageContent>
  );
}
