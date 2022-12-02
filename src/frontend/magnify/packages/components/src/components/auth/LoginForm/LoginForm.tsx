import { useMutation } from '@tanstack/react-query';
import { Form, Formik } from 'formik';
import { Box, Heading, Text } from 'grommet';
import React from 'react';
import { defineMessages, useIntl } from 'react-intl';

import * as Yup from 'yup';
import { useAuthContext, useNotification } from '../../../context';

import { useRouting } from '../../../context/routing';
import { UsersRepository } from '../../../services/users/users.repository';
import { FormikInput } from '../../design-system/Formik/Input';
import { FormikSubmitButton } from '../../design-system/Formik/SubmitButton/FormikSubmitButton';

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
  invalidCredentialsTitle: {
    defaultMessage: 'Invalid credentials',
    description: 'The error message if the credentials are invalid',
    id: 'components.auth.LoginForm.invalidCredentialsTitle',
  },
  invalidCredentialsContent: {
    defaultMessage: 'Your username or password is incorrect. Check your credentials',
    description: 'The error message if the credentials are invalid',
    id: 'components.auth.LoginForm.invalidCredentialsContent',
  },
});

interface FormValues {
  username: string;
  password: string;
}

export const LoginForm = () => {
  const intl = useIntl();
  const validationSchema = Yup.object().shape({
    username: Yup.string().required(),
    password: Yup.string().required(),
  });
  const authContext = useAuthContext();
  const routing = useRouting();
  const notification = useNotification();

  const { mutate, isLoading } = useMutation(
    async (data: FormValues) => {
      await UsersRepository.login(data.username, data.password);
      return await UsersRepository.me();
    },
    {
      retry: 0,
      onSuccess: (user) => {
        authContext.updateUser(user);
        routing.goToRoomsList();
      },
      onError: () => {
        notification.showNotification({
          status: 'critical',
          title: intl.formatMessage(messages.invalidCredentialsTitle),
          message: intl.formatMessage(messages.invalidCredentialsContent),
        });
      },
    },
  );

  const handleSubmit = (values: FormValues) => {
    mutate(values);
  };

  return (
    <Formik
      initialValues={{ username: '', password: '' }}
      onSubmit={handleSubmit}
      validationSchema={validationSchema}
    >
      <Form>
        <Box gap={'xsmall'}>
          <Heading color="brand" level={4}>
            {intl.formatMessage(messages.formTitle)}
          </Heading>
          <Text color="brand" margin={{ bottom: 'medium' }}>
            {intl.formatMessage(messages.formExplanation)}
          </Text>
        </Box>
        <Box gap={'medium'}>
          <FormikInput label={intl.formatMessage(messages.usernameLabel)} name={'username'} />
          <FormikInput
            label={intl.formatMessage(messages.passwordLabel)}
            name={'password'}
            type={'password'}
          />
          <Box direction="row" justify="end" margin={{ top: 'small' }}>
            <FormikSubmitButton
              isLoading={isLoading}
              label={intl.formatMessage(messages.submitButtonLabel)}
            />
          </Box>
        </Box>
      </Form>
    </Formik>
  );
};
