import * as React from 'react';
import { useEffect } from 'react';
import { useIntl } from 'react-intl';
import { setLocale } from 'yup';
import { validationMessages } from '../Messages';

export interface FormErrorsProps {}

export function FormErrors(props: FormErrorsProps) {
  const intl = useIntl();

  useEffect(() => {
    setLocale({
      mixed: {
        required: intl.formatMessage(validationMessages.required),
      },
    });
  }, []);

  return <></>;
}
