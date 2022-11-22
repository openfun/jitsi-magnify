import { Box, Spinner } from 'grommet';
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
  defaultLocale?: string;

  initTranslation?: boolean;
}

async function getTranslation(
  locale: string,
): Promise<Maybe<Record<string, string> | Record<string, MessageFormatElement[]>>> {
  let translatedMessages: Record<string, string> | Record<string, MessageFormatElement[]>;
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
  locale = MagnifyLocales.EN,
  defaultLocale = MagnifyLocales.EN,
  initTranslation = true,
}: TranslationProviderProps) {
  const [currentLocale, setCurrentLocale] = useState(
    localStorage.getItem(MAGNIFY_LOCALE_KEY) ?? locale,
  );
  const [translations, setTranslations] =
    useState<Maybe<Record<string, string> | Record<string, MessageFormatElement[]>>>(undefined);

  const updateLocale = (newLocale: string): void => {
    getTranslation(newLocale).then((translations) => {
      setTranslations(translations);
      setCurrentLocale(newLocale);
    });
  };

  const localeContext: LocaleContextInterface = useMemo(
    () => ({
      currentLocale: currentLocale,
      setCurrentLocale: (locale: string) => {
        localStorage.setItem(MAGNIFY_LOCALE_KEY, locale);
        updateLocale(locale);
      },
    }),
    [currentLocale],
  );

  useEffect(() => {
    if (!initTranslation) {
      return;
    }
    getTranslation(currentLocale).then(setTranslations);
  }, []);

  return (
    <LocaleContext.Provider value={localeContext}>
      <IntlProvider
        defaultLocale={defaultLocale}
        locale={currentLocale}
        messages={initTranslation ? translations : {}}
      >
        {(translations || !initTranslation) && children}
        {initTranslation && !translations && (
          <Box align={'center'} height={'100vh'} justify={'center'} width={'100vh'}>
            <Spinner />
          </Box>
        )}
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
