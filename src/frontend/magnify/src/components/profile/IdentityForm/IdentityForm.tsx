import { Box, Button } from 'grommet';
import React from 'react';
import TextField from '../../design-system/TextField';
import validator from 'validator';
import { defineMessages, useIntl } from 'react-intl';
import useFormState from '../../../hooks/useFormState';
import { validationMessages } from '../../../i18n/Messages';

export interface IdentityFormProps {
  name: string;
  username: string;
  email: string;
}

const messages = defineMessages({
  nameLabel: {
    defaultMessage: 'Name',
    description: 'The label for the name field',
    id: 'components.profile.identityForm.nameLabel',
  },
  usernameLabel: {
    defaultMessage: 'Username',
    description: 'The label for the username field',
    id: 'components.profile.identityForm.usernameLabel',
  },
  usernameInvalid: {
    defaultMessage:
      'Username is invalid, it should have between 3 and 16 letters, numbers or underscores',
    description: 'The error message for the username field',
    id: 'components.profile.identityForm.usernameInvalid',
  },
  emailLabel: {
    defaultMessage: 'Email',
    description: 'The label for the email field',
    id: 'components.profile.identityForm.emailLabel',
  },
  emailInvalid: {
    defaultMessage: 'Email is invalid',
    description: 'The error message for the email field',
    id: 'components.profile.identityForm.emailInvalid',
  },
  submitButtonLabel: {
    defaultMessage: 'Save',
    description: 'The label for the submit button',
    id: 'components.profile.identityForm.submitButtonLabel',
  },
});

export default function IdentityForm({ name, username, email }: IdentityFormProps) {
  const intl = useIntl();

  const { values, errors, modified, setValue, isValid, isModified } = useFormState(
    { name, username, email },
    {
      name: (value) => {
        if (!value || value.length < 1) return [intl.formatMessage(validationMessages.required)];
        return [];
      },
      username: (value) => {
        if (!value || value.length < 1) return [intl.formatMessage(validationMessages.required)];
        if (!validator.matches(value, /^[a-zA-Z0-9_]{3,16}$/))
          return [intl.formatMessage(messages.usernameInvalid)];
        return [];
      },
      email: (value) => {
        if (!value || value.length < 1) return [intl.formatMessage(validationMessages.required)];
        if (!validator.isEmail(value)) return [intl.formatMessage(messages.emailInvalid)];
        return [];
      },
    },
  );

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value, name } = e.target;
    setValue(name as 'name' | 'username' | 'email', value);
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log('submit', values);
  };

  return (
    <form onSubmit={handleSubmit}>
      <TextField
        label={intl.formatMessage(messages.nameLabel)}
        name="name"
        value={values.name}
        errors={errors.name}
        displayErrors={modified.name}
        onChange={handleChange}
        margin={{ bottom: 'small' }}
        required
      />
      <TextField
        label={intl.formatMessage(messages.usernameLabel)}
        name="username"
        value={values.username}
        errors={errors.username}
        displayErrors={modified.username}
        onChange={handleChange}
        margin={{ bottom: 'small' }}
        required
      />
      <TextField
        label={intl.formatMessage(messages.emailLabel)}
        name="email"
        value={values.email}
        errors={errors.email}
        displayErrors={modified.email}
        onChange={handleChange}
        margin={{ bottom: 'small' }}
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
