import { defineMessages } from 'react-intl';

export const validationMessages = defineMessages({
  required: {
    id: 'validationMessages.required',
    description: 'Messages shown when a field is required but the user did not provide any value',
    defaultMessage: 'This field is required',
  },
});
