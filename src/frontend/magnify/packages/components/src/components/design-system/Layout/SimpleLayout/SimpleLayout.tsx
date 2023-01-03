import { Box, Button, Image, Stack, Text } from 'grommet';
import * as React from 'react';
import { Fragment, PropsWithChildren } from 'react';
import { defineMessages } from 'react-intl';

import { useRouting } from '../../../../context';
import { useIsMobile } from '../../../../hooks/useIsMobile';
import { useTranslations } from '../../../../i18n';
import { KeycloakService } from '../../../../services';
import { ResponsiveLayoutHeaderAvatar } from '../Header';
import cover from './cover.svg';

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
    <Box direction={'row'}>
      {!isMobile && (
        <Box
          background={'linear-gradient(45deg, #ffbdc9 0%, #687fc9 100%)'}
          color={'white'}
          height={'100vh'}
          pad={'2rem'}
          style={{ overflow: 'hidden', flex: 2, minWidth: '20rem' }}
        >
          <Box background={'light-5'} height={'100%'} width={'100%'}>
            <Stack fill>
              <Box
                background={'linear-gradient(45deg, #ffbdc9 0%, #687fc9 100%)'}
                height="100%"
                width="100%"
              />
              <Box direction="column" height="100%" justify="between">
                <Box flex={{ grow: 1 }} height={{ max: '33vh' }} justify="center" margin="auto 25%">
                  <Image alt="logo" src={urlLogo} />
                </Box>
                <Box flex={{ grow: 2 }} height={{ max: '66vh' }} justify={'end'}>
                  <Image alt="illustration" src={cover} width="100%" />
                </Box>
              </Box>
            </Stack>
          </Box>
        </Box>
      )}

      <Box
        background={'light-2'}
        color={'3d3d3d'}
        gap={'20px'}
        height={'100vh'}
        overflow={'scroll'}
        pad={'4rem 2rem 2rem 2rem'}
        style={{ gap: '20px', flex: 2, position: 'relative' }}
      >
        <Box
          direction={'row'}
          gap={'20px'}
          style={{ gap: '20px', position: 'absolute', top: 20, right: 20 }}
        >
          {!isLog && (
            <Fragment>
              <Button
                primary
                label={intl.formatMessage(messages.register)}
                onClick={() => router.goToRegister()}
                size={'small'}
              />
              <Text
                alignSelf={'center'}
                color={'brand'}
                onClick={() => router.goToLogin()}
                size={'medium'}
                style={{ cursor: 'pointer' }}
              >
                {intl.formatMessage(messages.login)}
              </Text>
            </Fragment>
          )}

          {isLog && <ResponsiveLayoutHeaderAvatar />}
        </Box>
        {props.children}
      </Box>
    </Box>
  );
};
