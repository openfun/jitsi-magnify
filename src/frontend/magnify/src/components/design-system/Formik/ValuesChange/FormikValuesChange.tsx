import * as React from 'react';
import { FunctionComponent } from 'react';
import { Form, useFormikContext } from 'formik';
import { useDebouncedCallback } from 'use-debounce';

interface FormikValuesChangeProps {
  debounceTime?: number;
  enableSubmit?: boolean;
  children?: React.ReactNode;
}

export const FormikValuesChange: FunctionComponent<FormikValuesChangeProps> = ({debounceTime = 800, ...props }) => {
  const formik = useFormikContext();
  const onValuesChange = useDebouncedCallback(() => {
    if (props.enableSubmit == null || props.enableSubmit) {
      formik.handleSubmit();
    }
  }, debounceTime);

  React.useEffect(() => {
    if (!formik.dirty) {
      return;
    }

    onValuesChange();
  }, [formik.dirty]);

  return <Form>{props.children}</Form>;
};
