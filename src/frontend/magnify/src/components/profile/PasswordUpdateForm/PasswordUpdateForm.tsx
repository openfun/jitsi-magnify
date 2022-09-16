import { Box, Button } from 'grommet';
import React from 'react';
import { defineMessages, useIntl } from 'react-intl';
import { useMutation } from 'react-query';
import { useController } from '../../../controller';
import useFormState from '../../../hooks/useFormState';
import validators, { passwordConfirmValidator, requiredValidator } from '../../../utils/validators';
import { TextField } from '../../design-system';

const messages = defineMessages({
  previousPasswordLabel: {
    defaultMessage: 'Previous password',
    description: 'The label for the previous password field',
    id: 'components.profile.passwordUpdateForm.previousPasswordLabel',
  },
  passwordLabel: {
    defaultMessage: 'New password',
    description: 'The label for the new password field',
    id: 'components.profile.passwordUpdateForm.passwordLabel',
  },
  confirmNewPasswordLabel: {
    defaultMessage: 'Confirm new password',
    description: 'The label for the confirm new password field',
    id: 'components.profile.passwordUpdateForm.confirmNewPasswordLabel',
  },
  submitButtonLabel: {
    defaultMessage: 'Save new password',
    description: 'The label for the submit button on the password update form',
    id: 'components.profile.passwordUpdateForm.submitButtonLabel',
  },
});

export default function PasswordUpdateForm() {
  const intl = useIntl();
  const controller = useController();
  const { mutate } = useMutation(controller.updateUserPassword);
  const { values, errors, modified, isModified, isValid, setValue } = useFormState(
    { previousPassword: '', password: '', confirmPassword: '' },
    {
      previousPassword: validators(intl, requiredValidator),
      password: validators(intl, requiredValidator),
      confirmPassword: validators(intl, requiredValidator, passwordConfirmValidator),
    },
  );

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setValue(
      event.target.name as 'previousPassword' | 'password' | 'confirmPassword',
      event.target.value,
    );
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    mutate({ oldPassword: values.previousPassword, newPassword: values.password });
  };

  return (
    <form onSubmit={handleSubmit}>
      <TextField
        required
        displayErrors={modified.previousPassword}
        errors={errors.previousPassword}
        label={intl.formatMessage(messages.previousPasswordLabel)}
        margin={{ bottom: 'small' }}
        name="previousPassword"
        onChange={handleChange}
        type="password"
        value={values.previousPassword}
      />
      <TextField
        required
        displayErrors={modified.password}
        errors={errors.password}
        label={intl.formatMessage(messages.passwordLabel)}
        margin={{ bottom: 'small' }}
        name="password"
        onChange={handleChange}
        type="password"
        value={values.password}
      />
      <TextField
        required
        displayErrors={modified.confirmPassword}
        errors={errors.confirmPassword}
        label={intl.formatMessage(messages.confirmNewPasswordLabel)}
        margin={{ bottom: 'small' }}
        name="confirmPassword"
        onChange={handleChange}
        type="password"
        value={values.confirmPassword}
      />
      <Box direction="row" justify="end" margin={{ top: 'small' }}>
        <Button
          primary
          disabled={!isModified || !isValid}
          label={intl.formatMessage(messages.submitButtonLabel)}
          type="submit"
        />
      </Box>
    </form>
  );
}
