import { useQuery } from '@tanstack/react-query';
import { Box, Spinner } from 'grommet';
import * as React from 'react';

import { useAuthContext } from '../../context';
import { UsersRepository } from '../../services/users/users.repository';
import { UserResponse } from '../../types/api/auth';
import { MagnifyQueryKeys } from '../../utils/constants/react-query';

export interface AuthMiddlewareProps {
  children: React.ReactElement;
}

export const AuthMiddleware = ({ children }: AuthMiddlewareProps) => {
  const authContext = useAuthContext();
  const { isLoading } = useQuery([MagnifyQueryKeys.AUTH_USER], () => UsersRepository.me(), {
    enabled: authContext.user == null,
    onError: () => {
      authContext.updateUser(null);
    },
    onSuccess: (data: UserResponse) => {
      authContext.updateUser(data);
    },
  });

  if (isLoading) {
    return (
      <Box align="center" height="100vh" justify="center" width="100vw">
        <Spinner />
      </Box>
    );
  }

  return children;
};
