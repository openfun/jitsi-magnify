import { LayoutWithSidebar, MyMeetings, useTranslations } from '@jitsi-magnify/core';
import { defineMessages } from 'react-intl';

export const messages = defineMessages({
  meetingsViewTitle: {
    id: 'app.meetingsViewTitle',
    description: 'Page title for the My meetings page',
    defaultMessage: 'My meetings',
  },
});

export default function MeetingsView() {
  const intl = useTranslations();
  return (
    <LayoutWithSidebar title={intl.formatMessage(messages.meetingsViewTitle)}>
      <MyMeetings baseJitsiUrl="/j" />
    </LayoutWithSidebar>
  );
}
