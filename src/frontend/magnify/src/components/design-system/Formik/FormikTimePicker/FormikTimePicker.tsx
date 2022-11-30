/* eslint-disable react/no-unknown-property */
import { useField, useFormikContext } from 'formik';
import { Box, DropButton, Button, Text } from 'grommet';
import { Alert } from 'grommet-icons';
import { normalizeColor } from 'grommet/utils';
import React, { FunctionComponent, ReactElement, useState } from 'react';
import { defineMessages, useIntl } from 'react-intl';
import TimePicker, { TimePickerValue } from 'react-time-picker';
import { useTheme } from 'styled-components';

const messages = defineMessages({
  invalidTime: {
    defaultMessage: 'Input time is not valid: it should be set in the future.',
    description: 'Error message when event scheduling time update is in the past.',
    id: 'components.design-system.Formik.FormikTimePicker.invalidTime',
  },
});

export interface FormikTimePickerProps {
  name: string;
  isToday: boolean;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

const computeSuggestions = (): string[] => {
  let suggestions = ['00:00'];
  let minutes: string = '00';
  let hours: string = '00';

  while (`${hours}:${minutes}` < '23:45') {
    console.log(`${hours}:${minutes}`);
    if (minutes == '45') {
      hours = +hours >= 9 ? (+hours + 1).toString() : `0${(+hours + 1).toString()}`;
      minutes = '00';
    } else {
      minutes = (+minutes + 15).toString();
    }
    suggestions.push(`${hours}:${minutes}`);
  }
  return suggestions;
};

const allSuggestions = computeSuggestions();

interface suggestionButtonProps {
  buttonValue: string;
  choiceValue: string;
  onClick: (value: string) => void;
}

const SuggestionButton: FunctionComponent<suggestionButtonProps> = ({ ...props }): ReactElement => {
  const isChosenButton: boolean = props.buttonValue == props.choiceValue;
  const theme = useTheme();
  return (
    <Button
      color={isChosenButton ? `${normalizeColor('light-2', theme)}` : 'black'}
      fill={isChosenButton ? 'horizontal' : false}
      justify="center"
      margin={{ top: 'xsmall' }}
      primary={isChosenButton}
      onClick={() => {
        props.onClick(props.buttonValue);
      }}
    >
      <Box alignContent="center" alignSelf="center">
        <Text color="black" textAlign="center">
          {props.buttonValue}
        </Text>
      </Box>
    </Button>
  );
};

const FormikTimePicker: FunctionComponent<FormikTimePickerProps> = ({ ...props }) => {
  const [field] = useField(props.name);
  const formikContext = useFormikContext();
  const [open, setOpen] = useState<boolean | undefined>(undefined);
  const [timeError, setTimeError] = useState(false);
  const intl = useIntl();

  const onTimeChange = (value: TimePickerValue | string) => {
    const today = new Date();
    if (props.isToday && value < `${today.getHours()}:${today.getMinutes()}`) {
      setTimeError(true);
    } else {
      setTimeError(false);
      formikContext.setFieldValue(props.name, value);
    }
  };

  const onTimeSelectChange = (value: string) => {
    onTimeChange(value);
    setOpen(false);
  };

  const suggestionButtons = allSuggestions.map((value: string) => (
    <SuggestionButton
      key={value}
      buttonValue={value}
      choiceValue={field.value}
      onClick={onTimeSelectChange}
    />
  ));

  return (
    <Box align="start" pad="small">
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
        <TimePicker disableClock onChange={onTimeChange} value={field.value}></TimePicker>
      </DropButton>
      {timeError && (
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
            {intl.formatMessage(messages.invalidTime)}
          </Text>
        </Box>
      )}
    </Box>
  );
};

export default FormikTimePicker;
