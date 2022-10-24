import { useField, useFormikContext } from 'formik';
import { Box, Select, SelectProps, Text } from 'grommet';
import * as React from 'react';

export interface FormikSelectProps extends SelectProps {
  name: string;
  label: string;
  changeCallback?: (option: any) => void;
}

export const FormikSelect = (props: FormikSelectProps) => {
  const [field] = useField(props.name);
  const formikContext = useFormikContext();

  return (
    <Box gap={'5px'}>
      <label htmlFor={props.name}>
        <Text size={'xsmall'} weight={'bold'}>
          {props.label}
        </Text>
      </label>
      <Select
        size={'small'}
        {...props}
        {...field}
        onChange={(event) => {
          field.onChange(event);
          props.changeCallback?.(event.option.value);
        }}
      />
    </Box>
  );
};
