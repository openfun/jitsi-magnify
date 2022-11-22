import * as React from 'react';
import { useIntl } from 'react-intl';
import { setLocale } from 'yup';
import { validationMessages } from '../Messages';

/**
 * Form Errors sets the default form error messages according to the language. For example,
 * required form fields.
 * It must be used inside a translation provider.
 */
export function FormErrors() {
  const intl = useIntl();
  setLocale({
    mixed: {
      required: intl.formatMessage(validationMessages.required),
    },
  });

  return null;
}
