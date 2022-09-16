import { Box, Button } from 'grommet';
import React, { useEffect } from 'react';
import { defineMessages, useIntl } from 'react-intl';
import { useMutation } from 'react-query';
import { useController } from '../../../controller';
import useFormState from '../../../hooks/useFormState';
import validators, {
  emailValidator,
  requiredValidator,
  usernameValidator,
} from '../../../utils/validators';
import TextField from '../../design-system/TextField';

export interface IdentityFormProps {
  id?: string;
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

export default function IdentityForm({ id, name, username, email }: IdentityFormProps) {
  const intl = useIntl();
  const controller = useController();
  const { mutate } = useMutation(controller.updateUser);

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
    if (id) mutate({ id, ...values });
  };

  return (
    <form onSubmit={handleSubmit}>
      <TextField
        required
        displayErrors={modified.name}
        errors={errors.name}
        label={intl.formatMessage(messages.nameLabel)}
        margin={{ bottom: 'small' }}
        name="name"
        onChange={handleChange}
        value={values.name}
      />
      <TextField
        required
        displayErrors={modified.username}
        errors={errors.username}
        label={intl.formatMessage(messages.usernameLabel)}
        margin={{ bottom: 'small' }}
        name="username"
        onChange={handleChange}
        value={values.username}
      />
      <TextField
        required
        displayErrors={modified.email}
        errors={errors.email}
        label={intl.formatMessage(messages.emailLabel)}
        margin={{ bottom: 'small' }}
        name="email"
        onChange={handleChange}
        value={values.email}
      />
      <Box direction="row" justify="end" margin={{ top: 'small' }}>
        <Button
          primary
          disabled={!isModified || !isValid || !id}
          label={intl.formatMessage(messages.submitButtonLabel)}
          type="submit"
        />
      </Box>
    </form>
  );
}
