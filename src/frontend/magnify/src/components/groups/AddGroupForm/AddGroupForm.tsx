import { defineMessages, useIntl } from 'react-intl';
import React from 'react';
import { useController } from '../../../controller';
import { useMutation, useQueryClient } from 'react-query';
import { Group } from '../../../types/group';
import useFormState from '../../../hooks/useFormState';
import validators, { requiredValidator } from '../../../utils/validators';
import { Box, Button, Heading } from 'grommet';
import { LoadingButton, TextField } from '../../design-system';

export interface AddGroupFormProps {
  onSuccess?: () => void;
  onCancel?: () => void;
}

const messages = defineMessages({
  addGroupTitle: {
    id: 'components.groups.AddGroupForm.addGroupTitle',
    description: 'Add group heading label',
    defaultMessage: 'Add group',
  },
  addGroupButtonLabel: {
    id: 'components.groups.AddGroupForm.addGroupButtonLabel',
    description: 'Add group button label',
    defaultMessage: 'Add group {name}',
  },
  name: {
    id: 'components.groups.AddGroupForm.name',
    description: 'Group name label',
    defaultMessage: 'Name',
  },
  cancel: {
    id: 'components.groups.AddGroupForm.cancel',
    description: 'Cancel button label',
    defaultMessage: 'Cancel',
  },
});

const AddGroupForm = ({ onSuccess, onCancel }: AddGroupFormProps) => {
  const intl = useIntl();
  const controller = useController();
  const queryClient = useQueryClient();
  const { mutate, isLoading } = useMutation(controller.createGroup, {
    onSuccess: (data) => {
      queryClient.setQueryData('groups', (groups?: Group[]) => [...(groups || []), data]);
      onSuccess?.();
    },
  });
  const { values, setValue, errors, modified, isValid, isModified } = useFormState(
    { name: '' },
    { name: validators(intl, requiredValidator) },
  );

  return (
    <Box pad="medium">
      <Heading level={3}>{intl.formatMessage(messages.addGroupTitle)}</Heading>

      <TextField
        name="name"
        label={intl.formatMessage(messages.name)}
        value={values.name}
        onChange={(event) => setValue('name', event.target.value)}
        errors={errors.name}
        displayErrors={modified.name}
      />

      <Box margin={{ top: 'small' }} justify="end" direction="row" gap="small">
        <Button onClick={() => onCancel?.()} label={intl.formatMessage(messages.cancel)} />
        <LoadingButton
          primary
          disabled={!isModified || !isValid}
          onClick={() => mutate(values)}
          label={intl.formatMessage(messages.addGroupButtonLabel, { name: values.name })}
          isLoading={isLoading}
        />
      </Box>
    </Box>
  );
};

export default AddGroupForm;
