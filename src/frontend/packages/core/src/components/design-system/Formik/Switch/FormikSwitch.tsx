import { Switch } from '@openfun/cunningham-react';
import { useField } from 'formik';
import React, { useMemo } from 'react';

import { Maybe } from '../../../../types/misc';

type FormikSwitchProps = Parameters<typeof Switch>[0] & {
  name: string;
};

export const FormikSwitch = (props: FormikSwitchProps) => {
  const [field, meta] = useField(props.name);

  const inputState = useMemo((): Maybe<'success' | 'error'> => {
    if (!meta.touched) {
      return undefined;
    }

    return meta.error === undefined ? 'success' : 'error';
  }, [meta.error, meta.touched]);

  return (
    <Switch
      labelSide="right"
      {...field}
      {...props}
      checked={field.value}
      state={inputState}
      text={meta.error ?? props.text}
    />
  );
};
