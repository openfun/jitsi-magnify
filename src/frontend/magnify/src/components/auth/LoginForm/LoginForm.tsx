import { Box, Button, Text } from 'grommet';
import React from 'react';
import { defineMessages, IntlShape, useIntl } from 'react-intl';
import { useMutation } from 'react-query';
import { useController } from '../../../controller';
import useFormState from '../../../hooks/useFormState';
import { validationMessages } from '../../../i18n/Messages';
import { LoadingButton, TextField } from '../../design-system';
import { Close } from 'grommet-icons';
import { LoginInput } from '../../../controller/interface';
import { useStore } from '../../../controller/ControllerProvider';

const messages = defineMessages({
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
      {error && (
        <Box
          direction="row"
          gap="small"
          pad="small"
          margin={{ vertical: 'small' }}
          background="status-error"
          round="xsmall"
          justify="between"
        >
          <Text size="small">
            {(error as Error).message === 'InvalidCredentials'
              ? intl.formatMessage(messages.InvalidCredentials)
              : intl.formatMessage(messages.UnknownError)}
          </Text>
          <Button>
            <Close size="small" onClick={reset} />
          </Button>
        </Box>
      )}
      <form onSubmit={handleSubmit}>
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
          label={intl.formatMessage(messages.passwordLabel)}
          name="password"
          value={values.password}
          errors={errors.password}
          displayErrors={modified.password}
          onChange={handleChange}
          margin={{ bottom: 'small' }}
          required
        />
        <Box direction="row" justify="end" margin={{ top: 'small' }}>
          <LoadingButton
            primary
            label={intl.formatMessage(messages.submitButtonLabel)}
            disabled={!isModified || !isValid}
            onClick={() => mutate(values)}
            type="submit"
            isLoading={isLoading}
          />
        </Box>
      </form>
    </>
  );
}
