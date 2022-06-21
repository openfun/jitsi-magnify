import { Box, Button } from 'grommet';
import React, { useState } from 'react';
import TextField from '../../design-system/TextField';
import validator from 'validator';
import { defineMessages, useIntl } from 'react-intl';

export interface IdentityFormProps {
  name: string;
  username: string;
  email: string;
}

interface IdentityFormValues {
  name: string;
  username: string;
  email: string;
}

interface IdentityFormErrors {
  name: string[];
  username: string[];
  email: string[];
}

const messages = defineMessages({
  nameLabel: {
    defaultMessage: 'Name',
    description: 'The label for the name field',
    id: 'components.profile.identityForm.nameLabel',
  },
  nameRequired: {
    defaultMessage: 'Name is required',
    description: 'The error message for the name field',
    id: 'components.profile.identityForm.nameRequired',
  },
  usernameLabel: {
    defaultMessage: 'Username',
    description: 'The label for the username field',
    id: 'components.profile.identityForm.usernameLabel',
  },
  usernameRequired: {
    defaultMessage: 'Username is required',
    description: 'The error message for the username field',
    id: 'components.profile.identityForm.usernameRequired',
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
  emailRequired: {
    defaultMessage: 'Email is required',
    description: 'The error message for the email field',
    id: 'components.profile.identityForm.emailRequired',
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
  const [formValues, setFormValues] = useState<IdentityFormValues>({ name, username, email });
  const [formErrors, setFormErrors] = useState<IdentityFormErrors>({
    name: [],
    username: [],
    email: [],
  });

  const modified =
    name !== formValues.name || username !== formValues.username || email !== formValues.email;
  const valid = Object.values(formErrors).every((errors) => errors.length === 0);

  const validate = (formState: IdentityFormValues) => {
    const errors: IdentityFormErrors = {
      name: [],
      username: [],
      email: [],
    };

    if (!formState.name || formState.name.length < 1)
      errors.name.push(intl.formatMessage(messages.nameRequired));
    if (!formState.username || formState.username.length < 1)
      errors.username.push(intl.formatMessage(messages.usernameRequired));
    else if (!validator.matches(formState.username, /^[a-zA-Z0-9_]{3,16}$/))
      errors.username.push(intl.formatMessage(messages.usernameInvalid));
    if (!formState.email || formState.email.length < 1)
      errors.email.push(intl.formatMessage(messages.emailRequired));
    else if (!validator.isEmail(formState.email))
      errors.email.push(intl.formatMessage(messages.emailInvalid));

    setFormErrors(errors);

    return Object.values(errors).every((errors) => errors.length === 0);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value, name } = e.target;
    const newFormState = { ...formValues, [name as keyof IdentityFormValues]: value };
    setFormValues(newFormState);
    validate(newFormState);
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log('submit', formValues);
  };

  return (
    <form onSubmit={handleSubmit}>
      <TextField
        label={intl.formatMessage(messages.nameLabel)}
        name="name"
        value={formValues.name}
        errors={formErrors.name}
        onChange={handleChange}
        margin={{ bottom: 'small' }}
      />
      <TextField
        label={intl.formatMessage(messages.usernameLabel)}
        name="username"
        value={formValues.username}
        errors={formErrors.username}
        onChange={handleChange}
        margin={{ bottom: 'small' }}
      />
      <TextField
        label={intl.formatMessage(messages.emailLabel)}
        name="email"
        value={formValues.email}
        errors={formErrors.email}
        onChange={handleChange}
        margin={{ bottom: 'small' }}
      />
      <Box direction="row" justify="end" margin={{ top: 'small' }}>
        <Button
          primary
          label={intl.formatMessage(messages.submitButtonLabel)}
          disabled={!modified || !valid}
          type="submit"
        />
      </Box>
    </form>
  );
}
