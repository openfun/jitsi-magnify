import React from 'react';
import { IntlProvider, MessageFormatElement, useIntl } from 'react-intl';

export interface TranslationProviderProps {
  /**
   * The children to render.
   */
  children: React.ReactNode;
  /**
   * The current locale
   */
  locale: string;
  /**
   * The default locale
   */
  defaultLocale: string;
  /**
   * Messages for the current locale
   *
   * @see loadLocaleData to fetch messages for a given locale for this lib
   * You may need to merge it with your own project messages
   */
  messages: Record<string, string> | Record<string, MessageFormatElement[]> | undefined;
}

export default function TranslationProvider({
  children,
  locale,
  defaultLocale,
  messages,
}: TranslationProviderProps) {
  return (
    <IntlProvider defaultLocale={defaultLocale} locale={locale} messages={messages}>
      {children}
    </IntlProvider>
  );
}

export const useTranslations = useIntl;
