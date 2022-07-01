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
    <Box height="100vh" width="100%" background="light-1">
      <Box margin="auto" width="80%">
        <Card background="white" width="100%" margin={{ vertical: 'small' }} pad="large">
          {login ? <LoginForm /> : <SignupForm />}
        </Card>
        <Card
          background="white"
          width="100%"
          margin={{ vertical: 'small' }}
          pad={{ vertical: 'medium', horizontal: 'large' }}
        >
          <Text>
            {login ? (
              <>
                {intl.formatMessage(messages.youDoNotHaveAnAccount)}{' '}
                <Anchor
                  onClick={() => setLogin(false)}
                  role="link"
                  label={intl.formatMessage(messages.signupInstead)}
                />
              </>
            ) : (
              <>
                {intl.formatMessage(messages.youAlreadyHaveAnAccount)}{' '}
                <Anchor
                  onClick={() => setLogin(true)}
                  role="link"
                  label={intl.formatMessage(messages.loginInstead)}
                />
              </>
            )}
          </Text>
        </Card>
      </Box>
    </Box>
  );
}
