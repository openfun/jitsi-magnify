import {
  DeleteAccountBlock,
  IdentityBlock,
  PasswordUpdateBlock,
  useTranslations,
} from '@openfun/magnify-components';
import * as React from 'react';
import { defineMessages } from 'react-intl';
import { DefaultPage } from '../../../components/DefaultPage';

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
    <DefaultPage title={intl.formatMessage(messages.profileViewTitle)}>
      <IdentityBlock />
      <PasswordUpdateBlock />
      <DeleteAccountBlock />
    </DefaultPage>
  );
}
