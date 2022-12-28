import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Avatar, Box, Menu, Text } from 'grommet';
import { Logout, User } from 'grommet-icons';
import * as React from 'react';
import { FunctionComponent, useMemo, useRef } from 'react';
import { useIntl } from 'react-intl';

import { useAuthContext } from '../../../../../context';
import { useRouting } from '../../../../../context/routing';
import { commonMessages } from '../../../../../i18n/Messages/commonMessages';
import { UsersRepository } from '../../../../../services/users/users.repository';
import { MagnifyQueryKeys } from '../../../../../utils/constants/react-query';

interface ResponsiveLayoutHeaderAvatarProps {}
export const ResponsiveLayoutHeaderAvatar: FunctionComponent<ResponsiveLayoutHeaderAvatarProps> = ({
  ...props
}) => {
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

  const initials = useMemo(() => {
    const { user } = authContext;
    if (user) {
      const splitName = user.name.split(' ');
      const initials = splitName[0][0] + splitName[1][0];
      return initials.toUpperCase();
    }
    return '';
  }, [authContext.user]);

  return (
    <Box ref={avatarRef} align={'center'} direction={'row'} justify={'center'}>
      <Menu
        dropProps={{ align: { top: 'bottom', right: 'right' } }}
        items={[
          {
            icon: <User />,
            onClick: () => routing.goToAccount(),
            label: (
              <Box alignSelf={'center'} margin={{ left: 'xsmall' }}>
                {intl.formatMessage(commonMessages.account)}
              </Box>
            ),
          },
          {
            icon: <Logout />,
            onClick: () => logoutUser(),
            label: (
              <Box alignSelf={'center'} margin={{ left: 'xsmall' }}>
                {intl.formatMessage(commonMessages.logout)}
              </Box>
            ),
          },
        ]}
      >
        <Avatar background={'light-3'} size={'40px'}>
          <Text style={{ textDecoration: 'none' }}>{initials}</Text>
        </Avatar>
      </Menu>
    </Box>
  );
};
