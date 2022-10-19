import {
  DeleteAccountBlock,
  IdentityBlock,
  MagnifyPageContent,
  PasswordUpdateBlock,
  useTranslations,
} from '@jitsi-magnify/core';
import * as React from 'react';
import { defineMessages } from 'react-intl';

const messages = defineMessages({
  profileViewTitle: {
    defaultMessage: 'My account',
    description: 'Page title for the profile page',
    id: 'app.profileViewTitle',
  },
});

export function ProfileAccountView() {
  const intl = useTranslations();
  return (
    <MagnifyPageContent title={intl.formatMessage(messages.profileViewTitle)}>
      <IdentityBlock />
      <PasswordUpdateBlock />
      <DeleteAccountBlock />
    </MagnifyPageContent>
  );
}
