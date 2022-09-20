import { Box } from 'grommet';
import React, { useEffect } from 'react';
import { defineMessages, useIntl } from 'react-intl';
import { useQuery } from 'react-query';
import { ConnexionStatus, useController, useStore } from '../../../controller';

const messages = defineMessages({
  loading: {
    id: 'components.auth.AuthGard.loading',
    description: 'The message displayed while the login is loading',
    defaultMessage: 'Loading...',
  },
  redirecting: {
    id: 'components.auth.AuthGard.redirecting',
    description: 'The message displayed while the user is redirected to the login page or the app',
    defaultMessage: 'Redirecting...',
  },
});

export default function AuthGard() {
  const intl = useIntl();
  const controller = useController();
  const { connexionStatus, setConnexionStatus } = useStore();

  // This query act as a witness for the connexion status
  // If it succeed, the user is logged in. If it fails, we
  // can retry after having refreshed the token.
  // If it still fails, the user is not logged in.
  useQuery('profile', controller.getMyProfile);

  // If at any time the component is recreated (in dev mode, it happens often),
  // We want to make sure the connexion status is up to date
  useEffect(() => {
    if (controller._jwt) {
      setConnexionStatus(ConnexionStatus.CONNECTED);
    }
  }, []);

  // While we are not sure if the user is connected, make him wait
  return (
    <Box align="center" height="100vh" justify="center" width="100vw">
      {connexionStatus === ConnexionStatus.CONNECTING
        ? intl.formatMessage(messages.loading)
        : intl.formatMessage(messages.redirecting)}
    </Box>
  );
}
