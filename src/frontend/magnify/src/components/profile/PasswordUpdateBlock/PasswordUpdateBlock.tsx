import React from 'react';
import { Box, Card, Grid, Heading, Text } from 'grommet';
import PasswordUpdateForm from '../PasswordUpdateForm';
import { defineMessages, useIntl } from 'react-intl';
import { MarginType } from 'grommet/utils';

export interface PasswordUpdateBlockProps {
  margin?: MarginType;
}

const messages = defineMessages({
  updatePasswordBlockTitle: {
    defaultMessage: 'Update password',
    description: 'The title of the password update block',
    id: 'components.profile.passwordUpdateBlock.title',
  },
  updatePasswordBlockDescription: {
    defaultMessage: `Your password is used to authenticate your account and 
        to protect your data. To make it stronger, choose a password with more 
        than 8 characters, including a mix of letters, numbers and symbols.`,
    description: 'The description of the password update block',
    id: 'components.profile.passwordUpdateBlock.description',
  },
});

export default function PasswordUpdateBlock({
  margin = { vertical: 'small' },
}: PasswordUpdateBlockProps) {
  const intl = useIntl();
  return (
    <Card background="white" margin={margin}>
      <Box margin="small" direction="row">
        <Grid
          columns={['flex', 'flex']}
          rows={['flex']}
          areas={[
            { name: 'header', start: [0, 0], end: [0, 0] },
            { name: 'body', start: [1, 0], end: [1, 0] },
          ]}
          gap="small"
        >
          <Box gridArea="header" margin="large">
            <Heading color="brand" level={3}>
              {intl.formatMessage(messages.updatePasswordBlockTitle)}
            </Heading>
            <Text>{intl.formatMessage(messages.updatePasswordBlockDescription)}</Text>
          </Box>

          <Box gridArea="body" margin="large">
            <PasswordUpdateForm />
          </Box>
        </Grid>
      </Box>
    </Card>
  );
}
