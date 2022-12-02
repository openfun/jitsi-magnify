import { ErrorMessage, useField, useFormikContext } from 'formik';
import { DateInput, DropButton, Box, Text } from 'grommet';
import { CaretDown } from 'grommet-icons';
import { DateTime, Settings } from 'luxon';
import React, { FunctionComponent, useState } from 'react';
import { useIntl } from 'react-intl';
import TimePicker, { TimePickerValue } from 'react-time-picker';
import SuggestionButton from './SuggestionButton';

export interface formikDateTimePickerProps {
  dateName: string;
  timeName: string;
  frenchSuggestions: string[];
  localTimeSuggestions: string[];
  label: string;
}

const nextYear = new Date();
nextYear.setFullYear(new Date().getFullYear() + 1);

const FormikDateTimePicker: FunctionComponent<formikDateTimePickerProps> = ({ ...props }) => {
  const [open, setOpen] = useState<boolean | undefined>(undefined);
  const [dateField] = useField(props.dateName);
  const [timeField] = useField(props.timeName);

  const formikContext = useFormikContext();
  const intl = useIntl();
  Settings.defaultLocale = intl.locale;

  const isToday =
    DateTime.fromISO(dateField.value).toFormat('MM-dd-yyyy') ==
    DateTime.now().toFormat('MM-dd-yyyy');
  const beforeToday =
    DateTime.fromISO(dateField.value).toFormat('MM-dd-yyyy') <
    DateTime.now().toFormat('MM-dd-yyyy');

  const onTimeChange = (value: string | undefined) => {
    formikContext.setFieldValue(props.timeName, value ? value.toString() : undefined);
    setOpen(false);
  };

  const onDateChange = (event: { value: string | string[] }) => {
    let value: string;
    if (Array.isArray(event.value)) {
      value = '';
      if (event.value.length > 0) {
        value = event.value[0];
      }
    } else {
      value = event.value;
    }
    formikContext.setFieldValue(props.dateName, value);
  };

  React.useEffect(() => {
    console.log(formikContext.errors, formikContext.values);
  }, [formikContext.values, formikContext.errors]);

  const suggestionButtons = props.localTimeSuggestions.map((value: string, index: number) => (
    <SuggestionButton
      key={value}
      beforeToday={beforeToday}
      buttonValue={value}
      choiceValue={timeField.value}
      frenchButtonValue={props.frenchSuggestions[index]}
      isToday={isToday}
      onClick={onTimeChange}
    />
  ));

  return (
    <Box gap={'5px'}>
      {props.label != '' && (
        <label htmlFor={props.dateName}>
          <Text size={'xsmall'} weight={'bold'}>
            {props.label}
          </Text>
        </label>
      )}
      <div>
        <Box align="center" basis="1" direction="column" gap="small">
          <DateInput
            {...dateField}
            format={intl.locale === 'fr' ? 'jj/mm/aaaa' : 'yyyy/mm/dd'}
            name={props.dateName}
            onChange={onDateChange}
            calendarProps={{
              bounds: [new Date().toISOString(), nextYear.toISOString()],
              size: 'small',
            }}
          ></DateInput>

          <Box align="center" direction="row" gap="small">
            <TimePicker
              {...timeField}
              disableClock
              locale={intl.locale}
              name={props.timeName}
              onChange={(value: TimePickerValue) =>
                onTimeChange(value ? value.toString() : undefined)
              }
            ></TimePicker>
            <DropButton
              dropAlign={{ top: 'bottom' }}
              onClose={() => setOpen(false)}
              open={open}
              dropContent={
                <Box align="center" basis="small" direction="column" gap="5px">
                  {suggestionButtons}
                </Box>
              }
              onOpen={() => {
                setOpen(true);
              }}
            >
              <CaretDown size="15px" />
            </DropButton>
          </Box>
        </Box>
      </div>
    </Box>
  );
};

export default FormikDateTimePicker;
