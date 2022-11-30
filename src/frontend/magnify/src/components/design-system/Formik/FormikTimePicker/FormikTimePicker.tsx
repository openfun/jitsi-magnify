import { useField, useFormikContext } from 'formik';
import { Box, TextInput, ThemeContext, ThemeType } from 'grommet';
import { normalizeColor } from 'grommet/utils';
import React, { FunctionComponent, useState } from 'react';
import { useTheme } from 'styled-components';
import { ArrayHelper } from '../../../../utils/helpers/array';

export interface FormikTimePickerProps {
  name: string;
  isToday: boolean;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

const customTheme = (theme: ThemeType) => {
  return {
    global: {
      focus: {
        outline: {
          color: normalizeColor('brand', theme),
        },
      },
    },
  };
};

const computeFirstSuggestion = (isToday: boolean, suggestionsArray: string[]): number => {
  let result = null;

  if (isToday) {
    const today = new Date();
    const minuteQuarter = Math.floor(today.getMinutes() / 15);
    if (minuteQuarter != 3) {
      result = ArrayHelper.findElementIndex(
        suggestionsArray,
        `${today.getHours()}:${(minuteQuarter + 1) * 15}`,
      );
    } else {
      result = ArrayHelper.findElementIndex(suggestionsArray, `${today.getHours() + 1}:00`);
    }
  }
  let firstSuggestionIndex = result ? result : 0;
  return firstSuggestionIndex;
};

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

const FormikTimePicker: FunctionComponent<FormikTimePickerProps> = ({ ...props }) => {
  const [field] = useField(props.name);
  const formikContext = useFormikContext();
  const theme = useTheme();
  const [suggestions, setSuggestions] = useState(allSuggestions);

  const onTimeInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const nextValue = event.target.value;
    formikContext.setFieldValue(props.name, nextValue);
    if (!nextValue) setSuggestions(allSuggestions);
    else {
      const regexp = new RegExp(`^${nextValue}`);
      setSuggestions(allSuggestions.filter((s) => regexp.test(s)));
    }
  };

  const onTimeSelectChange = (event: { target: HTMLElement | null; suggestion: any }) => {
    const nextValue = event.suggestion;
    formikContext.setFieldValue(props.name, nextValue);
  };

  const firstSuggestion = computeFirstSuggestion(props.isToday, suggestions);

  return (
    <ThemeContext.Extend value={customTheme(theme)}>
      <Box>
        <TextInput
          defaultSuggestion={firstSuggestion}
          onChange={onTimeInputChange}
          onSuggestionSelect={onTimeSelectChange}
          placeholder={suggestions[firstSuggestion]}
          suggestions={suggestions}
          value={field.value}
        ></TextInput>
      </Box>
    </ThemeContext.Extend>
  );
};

export default FormikTimePicker;
