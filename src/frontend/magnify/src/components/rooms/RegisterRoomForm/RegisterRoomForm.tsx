import { defineMessages, useIntl } from 'react-intl';
import React from 'react';
import useFormState from '../../../hooks/useFormState';
import validators, { requiredValidator } from '../../../utils/validators';
import { LoadingButton, TextField } from '../../design-system';
import { useController } from '../../../controller';
import { useMutation, useQueryClient } from 'react-query';
import { Box, Heading } from 'grommet';
import { Room } from '../../../types/room';

const messages = defineMessages({
  nameLabel: {
    id: 'components.rooms.registerRoomForm.nameLabel',
    defaultMessage: 'Name',
    description: 'Label for the name field',
  },
  registerRoomDialogLabel: {
    id: 'components.rooms.registerRoomForm.registerRoomDialogLabel',
    defaultMessage: 'Register new room',
    description: 'Label for the dialog to register a new room',
  },
  registerRoomSubmitLabel: {
    id: 'components.rooms.registerRoomForm.registerRoomSubmitLabel',
    defaultMessage: 'Register room {name}',
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

const RegisterRoomForm = ({ onSuccess }: RegisterRoomFormProps) => {
  const intl = useIntl();
  const { values, setValue, isValid, errors, modified } = useFormState(
    { name: '' },
    { name: validators(intl, requiredValidator) },
  );
  const controller = useController();
  const queryClient = useQueryClient();
  const { mutate, isLoading } = useMutation(controller.registerRoom, {
    onSuccess: (data) => {
      queryClient.setQueryData('rooms', (rooms?: Room[]) => [...(rooms || []), data]);
      onSuccess();
    },
  });

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    mutate(values.name);
  };

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    event.preventDefault();
    setValue(event.target.name as keyof typeof values, event.target.value);
  };

  return (
    <form onSubmit={handleSubmit}>
      <Heading level="2" size="small" color="brand">
        {intl.formatMessage(messages.registerRoomDialogLabel)}
      </Heading>
      <TextField
        label={intl.formatMessage(messages.nameLabel)}
        name="name"
        value={values.name}
        onChange={handleChange}
        errors={errors.name}
        displayErrors={modified.name}
      />
      <Box direction="row" justify="end" margin={{ top: 'medium' }}>
        <LoadingButton
          type="submit"
          primary
          isLoading={isLoading}
          disabled={!isValid}
          label={intl.formatMessage(messages.registerRoomSubmitLabel, { name: values.name })}
        />
      </Box>
    </form>
  );
};

export default RegisterRoomForm;
