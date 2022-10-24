import React, { useEffect, useMemo, useState } from 'react';
import { IntlProvider, MessageFormatElement, useIntl } from 'react-intl';
import { Maybe } from '../../types/misc';
import { MAGNIFY_LOCALE_KEY, MagnifyLocales } from '../../utils';
import { loadLocaleData } from '../Loaders';

export interface TranslationProviderProps {
  /**
   * The children to render.
   */
  children: React.ReactNode;
  /**
   * The current locale
   */
  locale?: string;
  /**
   * The default locale
   */
  defaultLocale: string;
}

async function getTranslation(
  locale: string,
): Promise<Maybe<Record<string, string> | Record<string, MessageFormatElement[]>>> {
  let translatedMessages: Maybe<Record<string, string> | Record<string, MessageFormatElement[]>>;
  try {
    translatedMessages = await loadLocaleData(locale);
  } catch (error) {
    translatedMessages = {};
  }
  return translatedMessages;
}

export interface LocaleContextInterface {
  currentLocale: string;
  setCurrentLocale: (locale: string) => void;
}

const LocaleContext = React.createContext<Maybe<LocaleContextInterface>>(undefined);

export default function TranslationProvider({
  children,
  locale = MagnifyLocales.FR,
  defaultLocale,
}: TranslationProviderProps) {
  const [currentLocale, setCurrentLocale] = useState(
    localStorage.getItem(MAGNIFY_LOCALE_KEY) ?? locale,
  );
  const [translations, setTranslations] = useState<
    Maybe<Record<string, string> | Record<string, MessageFormatElement[]>>
  >({});

  const localeContext: LocaleContextInterface = useMemo(
    () => ({
      currentLocale: currentLocale,
      setCurrentLocale: (locale: string) => {
        localStorage.setItem(MAGNIFY_LOCALE_KEY, locale);
        setCurrentLocale(locale);
      },
    }),
    [currentLocale],
  );

  useEffect(() => {
    getTranslation(currentLocale).then((initTranslation) => {
      setTranslations(initTranslation ?? {});
    });
  }, [currentLocale]);

  return (
    <LocaleContext.Provider value={localeContext}>
      <IntlProvider defaultLocale={defaultLocale} locale={currentLocale} messages={translations}>
        {children}
      </IntlProvider>
    </LocaleContext.Provider>
  );
}

export const useTranslations = useIntl;

export const useLocale = () => {
  const localContext = React.useContext(LocaleContext);

  if (localContext) {
    return localContext;
  }

  throw new Error(`useLocale must be used within a LocaleContext`);
};
