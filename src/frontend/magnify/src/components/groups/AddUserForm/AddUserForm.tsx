import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Box, Button, Heading } from 'grommet';
import React from 'react';
import { defineMessages, useIntl } from 'react-intl';
import { useController } from '../../../controller';
import useFormState from '../../../hooks/useFormState';
import validators, { emailValidator, requiredValidator } from '../../../utils/validators';
import { LoadingButton, TextField } from '../../design-system';

export interface AddUserFormProps {
  onSuccess?: () => void;
  onCancel?: () => void;
  groupId: string;
}

const messages = defineMessages({
  email: {
    id: 'components.groups.AddUserForm.email',
    defaultMessage: 'Email',
    description: 'Email label',
  },
  addUserHeading: {
    id: 'components.groups.AddUserForm.addUserHeading',
    defaultMessage: 'Add user to group',
    description: 'Add user heading',
  },
  addUserSubmitLabel: {
    id: 'components.groups.AddUserForm.addUserSubmitLabel',
    defaultMessage: 'Add user',
    description: 'Add user button label',
  },
  cancel: {
    id: 'components.groups.AddUserForm.cancel',
    defaultMessage: 'Cancel',
    description: 'Cancel button label',
  },
});

const AddUserForm = ({ onSuccess, onCancel, groupId }: AddUserFormProps) => {
  const intl = useIntl();
  const controller = useController();
  const queryClient = useQueryClient();
  const { mutate, isLoading } = useMutation(controller.addUserToGroup, {
    onSuccess: (data) => {
      queryClient.setQueryData(['group', groupId], () => data);
      onSuccess?.();
    },
  });

  const { values, setValue, errors, modified, isModified, isValid } = useFormState(
    { email: '' },
    { email: validators(intl, requiredValidator, emailValidator) },
  );

  return (
    <>
      <Heading level={3}>{intl.formatMessage(messages.addUserHeading)}</Heading>
      <TextField
        displayErrors={modified.email}
        errors={errors.email}
        label={intl.formatMessage(messages.email)}
        name="email"
        value={values.email}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
          setValue('email', e.currentTarget.value)
        }
      />
      <Box direction="row" gap="small" justify="end" margin={{ top: 'medium' }}>
        <Button label={intl.formatMessage(messages.cancel)} onClick={onCancel} />
        <LoadingButton
          primary
          disabled={!isModified || !isValid}
          isLoading={isLoading}
          label={intl.formatMessage(messages.addUserSubmitLabel)}
          onClick={() => mutate({ groupId, userEmail: values.email })}
        />
      </Box>
    </>
  );
};

export default AddUserForm;
