import { Form, useFormikContext } from 'formik';
import * as React from 'react';
import { PropsWithChildren, useEffect } from 'react';
import { useLocale } from '../../../../i18n/TranslationProvider/TranslationsProvider';

export const LocalizedForm = ({ children }: PropsWithChildren) => {
  const formik = useFormikContext();
  const locale = useLocale();
  useEffect(() => {
    formik.validateForm();
  }, [locale.currentLocale]);

  return <Form>{children}</Form>;
};
