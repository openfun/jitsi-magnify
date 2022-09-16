import { defineMessages, useIntl } from 'react-intl';
import React, { useMemo } from 'react';
import { Form, Formik } from 'formik';
import * as Yup from 'yup';
import FormikInput from '../../design-system/Formik/Input';
import { FormikSubmitButton } from '../../design-system/Formik/SubmitButton/FormikSubmitButton';
import { useMutation, useQueryClient } from 'react-query';
import { Room } from '../../../types/room';
import { useController } from '../../../controller';
import {formLabelMessages} from "../../../i18n/Messages/formLabelMessages";

const messages = defineMessages({
  namePlaceholder: {
    id: 'components.rooms.registerRoomForm.namePlaceholder',
    defaultMessage: 'Room name (ex: Interview with John)',
    description: 'Placeholder for the name field',
  },
  registerRoomDialogLabel: {
    id: 'components.rooms.registerRoomForm.registerRoomDialogLabel',
    defaultMessage: 'Register new room',
    description: 'Label for the dialog to register a new room',
  },
  registerRoomSubmitLabel: {
    id: 'components.rooms.registerRoomForm.registerRoomSubmitLabel',
    defaultMessage: 'Register room',
    description: 'Label for the submit button to register a new room',
  },
});

export interface RegisterRoomFormProps {
  /**
   * Function to call when the form is successfully submited,
   * after the request to register the room has succeeded
   */
  onSuccess: () => void;
}

interface RegisterRoomFormValues {
  name: string;
}

const validationSchema = Yup.object().shape({ name: Yup.string().required() });

const RegisterRoomForm = ({ onSuccess }: RegisterRoomFormProps) => {
  const intl = useIntl();
  const queryClient = useQueryClient();
  const controller = useController();
  const { mutate } = useMutation(controller.registerRoom, {
    onSuccess: (data) => {
      queryClient.setQueryData('rooms', (rooms?: Room[]) => [...(rooms || []), data]);
      onSuccess();
    },
  });

  const initialValues: RegisterRoomFormValues = useMemo(
    () => ({
      name: ''
    }),
    [],
  );

  const handleSubmit = (values: RegisterRoomFormValues) => {
    mutate(values.name);
  };

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={validationSchema}
      onSubmit={handleSubmit}
    >
      <Form>
        <FormikInput
          name={'name'}
          placeholder={intl.formatMessage(messages.namePlaceholder)}
          label={intl.formatMessage(formLabelMessages.name)}
        />
        <FormikSubmitButton label={intl.formatMessage(messages.registerRoomSubmitLabel)} />
      </Form>
    </Formik>
  );
};

export default RegisterRoomForm;
