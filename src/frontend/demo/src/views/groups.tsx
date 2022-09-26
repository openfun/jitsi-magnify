import {
  MagnifyPageContent,
  MyGroupsBlock,
  ResponsiveLayout,
  useTranslations,
} from '@jitsi-magnify/core';
import { defineMessages } from 'react-intl';

export const messages = defineMessages({
  groupsViewTitle: {
    defaultMessage: 'My Groups',
    description: 'Page title for the My Groups page',
    id: 'app.groupsViewTitle',
  },
});

export default function GroupsView() {
  const intl = useTranslations();
  return (
    <ResponsiveLayout>
      <MagnifyPageContent title={intl.formatMessage(messages.groupsViewTitle)}>
        <MyGroupsBlock />
      </MagnifyPageContent>
    </ResponsiveLayout>
  );
}
