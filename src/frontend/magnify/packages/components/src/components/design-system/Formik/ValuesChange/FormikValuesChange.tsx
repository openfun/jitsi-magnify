import { Form, useFormikContext } from 'formik';
import * as React from 'react';
import { FunctionComponent } from 'react';
import { useDebouncedCallback } from 'use-debounce';

interface FormikValuesChangeProps {
  debounceTime?: number;
  enableSubmit?: boolean;
  children?: React.ReactNode;
  forceToSubmit?: boolean;
}

export const FormikValuesChange: FunctionComponent<FormikValuesChangeProps> = ({
  debounceTime = 800,
  enableSubmit = true,
  ...props
}) => {
  const formik = useFormikContext();
  const onValuesChange = useDebouncedCallback(() => {
    if (enableSubmit) {
      formik.handleSubmit();
    }
  }, debounceTime);

  React.useEffect(() => {
    onValuesChange();
  }, [formik.values]);

  return <Form>{props.children}</Form>;
};
