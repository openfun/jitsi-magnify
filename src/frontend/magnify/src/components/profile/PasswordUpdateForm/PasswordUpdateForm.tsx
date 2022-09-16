import { Box } from 'grommet';
import React, { useMemo } from 'react';
import { defineMessages, useIntl } from 'react-intl';
import * as Yup from 'yup';
import { Form, Formik } from 'formik';
import FormikInput from '../../design-system/Formik/Input';
import { FormikSubmitButton } from '../../design-system/Formik/SubmitButton/FormikSubmitButton';
import { validationMessages } from '../../../i18n/Messages';

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

interface UpdatePasswordFormValues {
  previousPassword: string;
  password: string;
  confirmPassword: string;
}

export default function PasswordUpdateForm() {
  const intl = useIntl();

  const validationSchema = useMemo(() => {
    return Yup.object().shape({
      previousPassword: Yup.string().required(),
      password: Yup.string().required(),
      confirmPassword: Yup.string()
        .oneOf(
          [Yup.ref('password'), null],
          intl.formatMessage(validationMessages.confirmDoesNotMatch),
        )
        .required(),
    });
  }, []);

  const handleSubmit = (values: UpdatePasswordFormValues) => {
    console.log(values);
  };

  return (
    <Formik
      initialValues={{
        previousPassword: '',
        password: '',
        confirmPassword: '',
      }}
      validationSchema={validationSchema}
      onSubmit={handleSubmit}
    >
      <Form>
        <Box gap={'10px'}>
          <FormikInput
            type={'password'}
            name={'previousPassword'}
            label={intl.formatMessage(messages.previousPasswordLabel)}
          />
          <FormikInput
            type={'password'}
            name={'password'}
            label={intl.formatMessage(messages.passwordLabel)}
          />
          <FormikInput
            type={'password'}
            name={'confirmPassword'}
            label={intl.formatMessage(messages.confirmNewPasswordLabel)}
          />
          <FormikSubmitButton label={intl.formatMessage(messages.submitButtonLabel)} />
        </Box>
      </Form>
    </Formik>
  );
}
