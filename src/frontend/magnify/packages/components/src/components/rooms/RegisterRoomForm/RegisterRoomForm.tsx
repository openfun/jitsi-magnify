import { useMutation, useQueryClient } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import { Form, Formik, FormikHelpers } from 'formik';
import React, { useMemo } from 'react';
import { defineMessages, useIntl } from 'react-intl';
import * as Yup from 'yup';
import { formLabelMessages } from '../../../i18n/Messages/formLabelMessages';
import { RoomsRepository } from '../../../services';
import { Room } from '../../../types/entities/room';
import { Maybe } from '../../../types/misc';
import { MagnifyQueryKeys } from '../../../utils/constants/react-query';
import { FormikInput } from '../../design-system/Formik/Input';
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

interface FormErrors {
  slug?: string[];
}

export const RegisterRoomForm = ({ onSuccess }: RegisterRoomFormProps) => {
  const intl = useIntl();
  const validationSchema = Yup.object().shape({ name: Yup.string().required() });
  const queryClient = useQueryClient();
  const mutation = useMutation<Room, AxiosError, RegisterRoomFormValues>(RoomsRepository.create, {
    onSuccess: (newRoom) => {
      queryClient.setQueryData([MagnifyQueryKeys.ROOMS], (rooms: Room[] = []) => {
        return [...rooms, newRoom];
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

  const handleSubmit = (
    values: RegisterRoomFormValues,
    actions: FormikHelpers<RegisterRoomFormValues>,
  ) => {
    mutation.mutate(values, {
      onError: (error) => {
        const formErrors = error?.response?.data as Maybe<FormErrors>;
        if (formErrors?.slug) {
          actions.setFieldError('name', formErrors.slug.join(','));
        }
      },
    });
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
          isLoading={mutation.isLoading}
          label={intl.formatMessage(messages.registerRoomSubmitLabel)}
        />
      </Form>
    </Formik>
  );
};
