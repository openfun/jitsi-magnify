import { useMutation } from '@tanstack/react-query';
import { Form, Formik } from 'formik';
import { Box } from 'grommet';
import React, { useMemo } from 'react';
import { defineMessages, useIntl } from 'react-intl';
import * as Yup from 'yup';
import { useAuthContext } from '../../../context';
import { validationMessages } from '../../../i18n/Messages';
import { formLabelMessages } from '../../../i18n/Messages/formLabelMessages';
import { UsersRepository } from '../../../services/users/users.repository';
import FormikInput from '../../design-system/Formik/Input';
import { FormikSubmitButton } from '../../design-system/Formik/SubmitButton/FormikSubmitButton';

export interface IdentityFormProps {
  id?: string;
  name: string;
  username: string;
  email: string;
}

const messages = defineMessages({
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

interface IdentityFormValues {
  name: string;
  username: string;
  email: string;
}

export default function IdentityForm({ id, name, username, email }: IdentityFormProps) {
  const intl = useIntl();
  const authContext = useAuthContext();

  const validationSchema = useMemo(() => {
    return Yup.object().shape({
      name: Yup.string().required(),
      username: Yup.string()
        .min(3, intl.formatMessage(validationMessages.usernameInvalid))
        .max(16, intl.formatMessage(validationMessages.usernameInvalid))
        .required(),
      email: Yup.string().email().required(),
    });
  }, []);

  const { mutate: updateUser, isLoading } = useMutation(
    async (data: IdentityFormValues) => {
      if (authContext.user?.id == null) {
        return;
      }
      return await UsersRepository.update(authContext.user.id, data);
    },
    {
      retry: 0,
      onSuccess: (user) => {
        authContext.updateUser(user);
      },
    },
  );

  const handleSubmit = (values: IdentityFormValues) => {
    updateUser(values);
  };

  return (
    <Formik
      onSubmit={handleSubmit}
      validateOnChange={true}
      validationSchema={validationSchema}
      initialValues={{
        name: authContext.user?.name ?? '',
        username: authContext.user?.username ?? '',
        email: authContext.user?.email ?? '',
      }}
    >
      <Form>
        <Box gap="10px">
          <FormikInput label={intl.formatMessage(formLabelMessages.name)} name="name" />
          <FormikInput
            disabled={true}
            label={intl.formatMessage(messages.usernameLabel)}
            name="username"
          />
          <FormikInput
            disabled={true}
            label={intl.formatMessage(messages.emailLabel)}
            name="email"
          />
          <FormikSubmitButton
            isLoading={isLoading}
            label={intl.formatMessage(messages.submitButtonLabel)}
          />
        </Box>
      </Form>
    </Formik>
  );
}
