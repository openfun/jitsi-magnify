import { Box, Button, Text } from 'grommet';
import React from 'react';
import { defineMessages, IntlShape, useIntl } from 'react-intl';
import { useMutation } from 'react-query';
import { useController } from '../../../controller';
import useFormState from '../../../hooks/useFormState';
import { validationMessages } from '../../../i18n/Messages';
import { LoadingButton, TextField } from '../../design-system';
import { Close } from 'grommet-icons';
import { SignupInput } from '../../../controller/interface';
import { useStore } from '../../../controller/ControllerProvider';
import validators, {
  emailValidator,
  passwordConfirmValidator,
  usernameValidator,
} from '../../../utils/validators';

const messages = defineMessages({
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
      {isUnknownError && (
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
          label={intl.formatMessage(messages.nameLabel)}
          name="name"
          value={values.name}
          errors={aggErrors('name')}
          displayErrors={modified.name}
          onChange={handleChange}
          margin={{ bottom: 'small' }}
          required
        />
        <TextField
          label={intl.formatMessage(messages.emailLabel)}
          name="email"
          value={values.email}
          errors={aggErrors('email')}
          displayErrors={modified.email}
          onChange={handleChange}
          margin={{ bottom: 'small' }}
          required
        />
        <TextField
          label={intl.formatMessage(messages.usernameLabel)}
          name="username"
          value={values.username}
          errors={aggErrors('username')}
          displayErrors={modified.username}
          onChange={handleChange}
          margin={{ bottom: 'small' }}
          required
        />
        <TextField
          label={intl.formatMessage(messages.passwordLabel)}
          name="password"
          value={values.password}
          errors={aggErrors('password')}
          displayErrors={modified.password}
          onChange={handleChange}
          margin={{ bottom: 'small' }}
          type="password"
          required
        />
        <TextField
          label={intl.formatMessage(messages.confirmPasswordLabel)}
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
          <LoadingButton
            primary
            label={intl.formatMessage(messages.submitButtonLabel)}
            disabled={!isModified || !isValid}
            type="submit"
            isLoading={isLoading}
          />
        </Box>
      </form>
    </>
  );
}
