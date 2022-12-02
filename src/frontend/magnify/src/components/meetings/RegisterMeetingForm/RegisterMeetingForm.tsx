import { useMutation, useQueryClient } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import { Form, Formik, FormikHelpers } from 'formik';
import { Box } from 'grommet';
import { DateTime, Settings } from 'luxon';
import React, { useMemo } from 'react';
import { defineMessages, useIntl } from 'react-intl';
import * as Yup from 'yup';
import { formLabelMessages } from '../../../i18n/Messages/formLabelMessages';
import { MeetingsRepository } from '../../../services';
import { Meeting } from '../../../types';
import { Maybe } from '../../../types/misc';
import { MagnifyQueryKeys } from '../../../utils/constants/react-query';
import FormikDateTimePicker from '../../design-system/Formik/FormikDateTimePicker';
import { mergeDateTime } from '../../design-system/Formik/FormikDateTimePicker/utils';
import FormikInput from '../../design-system/Formik/Input';
import { FormikSubmitButton } from '../../design-system/Formik/SubmitButton/FormikSubmitButton';
import { getSuggestions } from './utils';

const messages = defineMessages({
  namePlaceholder: {
    id: 'components.meetings.registerMeetingForm.namePlaceholder',
    defaultMessage: 'Meeting name (ex: Biology 101)',
    description: 'Placeholder for the name field',
  },
  registerMeetingDialogLabel: {
    id: 'components.meetings.registerMeetingForm.registerMeetingDialogLabel',
    defaultMessage: 'Register new meeting',
    description: 'Label for the dialog to register a new meeting',
  },
  registerMeetingSubmitLabel: {
    id: 'components.meeting.registerMeetingForm.registerMeetingSubmitLabel',
    defaultMessage: 'Register meeting',
    description: 'Label for the submit button to register a new meeting',
  },
  invalidTime: {
    defaultMessage:
      'Starting time should be in the future and ending time should be after starting time.',
    description: 'Error message when event scheduling date time update is in the past.',
    id: 'components.design-system.Formik.FormikDateTimePicker.invalidTime',
  },
});

export interface RegisterMeetingFormProps {
  /**
   * Function to call when the form is successfully submited,
   * after the request to register the meeting has succeeded
   */
  onSuccess: (meeting?: Meeting) => void;
}

export interface RegisterMeetingFormValues {
  name: string;
  startDate: string | undefined;
  startTime: string | undefined;
  endDate: string | undefined;
  endTime: string | undefined;
}

interface FormErrors {
  slug?: string[];
}

const RegisterMeetingForm = ({ onSuccess }: RegisterMeetingFormProps) => {
  const intl = useIntl();
  Settings.defaultLocale = intl.locale;

  const startTimeTestOptions: Yup.TestConfig<string | undefined> = {
    name: 'startDateTimeIsAfterOrNow',
    test: function (startTimeValue: string | undefined) {
      const nullableStartTimeValue = startTimeValue == undefined ? null : startTimeValue;
      const chosenStartDateTime = this.parent
        ? mergeDateTime(this.parent.startDate, nullableStartTimeValue)
        : null;
      const chosenEndDateTime = this.parent
        ? mergeDateTime(this.parent.endDate, this.parent.endTime)
        : null;
      return (
        chosenStartDateTime == null ||
        (chosenStartDateTime >= DateTime.local().toISO() &&
          (chosenEndDateTime == null || chosenStartDateTime <= chosenEndDateTime))
      );
    },
    message: intl.formatMessage(messages.invalidTime),
    exclusive: true,
  };

  const endTimeTestOptions: Yup.TestConfig<string | undefined> = {
    name: 'endDateTimeIsAfterOrStartDate',
    test: function (endTimeValue: string | undefined) {
      const nullableEndTimeValue = endTimeValue == undefined ? null : endTimeValue;
      const chosenStartDateTime = this.parent
        ? mergeDateTime(this.parent.startDate, this.parent.startTime)
        : null;
      const chosenEndDateTime = this.parent
        ? mergeDateTime(this.parent.endDate, nullableEndTimeValue)
        : null;
      return (
        chosenEndDateTime == null ||
        (chosenEndDateTime >= DateTime.local().toISO() &&
          (chosenStartDateTime == null || chosenStartDateTime <= chosenEndDateTime))
      );
    },
    message: intl.formatMessage(messages.invalidTime),
    exclusive: true,
  };

  const validationSchema = Yup.object().shape({
    name: Yup.string().required(),
    startDate: Yup.string().required(),
    endDate: Yup.string().required(),
    startTime: Yup.string().required().test(startTimeTestOptions),
    endTime: Yup.string().required().test(endTimeTestOptions),
  });
  const queryClient = useQueryClient();

  const mutation = useMutation<Meeting, AxiosError, RegisterMeetingFormValues>(
    MeetingsRepository.create,
    {
      onSuccess: (newMeeting) => {
        queryClient.setQueryData([MagnifyQueryKeys.MEETINGS], (meetings: Meeting[] = []) => {
          return [...meetings, newMeeting];
        });
        onSuccess(newMeeting);
      },
    },
  );

  const allSuggestions = getSuggestions(intl.locale);
  const allFrenchSuggestions = getSuggestions('fr');

  const initialValues: RegisterMeetingFormValues = useMemo(
    () => ({
      name: '',
      startDate: undefined,
      endDate: undefined,
      startTime: undefined,
      endTime: undefined,
    }),
    [],
  );

  const handleSubmit = (
    values: RegisterMeetingFormValues,
    actions: FormikHelpers<RegisterMeetingFormValues>,
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
      {({ errors, touched }) => (
        <Form>
          <Box gap="5px">
            <FormikInput
              label={intl.formatMessage(formLabelMessages.name)}
              name={'name'}
              placeholder={intl.formatMessage(messages.namePlaceholder)}
            />
            <Box direction="row" gap="small">
              <FormikDateTimePicker
                dateName="startDate"
                frenchSuggestions={allFrenchSuggestions}
                label={intl.formatMessage(formLabelMessages.meetingStartDateTime)}
                localTimeSuggestions={allSuggestions}
                timeName="startTime"
              ></FormikDateTimePicker>
              <FormikDateTimePicker
                dateName="endDate"
                frenchSuggestions={allFrenchSuggestions}
                label={intl.formatMessage(formLabelMessages.meetingEndDateTime)}
                localTimeSuggestions={allSuggestions}
                timeName="endTime"
              ></FormikDateTimePicker>
            </Box>
          </Box>

          {errors.startDate && touched.startDate ? <div>{errors.startDate}</div> : null}
          {touched.endDate && errors.endDate ? <div>{errors.endDate}</div> : null}
          {touched.startTime && errors.startTime ? <div>{errors.startTime}</div> : null}
          {touched.endTime && errors.endTime ? <div>{errors.endTime}</div> : null}

          <FormikSubmitButton
            isLoading={mutation.isLoading}
            label={intl.formatMessage(messages.registerMeetingSubmitLabel)}
          />
        </Form>
      )}
    </Formik>
  );
};

export default RegisterMeetingForm;
