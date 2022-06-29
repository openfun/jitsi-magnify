import { Box, Button } from 'grommet';
import React from 'react';
import { defineMessages, useIntl } from 'react-intl';
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
        label={intl.formatMessage(messages.passwordLabel)}
        name="password"
        value={values.password}
        errors={errors.password}
        displayErrors={modified.password}
        onChange={handleChange}
        margin={{ bottom: 'small' }}
        type="password"
        required
      />
      <TextField
        label={intl.formatMessage(messages.confirmNewPasswordLabel)}
        name="confirmPassword"
        value={values.confirmPassword}
        errors={errors.confirmPassword}
        displayErrors={modified.confirmPassword}
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
