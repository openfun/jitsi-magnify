import { defineMessages } from 'react-intl';

export const validationMessages = defineMessages({
  required: {
    id: 'validationMessages.required',
    description: 'Messages shown when a field is required but the user did not provide any value',
    defaultMessage: 'This field is required',
  },
  usernameInvalid: {
    id: 'validationMessages.usernameInvalid',
    description: 'Messages shown when the user provided an invalid username',
    defaultMessage:
      'Username is invalid, it should have between 3 and 16 letters, numbers or underscores',
  },
  emailInvalid: {
    defaultMessage: 'Email is invalid',
    description: 'The error message for the email field',
    id: 'validationMesssages.emailInvalid',
  },
  confirmDoesNotMatch: {
    defaultMessage: 'New password and its confirmation do not match',
    description: 'The error message for the confirm new password field',
    id: 'validationMesssages.confirmDoesNotMatch',
  },
});
