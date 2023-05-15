import { Button, Heading } from 'grommet';
import * as React from 'react';
import { defineMessages } from 'react-intl';
import { useNavigate } from 'react-router-dom';
import { CustomCard, UserProfilePreferences } from '../../../components';
import { useTranslations } from '../../../i18n';
import { commonMessages } from '../../../i18n/commonMessages';

const messages = defineMessages({
  title: {
    defaultMessage: 'User preferences',
    description: 'The label for the User preferences title',
    id: 'view.users.preferences.title',
  },
});
export const UserPreference = () => {
  const navigate = useNavigate();
  const intl = useTranslations();

  return (
    <>
      <Button
        color={'brand'}
        onClick={() => {
          navigate(-1);
        }}
      >
        {intl.formatMessage(commonMessages.back)}
      </Button>
      <CustomCard>
        <Heading color={'brand'} level={4} margin={'none'}>
          {intl.formatMessage(messages.title)}
        </Heading>
        <UserProfilePreferences />
      </CustomCard>
    </>
  );
};
