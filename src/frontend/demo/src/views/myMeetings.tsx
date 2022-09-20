import { LayoutWithSidebar, MyMeetings, useTranslations } from '@jitsi-magnify/core';
import { defineMessages } from 'react-intl';

export const messages = defineMessages({
  meetingsViewTitle: {
    defaultMessage: 'My meetings',
    description: 'Page title for the My meetings page',
    id: 'app.meetingsViewTitle',
  },
});

export default function MeetingsView() {
  const intl = useTranslations();
  return (
    <LayoutWithSidebar title={intl.formatMessage(messages.meetingsViewTitle)}>
      <MyMeetings baseJitsiUrl="/jitsi" />
    </LayoutWithSidebar>
  );
}
