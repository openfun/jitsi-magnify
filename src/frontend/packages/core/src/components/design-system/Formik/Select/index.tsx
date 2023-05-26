import { Select } from '@openfun/cunningham-react';
import { useField } from 'formik';
import { Box } from 'grommet';
import * as React from 'react';
import { useMemo } from 'react';
import { Maybe } from '../../../../types/misc';

export type FormikSelectProps = Parameters<typeof Select>[0] & {
  name: string;
  label: string;
  changeCallback?: (option: any) => void;
};

export const FormikSelect = (props: FormikSelectProps) => {
  const [field, meta, helpers] = useField(props.name);

  const selectState = useMemo((): Maybe<'success' | 'error'> => {
    if (!meta.touched) {
      return undefined;
    }

    return meta.error === undefined ? 'success' : 'error';
  }, [meta.error, meta.touched]);

  return (
    <Box gap={'5px'}>
      <Select
        {...props}
        {...field}
        state={selectState}
        text={meta.error ?? props.text}
        onChange={(event) => {
          field.onChange(event.target.value);
          helpers.setValue(event.target.value, true);
          props.changeCallback?.(event.target.value);
        }}
      />
    </Box>
  );
};
