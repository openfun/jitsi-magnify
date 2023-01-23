import { defineMessages } from 'react-intl';

export const commonMessages = defineMessages({
  back: {
    id: 'i18n.commonMessages.back',
    description: 'Back message',
    defaultMessage: 'Back',
  },
  error: {
    id: 'i18n.commonMessages.error',
    description: 'Error label',
    defaultMessage: 'Error',
  },
  requestError: {
    id: 'i18n.commonMessages.requestError',
    description: 'Default error message when a request fail',
    defaultMessage: 'An error has occurred, please try again or refresh the page',
  },
});
