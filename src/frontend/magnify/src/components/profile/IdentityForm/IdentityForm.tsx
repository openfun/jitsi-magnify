import React, {useMemo} from 'react';
import * as Yup from 'yup';
import { defineMessages, useIntl } from 'react-intl';
import { Form, Formik } from 'formik';
import { Box } from 'grommet';
import FormikInput from '../../design-system/Formik/Input';
import { FormikSubmitButton } from '../../design-system/Formik/SubmitButton/FormikSubmitButton';
import { validationMessages } from '../../../i18n/Messages';
import {formLabelMessages} from "../../../i18n/Messages/formLabelMessages";

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

  const handleSubmit = (values: IdentityFormValues) => {
    console.log(id, values);
  };

  return (
    <Formik
      validateOnChange={true}
      initialValues={{ name, username, email }}
      validationSchema={validationSchema}
      onSubmit={handleSubmit}
    >
      <Form>
        <Box gap={'10px'}>
          <FormikInput name={'name'} label={intl.formatMessage(formLabelMessages.name)} />
          <FormikInput name={'username'} label={intl.formatMessage(messages.usernameLabel)} />
          <FormikInput name={'email'} label={intl.formatMessage(messages.emailLabel)} />
          <FormikSubmitButton label={intl.formatMessage(messages.submitButtonLabel)} />
        </Box>
      </Form>
    </Formik>
  );
}
