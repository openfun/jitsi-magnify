import { Box, Heading, Text } from 'grommet';
import React, { useMemo } from 'react';
import { defineMessages, useIntl } from 'react-intl';
import { Form, Formik, FormikValues } from 'formik';
import FormikInput from '../../design-system/Formik/Input';
import { FormikSubmitButton } from '../../design-system/Formik/SubmitButton/FormikSubmitButton';
import * as Yup from 'yup';

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

const validationSchema = Yup.object().shape({
  username: Yup.string().required(),
  password: Yup.string().required(),
});

export default function LoginForm() {
  const intl = useIntl();

  const handleSubmit = (values: FormikValues) => {
    console.log(values);
  };

  return (
    <Formik
      initialValues={{ username: '', password: '' }}
      validationSchema={validationSchema}
      onSubmit={handleSubmit}
    >
      <Form>
        <Box gap={'xsmall'}>
          <Heading level={4} color="brand">
            {intl.formatMessage(messages.formTitle)}
          </Heading>
          <Text color="brand" margin={{ bottom: 'medium' }}>
            {intl.formatMessage(messages.formExplanation)}
          </Text>
        </Box>
        <Box gap={'medium'}>
          <FormikInput name={'username'} label={intl.formatMessage(messages.usernameLabel)} />
          <FormikInput
            name={'password'}
            type={'password'}
            label={intl.formatMessage(messages.passwordLabel)}
          />
          <Box direction="row" justify="end" margin={{ top: 'small' }}>
            <FormikSubmitButton label={intl.formatMessage(messages.submitButtonLabel)} />
          </Box>
        </Box>
      </Form>
    </Formik>
  );
}
