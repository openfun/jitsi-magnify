import * as React from 'react';
import { defineMessages, useIntl } from 'react-intl';
import { FormikSelect } from '../index';

type recurrence = 'daily' | 'weekly' | 'monthly' | 'yearly';

interface MeetingRecurrenceSelectOption {
  value?: recurrence;
  label: string;
}

const messages = defineMessages({
  noRecurrence: {
    defaultMessage: "Doesn't repeat itself",
    description: 'Define a non-recurrent meeting',
    id: 'components.design-system.Formik.Select.MeetingRecurrence.noRecurrence',
  },
  dailyRecurrence: {
    defaultMessage: 'Every day of the week',
    description: 'Define a daily meeting',
    id: 'components.design-system.Formik.Select.MeetingRecurrence.dailyRecurrence',
  },
  weeklyRecurrence: {
    defaultMessage: 'Every week',
    description: 'Define a weekly meeting',
    id: 'components.design-system.Formik.Select.MeetingRecurrence.weekyRecurrence',
  },
  monthlyRecurrence: {
    defaultMessage: 'Every month',
    description: 'Define a montlhy meeting',
    id: 'components.design-system.Formik.Select.MeetingRecurrence.monthlyRecurrence',
  },
  yearlyRecurrence: {
    defaultMessage: 'Every year',
    description: 'Define a yearly meeting',
    id: 'components.design-system.Formik.Select.MeetingRecurrence.yearlyRecurrence',
  },
});

export interface FormikSelectMeetingRecurrenceProps {
  changeCallback: (recurrence: string) => void;
}

function FormikSelectLanguage({ ...props }: FormikSelectMeetingRecurrenceProps) {
  const intl = useIntl();

  const getAllOptions = (): MeetingRecurrenceSelectOption[] => {
    return [
      { value: undefined, label: intl.formatMessage(messages.noRecurrence) },
      { value: 'daily', label: intl.formatMessage(messages.dailyRecurrence) },
      { value: 'weekly', label: intl.formatMessage(messages.weeklyRecurrence) },
      { value: 'monthly', label: intl.formatMessage(messages.monthlyRecurrence) },
      { value: 'yearly', label: intl.formatMessage(messages.yearlyRecurrence) },
    ];
  };

  return (
    <FormikSelect
      changeCallback={props.changeCallback}
      label={'meeting recurrence'}
      labelKey="label"
      name={'recurrence'}
      options={getAllOptions()}
      valueKey={{ key: 'value', reduce: true }}
    />
  );
}

export default FormikSelectLanguage;
