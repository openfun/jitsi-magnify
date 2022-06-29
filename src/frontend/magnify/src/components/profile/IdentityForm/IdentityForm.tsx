import { Box, Button } from 'grommet';
import React from 'react';
import TextField from '../../design-system/TextField';
import { defineMessages, useIntl } from 'react-intl';
import useFormState from '../../../hooks/useFormState';
import validators, {
  emailValidator,
  requiredValidator,
  usernameValidator,
} from '../../../utils/validators';

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
  emailLabel: {
    defaultMessage: 'Email',
    description: 'The label for the email field',
    id: 'components.profile.identityForm.emailLabel',
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
      name: validators(intl, requiredValidator),
      username: validators(intl, requiredValidator, usernameValidator),
      email: validators(intl, requiredValidator, emailValidator),
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
