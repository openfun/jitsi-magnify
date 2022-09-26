import {
  MagnifyPageContent,
  ResponsiveLayout,
  TestButton,
  TestButtonVariant,
  useTranslations,
} from '@jitsi-magnify/core';
import { defineMessages } from 'react-intl';

export const messages = defineMessages({
  testTitle: {
    defaultMessage: 'Welcome to Magnify!',
    description: 'Page title for the test',
    id: 'app.testTitle',
  },
});

export default function DefaultView() {
  const intl = useTranslations();
  return (
    <ResponsiveLayout>
      <MagnifyPageContent title={intl.formatMessage(messages.testTitle)}>
        <TestButton variant={TestButtonVariant.BLUE} />
      </MagnifyPageContent>
    </ResponsiveLayout>
  );
}
