import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Form, Formik } from 'formik';
import React, { useMemo } from 'react';
import { defineMessages, useIntl } from 'react-intl';
import * as Yup from 'yup';
import { formLabelMessages } from '../../../i18n/Messages/formLabelMessages';
import { RoomsRepository } from '../../../services/rooms/rooms.repository';
import { Room } from '../../../types/entities/room';
import { MagnifyQueryKeys } from '../../../utils/constants/react-query';
import FormikInput from '../../design-system/Formik/Input';
import { FormikSubmitButton } from '../../design-system/Formik/SubmitButton/FormikSubmitButton';

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
  onSuccess: (room?: Room) => void;
}

interface RegisterRoomFormValues {
  name: string;
}

const RegisterRoomForm = ({ onSuccess }: RegisterRoomFormProps) => {
  const intl = useIntl();
  const validationSchema = Yup.object().shape({ name: Yup.string().required() });
  const queryClient = useQueryClient();
  const { mutate, isLoading } = useMutation(RoomsRepository.create, {
    onSuccess: (newRoom) => {
      queryClient.setQueryData([MagnifyQueryKeys.ROOMS], (rooms: Room[] = []) => {
        const newRooms = [...rooms];
        newRooms.push(newRoom);
        return newRooms;
      });
      onSuccess(newRoom);
    },
  });

  const initialValues: RegisterRoomFormValues = useMemo(
    () => ({
      name: '',
    }),
    [],
  );

  const handleSubmit = (values: RegisterRoomFormValues) => {
    mutate(values);
  };

  return (
    <Formik
      initialValues={initialValues}
      onSubmit={handleSubmit}
      validationSchema={validationSchema}
    >
      <Form>
        <FormikInput
          label={intl.formatMessage(formLabelMessages.name)}
          name={'name'}
          placeholder={intl.formatMessage(messages.namePlaceholder)}
        />
        <FormikSubmitButton
          isLoading={isLoading}
          label={intl.formatMessage(messages.registerRoomSubmitLabel)}
        />
      </Form>
    </Formik>
  );
};

export default RegisterRoomForm;
