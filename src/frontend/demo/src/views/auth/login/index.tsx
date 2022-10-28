import { AuthForms, LoginForm } from '@jitsi-magnify/core';
import * as React from 'react';
import { defineMessages, useIntl } from 'react-intl';
import { useNavigate } from 'react-router-dom';
import { AuthPath } from '../../../utils/routes/auth';

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
  const navigate = useNavigate();

  return (
    <AuthForms
      footerLabel={intl.formatMessage(authLoginViewMessages.youDoNotHaveAnAccount)}
      footerRedirect={() => navigate(AuthPath.REGISTER)}
      footerRouteLabel={intl.formatMessage(authLoginViewMessages.signupInstead)}
      isLogin={true}
    >
      <LoginForm />
    </AuthForms>
  );
}
