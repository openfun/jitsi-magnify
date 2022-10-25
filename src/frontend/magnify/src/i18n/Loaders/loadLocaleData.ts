import { MessageFormatElement } from 'react-intl';

export default async function loadLocaleData(
  locale: string,
): Promise<Record<string, string> | Record<string, MessageFormatElement[]>> {
  if (locale === 'fr' || locale === 'fr-FR') {
    return (await import('../../translations/fr-FR.json'))?.default;
  }
  return {};
}
