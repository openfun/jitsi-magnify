import {
  LayoutWithSidebar,
  TestButton,
  TestButtonVariant,
  useTranslations,
} from '@jitsi-magnify/core';
import { defineMessages } from 'react-intl';

export const messages = defineMessages({
  testTitle: {
    id: 'app.testTitle',
    description: 'Page title for the test',
    defaultMessage: 'Welcome to Magnify!',
  },
});

export default function DefaultView() {
  const intl = useTranslations();
  return (
    <LayoutWithSidebar title={intl.formatMessage(messages.testTitle)}>
      <TestButton variant={TestButtonVariant.BLUE} />
    </LayoutWithSidebar>
  );
}
