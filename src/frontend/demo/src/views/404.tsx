import { Box, Text } from 'grommet';
import { defineMessages, useIntl } from 'react-intl';

const messages = defineMessages({
  notFoundMessage: {
    defaultMessage: 'We are sorry, the page you are looking for does not exist.',
    description: 'Message for the 404 page',
    id: 'app.notFoundMessage',
  },
  notFoundTitle: {
    defaultMessage: 'Page not found',
    description: 'Page title for the 404 page',
    id: 'app.notFoundTitle',
  },
});

export default function NotFoundView() {
  const intl = useIntl();
  return (
    <Box>
      <Text>{intl.formatMessage(messages.notFoundMessage)}</Text>
    </Box>
  );
}
