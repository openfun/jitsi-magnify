import { Box, Heading } from 'grommet';
import React, { useMemo } from 'react';
import { defineMessages, useIntl } from 'react-intl';
import { Form, Formik } from 'formik';
import FormikInput from '../../design-system/Formik/Input';
import { FormikSubmitButton } from '../../design-system/Formik/SubmitButton/FormikSubmitButton';
import * as Yup from 'yup';
import { validationMessages } from '../../../i18n/Messages';
import { formLabelMessages } from '../../../i18n/Messages/formLabelMessages';

const messages = defineMessages({
  formTitle: {
    defaultMessage: 'Create an account',
    description: 'The title of the signup form',
    id: 'components.auth.SignupForm.formTitle',
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

export default function SignupForm() {
  const intl = useIntl();

  const validationSchema = useMemo(() => {
    return Yup.object().shape({
      name: Yup.string().required(),
      email: Yup.string().email().required(),
      username: Yup.string()
        .min(3, intl.formatMessage(validationMessages.usernameInvalid))
        .max(16, intl.formatMessage(validationMessages.usernameInvalid))
        .required(),
      password: Yup.string().required(),
      confirmPassword: Yup.string()
        .oneOf(
          [Yup.ref('password'), null],
          intl.formatMessage(validationMessages.confirmDoesNotMatch),
        )
        .required(),
    });
  }, []);

  return (
    <Formik
      initialValues={{
        name: '',
        email: '',
        username: '',
        password: '',
        confirmPassword: '',
      }}
      validationSchema={validationSchema}
      onSubmit={(values) => console.log(values)}
    >
      <Form>
        <Box gap={'medium'}>
          <Heading level={4} color="brand">
            {intl.formatMessage(messages.formTitle)}
          </Heading>
          <FormikInput name={'name'} label={intl.formatMessage(formLabelMessages.name)} />
          <FormikInput name={'email'} label={intl.formatMessage(messages.emailLabel)} />
          <FormikInput name={'username'} label={intl.formatMessage(messages.usernameLabel)} />
          <FormikInput
            name={'password'}
            type={'password'}
            label={intl.formatMessage(messages.passwordLabel)}
          />
          <FormikInput
            name={'confirmPassword'}
            type={'password'}
            label={intl.formatMessage(messages.confirmPasswordLabel)}
          />
          <Box direction="row" justify="end" margin={{ top: 'small' }}>
            <FormikSubmitButton label={intl.formatMessage(messages.submitButtonLabel)} />
          </Box>
        </Box>
      </Form>
    </Formik>
  );
}
