import * as React from 'react';
import { useIntl } from 'react-intl';
import { localesTranslations } from '../../../../../i18n/Messages/localesTranslations';
import { MagnifyLocales } from '../../../../../utils';
import { FormikSelect } from '../index';

interface LanguageSelectOption {
  value: string;
  label: string;
}

export interface FormikSelectLanguageProps {
  changeCallback: (locale: string) => void;
}

function FormikSelectLanguage({ ...props }: FormikSelectLanguageProps) {
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
      label={'language'}
      labelKey="label"
      name={'language'}
      options={getAllOptions()}
      valueKey={{ key: 'value', reduce: true }}
    />
  );
}

export default FormikSelectLanguage;
