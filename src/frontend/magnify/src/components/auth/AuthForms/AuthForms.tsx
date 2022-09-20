import { Anchor, Box, Card, Text } from 'grommet';
import React from 'react';
import { defineMessages, useIntl } from 'react-intl';
import LoginForm from '../LoginForm';
import SignupForm from '../SignupForm';

const messages = defineMessages({
  youDoNotHaveAnAccount: {
    defaultMessage: 'You do not have an account?',
    description: 'The explanation for the link to the signup form',
    id: 'components.auth.authForm.youDoNotHaveAnAccount',
  },
  signupInstead: {
    defaultMessage: 'Signup instead',
    description: 'The text for the link to the signup form',
    id: 'components.auth.authForm.signupInstead',
  },
  youAlreadyHaveAnAccount: {
    defaultMessage: 'You already have an account?',
    description: 'The explanation for the link to the login form',
    id: 'components.auth.authForm.youAlreadyHaveAnAccount',
  },
  loginInstead: {
    defaultMessage: 'Login instead',
    description: 'The text for the link to the login form',
    id: 'components.auth.authForm.loginInstead',
  },
});

export default function AuthForms() {
  const intl = useIntl();
  const [login, setLogin] = React.useState(false);

  return (
    <Box background="light-1" height="100vh" width="100%">
      <Box margin="auto" width="80%">
        <Card background="white" margin={{ vertical: 'small' }} pad="large" width="100%">
          {login ? <LoginForm /> : <SignupForm />}
        </Card>
        <Card
          background="white"
          margin={{ vertical: 'small' }}
          pad={{ vertical: 'medium', horizontal: 'large' }}
          width="100%"
        >
          <Text>
            {login ? (
              <>
                {intl.formatMessage(messages.youDoNotHaveAnAccount)}{' '}
                <Anchor
                  label={intl.formatMessage(messages.signupInstead)}
                  onClick={() => setLogin(false)}
                  role="link"
                />
              </>
            ) : (
              <>
                {intl.formatMessage(messages.youAlreadyHaveAnAccount)}{' '}
                <Anchor
                  label={intl.formatMessage(messages.loginInstead)}
                  onClick={() => setLogin(true)}
                  role="link"
                />
              </>
            )}
          </Text>
        </Card>
      </Box>
    </Box>
  );
}
