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
    id: 'app.profileViewTitle',
    description: 'Page title for the profile page',
    defaultMessage: 'My account',
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
