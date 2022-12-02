import { faker } from '@faker-js/faker';
import { Form, Formik } from 'formik';
import { Box } from 'grommet';
import { DateTime, Settings } from 'luxon';
import React, { useMemo } from 'react';
import { defineMessages, useIntl } from 'react-intl';
import * as Yup from 'yup';
import { AnyObject, Assign, ObjectShape, TypeOfShape } from 'yup/lib/object';
import { RequiredStringSchema } from 'yup/lib/string';
import { formLabelMessages } from '../../../i18n/Messages/formLabelMessages';
import { Meeting } from '../../../types';
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
    defaultMessage: 'Invalid time inputs',
    description: 'Error message when time inputs are invalid.',
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

interface meetingFormValidationSchema {
  name: RequiredStringSchema<string | undefined>;
  startDate: RequiredStringSchema<string | undefined>;
  endDate: RequiredStringSchema<string | undefined>;
  startTime: RequiredStringSchema<string | undefined>;
  endTime: RequiredStringSchema<string | undefined>;
}

// interface FormErrors {
//   slug?: string[];
// }

const RegisterMeetingForm = ({ onSuccess }: RegisterMeetingFormProps) => {
  const intl = useIntl();
  Settings.defaultLocale = intl.locale;

  const globalDateInputValidation: Yup.TestConfig<
    TypeOfShape<Assign<ObjectShape, meetingFormValidationSchema>>,
    AnyObject
  > = {
    name: 'dateInputsShouldBeValid',
    test: function (values, context) {
      const chosenStartDateTime = mergeDateTime(values['startDate'], values['startTime']);
      const chosenEndDateTime = mergeDateTime(values['endDate'], values['endTime']);
      if (
        chosenStartDateTime == undefined ||
        (chosenStartDateTime >= DateTime.local().toISO() &&
          (chosenEndDateTime == undefined || chosenStartDateTime <= chosenEndDateTime))
      )
        return true;
      else {
        return context.createError({
          path: 'startDate',
          message: intl.formatMessage(messages.invalidTime),
        });
      }
    },
    exclusive: true,
  };

  const validationSchema = Yup.object()
    .shape({
      name: Yup.string().required(),
      startDate: Yup.string().required(),
      endDate: Yup.string().required(),
      startTime: Yup.string().required(),
      endTime: Yup.string().required(),
    })
    .test(globalDateInputValidation);

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

  const handleSubmit = (values: RegisterMeetingFormValues) => {
    try {
      const oldMeetings: string | null = localStorage.getItem('meetings');
      const id = faker.datatype.uuid();
      const startDateTime = mergeDateTime(values.startDate, values.startTime);
      const endDateTime = mergeDateTime(values.endDate, values.endTime);

      const newMeeting: Meeting = {
        id: id,
        name: values.name,
        startDateTime: startDateTime
          ? DateTime.fromISO(startDateTime).toUTC().toISO()
          : DateTime.now().toUTC().toISO(),
        endDateTime: endDateTime
          ? DateTime.fromISO(endDateTime).toUTC().toISO()
          : DateTime.now().toUTC().toISO(),
        jitsi: {
          room: `${id}`,
          token: `${faker.datatype.number({ min: 0, max: 1000 })}`,
        },
      };
      if (oldMeetings) {
        localStorage.setItem('meetings', JSON.stringify([...JSON.parse(oldMeetings), newMeeting]));
      } else {
        localStorage.setItem('meetings', JSON.stringify([newMeeting]));
      }
      onSuccess(newMeeting);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <Formik
      initialValues={initialValues}
      onSubmit={handleSubmit}
      validationSchema={validationSchema}
    >
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

        <FormikSubmitButton
          // isLoading={mutation.isLoading}
          label={intl.formatMessage(messages.registerMeetingSubmitLabel)}
        />
      </Form>
    </Formik>
  );
};

export default RegisterMeetingForm;
