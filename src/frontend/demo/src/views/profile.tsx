import {
  DeleteAccountBlock,
  IdentityBlock,
  MagnifyPageContent,
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
    <MagnifyPageContent title={intl.formatMessage(messages.profileViewTitle)}>
      <IdentityBlock />
      <PasswordUpdateBlock />
      <DeleteAccountBlock />
    </MagnifyPageContent>
  );
}
