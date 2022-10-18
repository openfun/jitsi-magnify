import * as React from 'react';
import { defineMessages, useIntl } from 'react-intl';
import { AuthForms, SignupForm } from '../../../components';
import { useRouting } from '../../../context/routing';

const authRegisterViewMessages = defineMessages({
  youAlreadyHaveAnAccount: {
    defaultMessage: 'You already have an account?',
    description: 'The explanation for the link to the login form',
    id: 'views.auth.register.youAlreadyHaveAnAccount',
  },
  loginInstead: {
    defaultMessage: 'Login instead',
    description: 'The text for the link to the login form',
    id: 'views.auth.register.loginInstead',
  },
});

export function AuthRegisterView() {
  const intl = useIntl();
  const routing = useRouting();
  return (
    <AuthForms
      footerLabel={intl.formatMessage(authRegisterViewMessages.youAlreadyHaveAnAccount)}
      footerRedirect={routing.goToLogin}
      footerRouteLabel={intl.formatMessage(authRegisterViewMessages.loginInstead)}
      isLogin={true}
    >
      <SignupForm />
    </AuthForms>
  );
}
