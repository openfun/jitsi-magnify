import {
  DeleteAccountBlock,
  IdentityBlock,
  LayoutWithSidebar,
  PasswordUpdateBlock,
  useTranslations,
} from '@jitsi-magnify/core';
import { defineMessages } from 'react-intl';

export const messages = defineMessages({
  profileViewTitle: {
    defaultMessage: 'My account',
    description: 'Page title for the profile page',
    id: 'app.profileViewTitle',
  },
});

export default function ProfileView() {
  const intl = useTranslations();
  return (
    <LayoutWithSidebar title={intl.formatMessage(messages.profileViewTitle)}>
      <IdentityBlock />
      <PasswordUpdateBlock />
      <DeleteAccountBlock />
    </LayoutWithSidebar>
  );
}
