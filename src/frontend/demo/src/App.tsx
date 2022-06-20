import { defineMessages, FormattedMessage } from 'react-intl';
import { TestButton, TestButtonVariant } from '@jitsi-magnify/core';

export const messages = defineMessages({
  testTitle: {
    id: 'app.testTitle',
    description: 'H1 page title for the test',
    defaultMessage: 'Welcome to Magnify!',
  },
});

export default function App() {
  return (
    <>
      <h1>
        <FormattedMessage {...messages.testTitle} />
      </h1>
      <TestButton variant={TestButtonVariant.BLUE} />
    </>
  );
}