import { LayoutWithSidebar } from '@jitsi-magnify/core';
import { Box, Text } from 'grommet';
import { defineMessages, useIntl } from 'react-intl';

const messages = defineMessages({
  notFoundTitle: {
    id: 'app.notFoundTitle',
    description: 'Page title for the 404 page',
    defaultMessage: 'Page not found',
  },
  notFoundMessage: {
    id: 'app.notFoundMessage',
    description: 'Message for the 404 page',
    defaultMessage: 'We are sorry, the page you are looking for does not exist.',
  },
});

export default function NotFoundView() {
  const intl = useIntl();
  return (
    <LayoutWithSidebar title={intl.formatMessage(messages.notFoundTitle)}>
      <Box>
        <Text>{intl.formatMessage(messages.notFoundMessage)}</Text>
      </Box>
    </LayoutWithSidebar>
  );
}
