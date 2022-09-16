import * as React from 'react';
import { ChangeEvent, FunctionComponent } from 'react';
import { useField, useFormikContext } from 'formik';
import Toggle, { ToggleProps } from '../../Toggle';

export interface FormikSwitchProps extends ToggleProps {
  name: string;
}

const FormikSwitch: FunctionComponent<FormikSwitchProps> = ({ ...props }) => {
  const [field] = useField(props.name);
  const formikContext = useFormikContext();

  const onChange = (event: ChangeEvent<HTMLInputElement>): void => {
    formikContext.setFieldValue(props.name, event.target.checked);
  };

  return (
    <Toggle {...field} {...props} checked={field.value} variant="primary" onChange={onChange} />
  );
};

export default FormikSwitch;
