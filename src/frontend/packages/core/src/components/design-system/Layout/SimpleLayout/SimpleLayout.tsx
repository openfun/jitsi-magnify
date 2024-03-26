import { Button } from '@openfun/cunningham-react';
import { Box, Image, Stack } from 'grommet';
import * as React from 'react';
import { PropsWithChildren } from 'react';
import { defineMessages } from 'react-intl';

import { useRouting } from '../../../../context';
import { useIsMobile } from '../../../../hooks/useIsMobile';
import { useTranslations } from '../../../../i18n';
import { KeycloakService } from '../../../../services';
import { ResponsiveLayoutHeaderAvatar } from '../Header';
import cover from './cover.svg';
import logotu from './logo-tu.svg'

interface Props {
  urlLogo: string;
}

const messages = defineMessages({
  logout: {
    defaultMessage: 'Logout',
    id: 'components.designSystem.layout.simpleLayout.logout',
    description: 'label to logout',
  },
  login: {
    defaultMessage: 'Log in',
    id: 'components.designSystem.layout.simpleLayout.login',
    description: 'label to login',
  },
  register: {
    defaultMessage: 'Create an account',
    id: 'components.designSystem.layout.simpleLayout.register',
    description: 'label to register',
  },
});

export const SimpleLayout = ({ urlLogo, ...props }: PropsWithChildren<Props>) => {
  const intl = useTranslations();
  const router = useRouting();
  const isLog = KeycloakService.isLoggedIn();
  const isMobile = useIsMobile();

  return (
    <>
      {!isMobile && (
        <Box height="100%" style={{ width: '50%', position: 'fixed', left: 0, top: 0 }}>
          <Box
            color="white"
            style={{ overflow: 'hidden', flex: 2, minWidth: '20rem' }}
          >
            <Box background="light-1" height="100%" width="100%">
              <Stack fill>
                <Box
                  height="100%"
                  width="100%"
                  style={{
                    background: `center no-repeat url(${logotu})`,
                  }}
                />
              </Stack>
            </Box>
          </Box>
        </Box>
      )}
      <Box
        background="light-1"
        height="100%"
        pad="4rem 2rem 2rem 2rem"
        style={{
          width: isMobile ? '100%' : '50%',
          marginLeft: isMobile ? '0%' : '50%',
          overflow: 'auto',
        }}
      >
        <div>
          <Box direction="row" style={{ gap: '20px', position: 'absolute', top: 20, right: 20 }}>
            {!isLog && (
              <>
                {window.config.MAGNIFY_SHOW_REGISTER_LINK && (
                  <Button color="secondary" onClick={() => router.goToRegister()} size="small">
                    {intl.formatMessage(messages.register)}
                  </Button>
                )}

                <Button color="primary" onClick={router.goToLogin} size="small">
                  {intl.formatMessage(messages.login)}
                </Button>
              </>
            )}

            {isLog && <ResponsiveLayoutHeaderAvatar />}
          </Box>
          <Box style={{ gap: '10px' }}>{props.children}</Box>
        </div>
      </Box>
    </>
  );
};
