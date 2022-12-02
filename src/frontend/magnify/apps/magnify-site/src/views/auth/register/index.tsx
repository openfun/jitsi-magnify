import { AuthForms, SignupForm, useTranslations } from '@openfun/magnify-components';
import * as React from 'react';
import { defineMessages, useIntl } from 'react-intl';
import { useNavigate } from 'react-router-dom';
import { AuthPath } from '../../../utils/routes/auth';

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
  const intl = useTranslations();
  const navigate = useNavigate();
  return (
    <AuthForms
      footerLabel={intl.formatMessage(authRegisterViewMessages.youAlreadyHaveAnAccount)}
      footerRedirect={() => navigate(AuthPath.LOGIN)}
      footerRouteLabel={intl.formatMessage(authRegisterViewMessages.loginInstead)}
      isLogin={true}
    >
      <SignupForm />
    </AuthForms>
  );
}
