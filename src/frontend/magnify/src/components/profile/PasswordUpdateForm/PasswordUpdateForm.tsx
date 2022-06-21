import { Box, Button } from 'grommet';
import React from 'react';
import { defineMessages, useIntl } from 'react-intl';
import useFormState from '../../../hooks/useFormState';
import { validationMessages } from '../../../i18n/Messages';
import { TextField } from '../../design-system';

const messages = defineMessages({
  previousPasswordLabel: {
    defaultMessage: 'Previous password',
    description: 'The label for the previous password field',
    id: 'components.profile.passwordUpdateForm.previousPasswordLabel',
  },
  newPasswordLabel: {
    defaultMessage: 'New password',
    description: 'The label for the new password field',
    id: 'components.profile.passwordUpdateForm.newPasswordLabel',
  },
  confirmNewPasswordLabel: {
    defaultMessage: 'Confirm new password',
    description: 'The label for the confirm new password field',
    id: 'components.profile.passwordUpdateForm.confirmNewPasswordLabel',
  },
  confirmDoesNotMatch: {
    defaultMessage: "New password and it's confirmation do not match",
    description: 'The error message for the confirm new password field',
    id: 'components.profile.passwordUpdateForm.confirmDoesNotMatch',
  },
  submitButtonLabel: {
    defaultMessage: 'Save new password',
    description: 'The label for the submit button on the password update form',
    id: 'components.profile.passwordUpdateForm.submitButtonLabel',
  },
});

export default function PasswordUpdateForm() {
  const intl = useIntl();
  const { values, errors, modified, isModified, isValid, setValue } = useFormState(
    { previousPassword: '', newPassword: '', confirmNewPassword: '' },
    {
      previousPassword: (value: string) => {
        if (!value || value.length < 1) return [intl.formatMessage(validationMessages.required)];
        return [];
      },
      newPassword: (value: string) => {
        if (!value || value.length < 1) return [intl.formatMessage(validationMessages.required)];
        return [];
      },
      confirmNewPassword: (value: string, { newPassword }: { newPassword: string }) => {
        if (!value || value.length < 1) return [intl.formatMessage(validationMessages.required)];
        if (value !== newPassword && newPassword.length > 0)
          return [intl.formatMessage(messages.confirmDoesNotMatch)];
        return [];
      },
    },
  );

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setValue(
      event.target.name as 'previousPassword' | 'newPassword' | 'confirmNewPassword',
      event.target.value,
    );
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    console.log('submit', values);
  };

  return (
    <form onSubmit={handleSubmit}>
      <TextField
        label={intl.formatMessage(messages.previousPasswordLabel)}
        name="previousPassword"
        value={values.previousPassword}
        errors={errors.previousPassword}
        displayErrors={modified.previousPassword}
        onChange={handleChange}
        margin={{ bottom: 'small' }}
        type="password"
        required
      />
      <TextField
        label={intl.formatMessage(messages.newPasswordLabel)}
        name="newPassword"
        value={values.newPassword}
        errors={errors.newPassword}
        displayErrors={modified.newPassword}
        onChange={handleChange}
        margin={{ bottom: 'small' }}
        type="password"
        required
      />
      <TextField
        label={intl.formatMessage(messages.confirmNewPasswordLabel)}
        name="confirmNewPassword"
        value={values.confirmNewPassword}
        errors={errors.confirmNewPassword}
        displayErrors={modified.confirmNewPassword}
        onChange={handleChange}
        margin={{ bottom: 'small' }}
        type="password"
        required
      />
      <Box direction="row" justify="end" margin={{ top: 'small' }}>
        <Button
          primary
          label={intl.formatMessage(messages.submitButtonLabel)}
          disabled={!isModified || !isValid}
          type="submit"
        />
      </Box>
    </form>
  );
}
