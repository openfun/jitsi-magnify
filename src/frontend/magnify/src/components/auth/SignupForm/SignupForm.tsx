import { Box, Button, Heading, Text } from 'grommet';
import { Close } from 'grommet-icons';
import React from 'react';
import { defineMessages, IntlShape, useIntl } from 'react-intl';
import { useMutation } from 'react-query';

import { useController } from '../../../controller';
import { useStore } from '../../../controller/ControllerProvider';
import { SignupInput } from '../../../controller/interface';
import useFormState from '../../../hooks/useFormState';
import { validationMessages } from '../../../i18n/Messages';
import validators, {
  emailValidator,
  passwordConfirmValidator,
  usernameValidator,
} from '../../../utils/validators';
import { LoadingButton, TextField } from '../../design-system';

const messages = defineMessages({
  formTitle: {
    defaultMessage: 'Create an account',
    description: 'The title of the signup form',
    id: 'components.auth.SignupForm.formTitle',
  },
  nameLabel: {
    id: 'components.auth.SignupForm.nameLabel',
    description: 'Label for the name input',
    defaultMessage: 'Name',
  },
  emailLabel: {
    id: 'components.auth.SignupForm.emailLabel',
    description: 'Label for the email input',
    defaultMessage: 'Email',
  },
  usernameLabel: {
    defaultMessage: 'Username',
    description: 'The label for the username field',
    id: 'components.auth.SignupForm.usernameLabel',
  },
  passwordLabel: {
    defaultMessage: 'Password',
    description: 'The label for the password field',
    id: 'components.auth.SignupForm.passwordLabel',
  },
  confirmPasswordLabel: {
    defaultMessage: 'Confirm Password',
    description: 'The label for the confirm password field',
    id: 'components.auth.SignupForm.confirmPasswordLabel',
  },
  submitButtonLabel: {
    defaultMessage: 'Signup',
    description: 'The label for the submit button',
    id: 'components.auth.SignupForm.submitButtonLabel',
  },
  InvalidCredentials: {
    defaultMessage: 'Invalid credentials',
    description: 'The error message if the credentials are invalid',
    id: 'components.auth.SignupForm.InvalidCredentials',
  },
  UnknownError: {
    defaultMessage: 'Something went wrong, please try again later',
    description: 'The error message if an unknown error occured during the login',
    id: 'components.auth.SignupForm.UnknownError',
  },
});

const requiredValidator = (intl: IntlShape) => (value: string) => {
  if (!value || value.length < 1) return [intl.formatMessage(validationMessages.required)];
  return [];
};

export default function SignupForm() {
  const intl = useIntl();
  const controller = useController();
  const { setUser } = useStore();
  const { mutate, error, isLoading, reset } = useMutation(
    async (input: SignupInput) => {
      await controller.signup(input);
      return await controller.getMyProfile();
    },
    {
      onSuccess: (data) => {
        setUser(data);
      },
    },
  );

  const { values, errors, modified, setValue, isValid, isModified } = useFormState(
    { email: '', name: '', username: '', password: '', confirmPassword: '' },
    {
      email: validators(intl, requiredValidator, emailValidator),
      name: validators(intl, requiredValidator),
      username: validators(intl, requiredValidator, usernameValidator),
      password: validators(intl, requiredValidator),
      confirmPassword: validators(intl, requiredValidator, passwordConfirmValidator),
    },
  );

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value, name } = e.target;
    setValue(name as 'username' | 'password', value);
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    mutate({
      name: values.name,
      email: values.email,
      username: values.username,
      password: values.password,
    });
    setValue('password', '');
    setValue('confirmPassword', '');
  };

  const aggErrors = (field: keyof typeof values) => {
    const clientErrors = errors[field];
    const serverErrors = (error as Record<keyof typeof values, string>)?.[field];
    return [...clientErrors, ...(serverErrors ? [serverErrors] : [])];
  };

  const isUnknownError =
    error &&
    !(error as any)?.username &&
    !(error as any)?.password &&
    !(error as any)?.email &&
    !(error as any)?.name;

  return (
    <>
      <Heading color="brand" level={2}>
        {intl.formatMessage(messages.formTitle)}
      </Heading>
      {isUnknownError && (
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
            {(error as Error).message === 'InvalidCredentials'
              ? intl.formatMessage(messages.InvalidCredentials)
              : intl.formatMessage(messages.UnknownError)}
          </Text>
          <Button>
            <Close onClick={reset} size="small" />
          </Button>
        </Box>
      )}
      <form onSubmit={handleSubmit}>
        <TextField
          required
          displayErrors={modified.name}
          errors={aggErrors('name')}
          label={intl.formatMessage(messages.nameLabel)}
          margin={{ bottom: 'small' }}
          name="name"
          onChange={handleChange}
          value={values.name}
        />
        <TextField
          required
          displayErrors={modified.email}
          errors={aggErrors('email')}
          label={intl.formatMessage(messages.emailLabel)}
          margin={{ bottom: 'small' }}
          name="email"
          onChange={handleChange}
          value={values.email}
        />
        <TextField
          required
          displayErrors={modified.username}
          errors={aggErrors('username')}
          label={intl.formatMessage(messages.usernameLabel)}
          margin={{ bottom: 'small' }}
          name="username"
          onChange={handleChange}
          value={values.username}
        />
        <TextField
          required
          displayErrors={modified.password}
          errors={aggErrors('password')}
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
          label={intl.formatMessage(messages.confirmPasswordLabel)}
          margin={{ bottom: 'small' }}
          name="confirmPassword"
          onChange={handleChange}
          type="password"
          value={values.confirmPassword}
        />
        <Box direction="row" justify="end" margin={{ top: 'small' }}>
          <LoadingButton
            primary
            disabled={!isModified || !isValid}
            isLoading={isLoading}
            label={intl.formatMessage(messages.submitButtonLabel)}
            type="submit"
          />
        </Box>
      </form>
    </>
  );
}
