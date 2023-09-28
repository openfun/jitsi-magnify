import { Box, Heading } from 'grommet';
import * as React from 'react';
import { defineMessages } from 'react-intl';
import { CustomCard, UserProfilePreferences } from '../../../components';
import { BackButton } from '../../../components/design-system/Button/Back/BackButton';
import { useTranslations } from '../../../i18n';

const messages = defineMessages({
  title: {
    defaultMessage: 'User preferences',
    description: 'The label for the User preferences title',
    id: 'view.users.preferences.title',
  },
});
export const UserPreference = () => {
  const intl = useTranslations();

  return (
    <Box gap="small">
      <div>
        <BackButton />
      </div>
      <CustomCard>
        <Heading color="brand" level={4} margin="none">
          {intl.formatMessage(messages.title)}
        </Heading>
        <UserProfilePreferences />
      </CustomCard>
    </Box>
  );
};
