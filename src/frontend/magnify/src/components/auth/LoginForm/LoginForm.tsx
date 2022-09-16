import { Box, Button, Heading, Text } from 'grommet';
import { Close } from 'grommet-icons';
import React from 'react';
import { defineMessages, IntlShape, useIntl } from 'react-intl';
import { useMutation } from 'react-query';

import { useController } from '../../../controller';
import { useStore } from '../../../controller/ControllerProvider';
import { LoginInput } from '../../../controller/interface';
import useFormState from '../../../hooks/useFormState';
import { validationMessages } from '../../../i18n/Messages';
import { LoadingButton, TextField } from '../../design-system';

const messages = defineMessages({
  formTitle: {
    defaultMessage: 'Login to my account',
    description: 'The title of the login form',
    id: 'components.auth.LoginForm.formTitle',
  },
  formExplanation: {
    defaultMessage: 'Please login to your account',
    description: 'The explanation of the login form',
    id: 'components.auth.LoginForm.formExplanation',
  },
  usernameLabel: {
    defaultMessage: 'Username',
    description: 'The label for the username field',
    id: 'components.auth.LoginForm.usernameLabel',
  },
  passwordLabel: {
    defaultMessage: 'Password',
    description: 'The label for the password field',
    id: 'components.auth.LoginForm.passwordLabel',
  },
  submitButtonLabel: {
    defaultMessage: 'Login',
    description: 'The label for the submit button',
    id: 'components.auth.LoginForm.submitButtonLabel',
  },
  InvalidCredentials: {
    defaultMessage: 'Invalid credentials',
    description: 'The error message if the credentials are invalid',
    id: 'components.auth.LoginForm.InvalidCredentials',
  },
  UnknownError: {
    defaultMessage: 'Something went wrong, please try again later',
    description: 'The error message if an unknown error occured during the login',
    id: 'components.auth.LoginForm.UnknownError',
  },
});

const requiredValidator = (intl: IntlShape) => (value: string) => {
  if (!value || value.length < 1) return [intl.formatMessage(validationMessages.required)];
  return [];
};

export default function LoginForm() {
  const intl = useIntl();
  const controller = useController();
  const { setUser } = useStore();
  const { mutate, error, isLoading, reset } = useMutation(
    async (input: LoginInput) => {
      await controller.login(input);
      return await controller.getMyProfile();
    },
    {
      onSuccess: (data) => {
        setUser(data);
      },
    },
  );

  const { values, errors, modified, setValue, isValid, isModified } = useFormState(
    { username: '', password: '' },
    {
      username: requiredValidator(intl),
      password: requiredValidator(intl),
    },
  );

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value, name } = e.target;
    setValue(name as 'username' | 'password', value);
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setValue('password', '');
  };

  return (
    <>
      <Heading color="brand" level={2}>
        {intl.formatMessage(messages.formTitle)}
      </Heading>
      <Text color="brand" margin={{ bottom: 'medium' }}>
        {intl.formatMessage(messages.formExplanation)}
      </Text>
      {error && (
        <Box
          background="status-error"
          direction="row"
          gap="small"
          justify="between"
          margin={{ vertical: 'small' }}
          pad="small"
          round="xsmall"
        >
          <Text size="small">
            {(error as { detail: string }).detail || intl.formatMessage(messages.UnknownError)}
          </Text>
          <Button>
            <Close onClick={reset} size="small" />
          </Button>
        </Box>
      )}
      <form onSubmit={handleSubmit}>
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
          displayErrors={modified.password}
          errors={errors.password}
          label={intl.formatMessage(messages.passwordLabel)}
          margin={{ bottom: 'small' }}
          name="password"
          onChange={handleChange}
          type="password"
          value={values.password}
        />
        <Box direction="row" justify="end" margin={{ top: 'small' }}>
          <LoadingButton
            primary
            disabled={!isModified || !isValid}
            isLoading={isLoading}
            label={intl.formatMessage(messages.submitButtonLabel)}
            onClick={() => mutate(values)}
            type="submit"
          />
        </Box>
      </form>
    </>
  );
}
