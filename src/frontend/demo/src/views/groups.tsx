import { MyGroupsBlock, LayoutWithSidebar, useTranslations } from '@jitsi-magnify/core';
import { defineMessages } from 'react-intl';

export const messages = defineMessages({
  groupsViewTitle: {
    id: 'app.groupsViewTitle',
    description: 'H1 page title for the test',
    defaultMessage: 'My Groups',
  },
});

export default function GroupsView() {
  const intl = useTranslations();
  return (
    <LayoutWithSidebar title={intl.formatMessage(messages.groupsViewTitle)}>
      <MyGroupsBlock />
    </LayoutWithSidebar>
  );
}
