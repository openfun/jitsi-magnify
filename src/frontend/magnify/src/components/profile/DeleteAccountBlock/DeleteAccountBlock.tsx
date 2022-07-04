import React, { useState } from 'react';
import { Box, Button, Card, Heading, Layer, Text } from 'grommet';
import { defineMessages, useIntl } from 'react-intl';
import { MarginType } from 'grommet/utils';
import { useController, useStore } from '../../../controller';
import { useMutation } from 'react-query';

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

export default function DeleteAccountBlock({
  margin = { vertical: 'small' },
}: DeleteAccountBlockProps) {
  const intl = useIntl();
  const { user } = useStore();
  const controller = useController();
  const { mutate } = useMutation(controller.deleteUser);
  const [open, setOpen] = useState(false);

  const handleClose = () => setOpen(false);
  const handleOpen = () => setOpen(true);

  const handleDelete = () => {
    if (user) mutate(user.id);
    setOpen(false);
  };

  return (
    <>
      <Card background="white" margin={margin}>
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
          <Box margin={{ bottom: 'large', horizontal: 'large' }} direction="row">
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
          position="center"
          onClickOutside={handleClose}
          onEsc={handleClose}
        >
          <Box pad="medium" gap="small" width="medium">
            <Heading level={3} margin="none">
              {intl.formatMessage(messages.confirmationHeader)}
            </Heading>
            <Text>{intl.formatMessage(messages.confirmationWarning)}</Text>
            <Box
              as="footer"
              gap="small"
              direction="row"
              align="center"
              justify="end"
              pad={{ top: 'medium', bottom: 'small' }}
            >
              <Button
                label={intl.formatMessage(messages.cancelButtonLabel)}
                onClick={handleClose}
                color="dark-3"
                role="button"
              />
              <Button
                label={intl.formatMessage(messages.confirmDeleteAccountButtonLabel)}
                onClick={handleDelete}
                primary
                color="status-critical"
                role="button"
              />
            </Box>
          </Box>
        </Layer>
      )}
    </>
  );
}
