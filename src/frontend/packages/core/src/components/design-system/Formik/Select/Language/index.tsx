import * as React from 'react';
import { defineMessages, useIntl } from 'react-intl';
import { localesTranslations } from '../../../../../i18n/Messages/localesTranslations';
import { MagnifyLocales } from '../../../../../utils';
import { FormikSelect } from '../index';

const messages = defineMessages({
  languageLabel: {
    id: 'components.designSystem.formik.select.language.languageLabel',
    defaultMessage: 'language',
    description: 'Label for the language select label',
  },
});

interface LanguageSelectOption {
  value: string;
  label: string;
}

export interface FormikSelectLanguageProps {
  changeCallback: (locale: string) => void;
}

export const FormikSelectLanguage = ({ ...props }: FormikSelectLanguageProps) => {
  const intl = useIntl();

  const getAllOptions = (): LanguageSelectOption[] => {
    return [
      { value: MagnifyLocales.FR, label: intl.formatMessage(localesTranslations.fr) },
      { value: MagnifyLocales.EN, label: intl.formatMessage(localesTranslations.en) },
    ];
  };

  return (
    <FormikSelect
      changeCallback={props.changeCallback}
      clearable={false}
      fullWidth={true}
      label={intl.formatMessage(messages.languageLabel)}
      name={'language'}
      options={getAllOptions()}
    />
  );
};
