import { Box, Button, Card, Heading, Layer, Text } from 'grommet';
import { MarginType } from 'grommet/utils';
import React, { useState } from 'react';
import { defineMessages, useIntl } from 'react-intl';

export interface DeleteAccountBlockProps {
  /**
   * Additional margins
   */
  margin?: MarginType;
}

const messages = defineMessages({
  deleteAccountBlockTitle: {
    defaultMessage: 'Delete account',
    description: 'The title of the delete account block',
    id: 'components.profile.deleteAccountBlock.title',
  },
  deleteAccountBlockDescription: {
    defaultMessage: `You can delete your account. This will delete all your data and
        your account will be removed from the system. Note that this action cannot be undone.`,
    description: 'The description of the delete account block',
    id: 'components.profile.deleteAccountBlock.description',
  },
  dangerZone: {
    defaultMessage: 'Danger zone',
    description: '"Danger zone" indication',
    id: 'components.profile.deleteAccountBlock.dangerZone',
  },
  deleteAccountButtonLabel: {
    defaultMessage: 'Delete account',
    description: 'The label of the delete account button',
    id: 'components.profile.deleteAccountBlock.deleteAccountButtonLabel',
  },
  confirmationWarning: {
    defaultMessage: 'Are you sure you want to delete your account?',
    description: 'The warning message before deleting the account',
    id: 'components.profile.deleteAccountBlock.confirmationWarning',
  },
  cancelButtonLabel: {
    defaultMessage: 'Cancel',
    description: 'The label of the cancel button',
    id: 'components.profile.deleteAccountBlock.cancelButtonLabel',
  },
  confirmationHeader: {
    defaultMessage: 'Confirm',
    description: 'The header of the confirmation layer',
    id: 'components.profile.deleteAccountBlock.confirmationHeader',
  },
  confirmDeleteAccountButtonLabel: {
    defaultMessage: 'Confirm delete account',
    description: 'The label of the confirm delete account button',
    id: 'components.profile.deleteAccountBlock.confirmDeleteAccountButtonLabel',
  },
});

export const DeleteAccountBlock = ({ margin = { vertical: 'small' } }: DeleteAccountBlockProps) => {
  const intl = useIntl();
  const [open, setOpen] = useState(false);

  const handleClose = () => setOpen(false);
  const handleOpen = () => setOpen(true);

  const handleDelete = () => {
    setOpen(false);
  };

  return (
    <>
      <Card background={'white'} margin={margin}>
        <Box margin="small">
          <Box margin="large">
            <Text color="status-error" style={{ textTransform: 'uppercase' }} weight="bold">
              {intl.formatMessage(messages.dangerZone)}
            </Text>
            <Heading color="brand" level={3}>
              {intl.formatMessage(messages.deleteAccountBlockTitle)}
            </Heading>
            <Text>{intl.formatMessage(messages.deleteAccountBlockDescription)}</Text>
          </Box>
          <Box direction="row" margin={{ bottom: 'large', horizontal: 'large' }}>
            <Button
              primary
              color="status-error"
              label={intl.formatMessage(messages.deleteAccountButtonLabel)}
              onClick={handleOpen}
              role="button"
            />
          </Box>
        </Box>
      </Card>
      {open && (
        <Layer
          id="confirmDelete"
          onClickOutside={handleClose}
          onEsc={handleClose}
          position="center"
        >
          <Box gap="small" pad="medium" width="large">
            <Heading level={3} margin="none">
              {intl.formatMessage(messages.confirmationHeader)}
            </Heading>
            <Text>{intl.formatMessage(messages.confirmationWarning)}</Text>
            <Box
              align="center"
              as="footer"
              direction="row"
              gap="small"
              justify="end"
              pad={{ top: 'medium', bottom: 'small' }}
            >
              <Button
                color="dark-3"
                label={intl.formatMessage(messages.cancelButtonLabel)}
                onClick={handleClose}
                role="button"
              />
              <Button
                primary
                color="status-critical"
                label={intl.formatMessage(messages.confirmDeleteAccountButtonLabel)}
                onClick={handleDelete}
                role="button"
              />
            </Box>
          </Box>
        </Layer>
      )}
    </>
  );
};
