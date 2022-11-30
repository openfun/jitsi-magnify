import { useField, useFormikContext } from 'formik';
import { DateInput, Box, Text, ThemeContext, ThemeType } from 'grommet';
import { Alert } from 'grommet-icons';
import { normalizeColor } from 'grommet/utils';
import React, { useState, FunctionComponent } from 'react';
import { defineMessages, useIntl } from 'react-intl';
import { useTheme } from 'styled-components';

const messages = defineMessages({
  invalidStartingAt: {
    defaultMessage: 'Input date is not valid: Starting date should be set in the future.',
    description: 'Error message when event scheduling date time update is in the past.',
    id: 'components.design-system.Formik.FormikDatePicker.invalidStartingAt',
  },
});

const customDateInputTheme = (theme: ThemeType) => {
  return {
    dateInput: {
      container: {
        background: normalizeColor('light-2', theme),
        round: 'medium',
      },
    },
    calendar: {
      day: { extend: () => `border-radius: 2em; color: brand` },
      extend: `border-radius: 1em; padding: 1em`,
    },
    maskedInput: {
      extend: `font-family: roboto`,
    },
  };
};

export interface formikDatePickerProps {
  name: string;
  onChange: (date: string) => void;
}

const nextYear = new Date();
nextYear.setFullYear(new Date().getFullYear() + 1);
const today = new Date();
today.setHours(0, 0, 0, 0);

const FormikDatePicker: FunctionComponent<formikDatePickerProps> = ({ ...props }) => {
  const [field] = useField(props.name);
  const [startingAtError, setStartingAtError] = useState(false);

  const formikContext = useFormikContext();
  const intl = useIntl();

  const theme = useTheme();
  const onDateChange = (event: { value: string | string[] }) => {
    setStartingAtError(false);
    let value: string;
    if (Array.isArray(event.value)) {
      value = '';
      if (event.value.length > 0) {
        value = event.value[0];
      }
    } else {
      value = event.value;
    }
    setStartingAtError(value != '' && value < today.toISOString());
    formikContext.setFieldValue(props.name, value);
  };

  return (
    <ThemeContext.Extend value={customDateInputTheme(theme)}>
      <Box>
        <DateInput
          format={intl.locale === 'fr' ? 'jj/mm/aaaa' : 'yyyy/mm/dd'}
          name={props.name}
          onChange={onDateChange}
          value={field.value}
          calendarProps={{
            bounds: [new Date().toISOString(), nextYear.toISOString()],
            size: 'small',
          }}
        ></DateInput>
        {startingAtError && (
          <Box
            align="center"
            background="#ffcccb"
            direction="row"
            gap="8px"
            margin={{ top: 'small' }}
            pad="8px"
            round="small"
          >
            <Alert color="status-critical" size="medium" />
            <Text color="status-critical" size="small">
              {intl.formatMessage(messages.invalidStartingAt)}
            </Text>
          </Box>
        )}
      </Box>
    </ThemeContext.Extend>
  );
};

export default FormikDatePicker;
