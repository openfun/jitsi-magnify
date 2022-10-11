import { useMutation } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import { Form, Formik, FormikHelpers } from 'formik';
import { Box } from 'grommet';
import React, { useMemo } from 'react';
import { defineMessages, useIntl } from 'react-intl';
import * as Yup from 'yup';
import { useAuthContext } from '../../../context';
import { validationMessages } from '../../../i18n/Messages';
import { UsersRepository } from '../../../services/users/users.repository';
import { UserResponse } from '../../../types/api/auth';
import { Maybe } from '../../../types/misc';
import FormikInput from '../../design-system/Formik/Input';
import { FormikSubmitButton } from '../../design-system/Formik/SubmitButton/FormikSubmitButton';

const messages = defineMessages({
  previousPasswordLabel: {
    defaultMessage: 'Previous password',
    description: 'The label for the previous password field',
    id: 'components.profile.passwordUpdateForm.previousPasswordLabel',
  },
  passwordLabel: {
    defaultMessage: 'New password',
    description: 'The label for the new password field',
    id: 'components.profile.passwordUpdateForm.passwordLabel',
  },
  confirmNewPasswordLabel: {
    defaultMessage: 'Confirm new password',
    description: 'The label for the confirm new password field',
    id: 'components.profile.passwordUpdateForm.confirmNewPasswordLabel',
  },
  submitButtonLabel: {
    defaultMessage: 'Save new password',
    description: 'The label for the submit button on the password update form',
    id: 'components.profile.passwordUpdateForm.submitButtonLabel',
  },
});

interface FormValues {
  current_password: string;
  new_password: string;
  confirmPassword: string;
}

interface FormErrors {
  current_password?: string[];
  new_password?: string[];
}

export default function PasswordUpdateForm() {
  const intl = useIntl();
  const authContext = useAuthContext();

  const validationSchema = useMemo(() => {
    return Yup.object().shape({
      current_password: Yup.string().required(),
      new_password: Yup.string().required(),
      confirmPassword: Yup.string()
        .oneOf(
          [Yup.ref('new_password'), null],
          intl.formatMessage(validationMessages.confirmDoesNotMatch),
        )
        .required(),
    });
  }, []);

  const mutation = useMutation<Maybe<UserResponse>, AxiosError, FormValues>(
    async (data: FormValues) => {
      if (authContext.user?.id == null) {
        return;
      }
      return await UsersRepository.changePassword(data.current_password, data.new_password);
    },
    {
      retry: 0,
      onSuccess: (user) => {
        authContext.updateUser(user);
      },
    },
  );

  const handleSubmit = async (values: FormValues, actions: FormikHelpers<FormValues>) => {
    mutation.mutate(values, {
      onError: (error: AxiosError) => {
        const formErrors: FormErrors = error?.response?.data as FormErrors;
        Object.entries(formErrors).forEach(([key, value]) => {
          actions.setFieldError(key, value.join(','));
        });
      },
    });
  };

  return (
    <Formik
      onSubmit={handleSubmit}
      validationSchema={validationSchema}
      initialValues={{
        current_password: '',
        new_password: '',
        confirmPassword: '',
      }}
    >
      <Form>
        <Box gap={'10px'}>
          <FormikInput
            label={intl.formatMessage(messages.previousPasswordLabel)}
            name={'current_password'}
            type={'password'}
          />
          <FormikInput
            label={intl.formatMessage(messages.passwordLabel)}
            name={'new_password'}
            type={'password'}
          />
          <FormikInput
            label={intl.formatMessage(messages.confirmNewPasswordLabel)}
            name={'confirmPassword'}
            type={'password'}
          />
          <FormikSubmitButton
            isLoading={mutation.isLoading}
            label={intl.formatMessage(messages.submitButtonLabel)}
          />
        </Box>
      </Form>
    </Formik>
  );
}
