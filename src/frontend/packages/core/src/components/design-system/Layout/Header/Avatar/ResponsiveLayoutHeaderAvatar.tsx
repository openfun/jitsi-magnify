import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Box, Menu } from 'grommet';
import { Configure, Logout, User } from 'grommet-icons';
import * as React from 'react';
import { FunctionComponent, useRef } from 'react';
import { useIntl } from 'react-intl';

import { useAuthContext } from '../../../../../context';
import { useRouting } from '../../../../../context/routing';
import { commonMessages } from '../../../../../i18n/Messages/commonMessages';
import { UsersRepository } from '../../../../../services/users/users.repository';
import { MagnifyQueryKeys } from '../../../../../utils/constants/react-query';
import { UserAvatar } from '../../../../users';

interface ResponsiveLayoutHeaderAvatarProps {}
export const ResponsiveLayoutHeaderAvatar: FunctionComponent<
  ResponsiveLayoutHeaderAvatarProps
> = () => {
  const intl = useIntl();
  const avatarRef = useRef<HTMLDivElement>(null);
  const routing = useRouting();
  const authContext = useAuthContext();

  const queryClient = useQueryClient();
  const { mutate: logoutUser } = useMutation(async () => UsersRepository.logout(), {
    onSuccess: () => {
      queryClient.setQueryData([MagnifyQueryKeys.AUTH_USER], undefined);
      routing.goToLogout();
    },
  });

  return (
    <Box ref={avatarRef} align="center" direction="row" justify="center">
      <Menu
        dropProps={{ stretch: false, align: { top: 'bottom', right: 'right' } }}
        items={[
          {
            icon: <User />,
            onClick: () => routing.goToAccount(),
            label: (
              <Box alignSelf="center" margin={{ left: 'xsmall' }}>
                {intl.formatMessage(commonMessages.account)}
              </Box>
            ),
          },
          {
            icon: <Configure />,
            onClick: () => routing.goToPreferences(),
            label: (
              <Box alignSelf="center" margin={{ left: 'xsmall' }}>
                {intl.formatMessage(commonMessages.preferences)}
              </Box>
            ),
          },
          {
            icon: <Logout />,
            onClick: () => logoutUser(),
            label: (
              <Box alignSelf="center" margin={{ left: 'xsmall' }}>
                {intl.formatMessage(commonMessages.logout)}
              </Box>
            ),
          },
        ]}
      >
        {authContext.user && (
          <UserAvatar
            backgroundColor="brand"
            name={authContext.user.name}
            username={authContext.user.username}
          />
        )}
      </Menu>
    </Box>
  );
};
