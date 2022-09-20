import { LayoutWithSidebar, useTranslations, GroupUserList } from '@jitsi-magnify/core';
import { defineMessages } from 'react-intl';
import { useParams } from 'react-router-dom';

export const messages = defineMessages({
  groupViewTitle: {
    defaultMessage: 'Group',
    description: 'Page title for the My Group page',
    id: 'app.groupViewTitle',
  },
});

export default function GroupView() {
  const intl = useTranslations();
  const { groupId } = useParams();

  if (!groupId) return null;
  return (
    <LayoutWithSidebar title={intl.formatMessage(messages.groupViewTitle)}>
      <GroupUserList groupId={groupId} />
    </LayoutWithSidebar>
  );
}
