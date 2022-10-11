import * as React from 'react';
import { defineMessages, useIntl } from 'react-intl';
import { AuthForms, LoginForm } from '../../../components';

export const authLoginViewMessages = defineMessages({
  youDoNotHaveAnAccount: {
    defaultMessage: 'You do not have an account?',
    description: 'The explanation for the link to the signup form',
    id: 'views.auth.login.youDoNotHaveAnAccount',
  },
  signupInstead: {
    defaultMessage: 'Signup instead',
    description: 'The text for the link to the signup form',
    id: 'views.auth.login.signupInstead',
  },
});

export function AuthLoginView() {
  const intl = useIntl();
  return (
    <AuthForms
      footerLabel={intl.formatMessage(authLoginViewMessages.youDoNotHaveAnAccount)}
      footerRoute={'/auth/register'}
      footerRouteLabel={intl.formatMessage(authLoginViewMessages.signupInstead)}
      isLogin={true}
    >
      <LoginForm />
    </AuthForms>
  );
}
