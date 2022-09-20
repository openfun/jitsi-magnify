import { Box, Button, Heading, Text } from 'grommet';
import React from 'react';
import { defineMessages, useIntl } from 'react-intl';
import { useMutation } from 'react-query';
import { useController } from '../../../controller';
import useFormState from '../../../hooks/useFormState';
import { formLabelMessages } from '../../../i18n/Messages/formLabelMessages';
import validators, { requiredValidator } from '../../../utils/validators';
import {
  ActivableButton,
  CalendarInput,
  Fieldset,
  LoadingButton,
  TextField,
} from '../../design-system';

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
        <Heading color="brand" level={3} size="small">
          {intl.formatMessage(messages.createMeetingFormTitle)}
        </Heading>
        <TextField
          label={intl.formatMessage(formLabelMessages.name)}
          margin={{ vertical: 'small' }}
          name="name"
          onChange={(event) => setValue('name', event.target.value)}
          value={values.name}
        />
        <CalendarInput
          label={intl.formatMessage(messages.datesLabel)}
          margin={{ vertical: 'small' }}
          name="dates"
          value={[values.startDate, values.endDate]}
          onChange={(e) => {
            setValue('startDate', e.value[0]);
            setValue('endDate', e.value[1]);
          }}
        />
        <TextField
          label={intl.formatMessage(messages.startTimeLabel)}
          margin={{ vertical: 'small' }}
          name="startTime"
          onChange={(event) => setValue('startTime', event.target.value)}
          type="time"
          value={values.startTime}
        />
        <TextField
          label={intl.formatMessage(messages.durationLabel)}
          margin={{ vertical: 'small' }}
          name="expectedDuration"
          onChange={(event) => setValue('expectedDuration', event.target.value)}
          type="number"
          value={values.expectedDuration}
        />
        <Fieldset label={intl.formatMessage(messages.daysLabel)} name="days">
          <Box align="center" direction="row" gap="small" margin={'small'} width="100%">
            {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'].map(
              (day) => {
                const dayKey = `heldOn${day}` as keyof typeof values;
                return (
                  <Box key={day} width="14.3%">
                    <ActivableButton
                      key={day}
                      fill
                      active={values[dayKey] as boolean}
                      onClick={() => setValue(dayKey, !values[dayKey])}
                      label={
                        <Text
                          color={values[dayKey] ? 'light-1' : 'brand'}
                          margin="auto"
                          size="small"
                        >
                          {day}
                        </Text>
                      }
                    />
                  </Box>
                );
              },
            )}
          </Box>
        </Fieldset>

        <Box direction="row" justify="end">
          {onCancel && (
            <Button
              label={intl.formatMessage(messages.cancelLabel)}
              margin={{ right: 'small' }}
              onClick={onCancel}
              onFocus={(event: React.FocusEvent) => event.stopPropagation()}
            />
          )}

          <LoadingButton
            primary
            disabled={!isModified || !isValid}
            isLoading={isLoading}
            label={intl.formatMessage(messages.submitLabel)}
            onClick={handleSubmit}
          />
        </Box>
      </form>
    </>
  );
};

export default CreateMeetingForm;
