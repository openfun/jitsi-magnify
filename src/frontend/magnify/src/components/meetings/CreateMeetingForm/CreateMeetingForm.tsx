import { Box, Button, Heading, Text } from 'grommet';
import React from 'react';
import { defineMessages, useIntl } from 'react-intl';
import { useMutation } from 'react-query';
import { useController } from '../../../controller';
import useFormState from '../../../hooks/useFormState';
import validators, { requiredValidator } from '../../../utils/validators';
import {
  ActivableButton,
  CalendarInput,
  Fieldset,
  LoadingButton,
  TextField,
} from '../../design-system';
import { formLabelMessages } from '../../../i18n/Messages/formLabelMessages';

export interface CreateMeetingFormProps {
  roomSlug?: string;
  onCancel?: () => void;
  onSuccess?: () => void;
}

const messages = defineMessages({
  createMeetingFormTitle: {
    id: 'components.meetings.CreateMeetingForm.createMeetingFormTitle',
    defaultMessage: 'Create Meeting',
    description: 'Title of the create meeting form',
  },
  datesLabel: {
    id: 'components.meetings.CreateMeetingForm.datesLabel',
    defaultMessage: 'Dates',
    description: 'Label for the dates field',
  },
  startTimeLabel: {
    id: 'components.meetings.CreateMeetingForm.startTimeLabel',
    defaultMessage: 'Start Time',
    description: 'Label for the start time field',
  },
  durationLabel: {
    id: 'components.meetings.CreateMeetingForm.durationLabel',
    defaultMessage: 'Duration',
    description: 'Label for the duration field',
  },
  daysLabel: {
    id: 'components.meetings.CreateMeetingForm.daysLabel',
    defaultMessage: 'Days',
    description: 'Label for the days field',
  },
  submitLabel: {
    id: 'components.meetings.CreateMeetingForm.submitLabel',
    defaultMessage: 'Create meeting',
    description: 'Label for the submit button',
  },
  cancelLabel: {
    id: 'components.meetings.CreateMeetingForm.cancelLabel',
    defaultMessage: 'Cancel',
    description: 'Label for the cancel button',
  },
});

const CreateMeetingForm = ({ roomSlug, onCancel, onSuccess }: CreateMeetingFormProps) => {
  const intl = useIntl();
  const controller = useController();
  const { mutate, isLoading } = useMutation(controller.createMeeting);
  const { values, setValue, isValid, isModified } = useFormState(
    {
      name: '',
      startDate: new Date(Date.now()).toISOString(),
      endDate: new Date(Date.now()).toISOString(),
      heldOnMonday: false as boolean,
      heldOnTuesday: false as boolean,
      heldOnWednesday: false as boolean,
      heldOnThursday: false as boolean,
      heldOnFriday: false as boolean,
      heldOnSaturday: false as boolean,
      heldOnSunday: false as boolean,
      startTime: '',
      expectedDuration: '60',
    },
    {
      name: validators(intl, requiredValidator),
    },
  );

  const handleSubmit = async () => {
    mutate(
      {
        roomSlug,
        ...values,
        expectedDuration: parseInt(values.expectedDuration, 10),
      },
      { onSuccess: onSuccess },
    );
  };

  return (
    <>
      <form>
        <Heading level={3} size="small" color="brand">
          {intl.formatMessage(messages.createMeetingFormTitle)}
        </Heading>
        <TextField
          name="name"
          label={intl.formatMessage(formLabelMessages.name)}
          value={values.name}
          onChange={(event) => setValue('name', event.target.value)}
          margin={{ vertical: 'small' }}
        />
        <CalendarInput
          label={intl.formatMessage(messages.datesLabel)}
          name="dates"
          value={[values.startDate, values.endDate]}
          onChange={(e) => {
            setValue('startDate', e.value[0]);
            setValue('endDate', e.value[1]);
          }}
          margin={{ vertical: 'small' }}
        />
        <TextField
          type="time"
          label={intl.formatMessage(messages.startTimeLabel)}
          name="startTime"
          value={values.startTime}
          onChange={(event) => setValue('startTime', event.target.value)}
          margin={{ vertical: 'small' }}
        />
        <TextField
          type="number"
          label={intl.formatMessage(messages.durationLabel)}
          name="expectedDuration"
          value={values.expectedDuration}
          onChange={(event) => setValue('expectedDuration', event.target.value)}
          margin={{ vertical: 'small' }}
        />
        <Fieldset label={intl.formatMessage(messages.daysLabel)} name="days">
          <Box direction="row" gap="small" align="center" margin={'small'} width="100%">
            {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'].map(
              (day) => {
                const dayKey = `heldOn${day}` as keyof typeof values;
                return (
                  <Box key={day} width="14.3%">
                    <ActivableButton
                      key={day}
                      active={values[dayKey] as boolean}
                      onClick={() => setValue(dayKey, !values[dayKey])}
                      label={
                        <Text
                          size="small"
                          margin="auto"
                          color={values[dayKey] ? 'light-1' : 'brand'}
                        >
                          {day}
                        </Text>
                      }
                      fill
                    />
                  </Box>
                );
              },
            )}
          </Box>
        </Fieldset>

        <Box justify="end" direction="row">
          {onCancel && (
            <Button
              label={intl.formatMessage(messages.cancelLabel)}
              onClick={onCancel}
              onFocus={(event: React.FocusEvent) => event.stopPropagation()}
              margin={{ right: 'small' }}
            />
          )}

          <LoadingButton
            primary
            isLoading={isLoading}
            label={intl.formatMessage(messages.submitLabel)}
            onClick={handleSubmit}
            disabled={!isModified || !isValid}
          />
        </Box>
      </form>
    </>
  );
};

export default CreateMeetingForm;
