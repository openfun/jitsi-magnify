import { useQuery } from '@tanstack/react-query';
import { Box, Spinner } from 'grommet';
import * as React from 'react';
import { useAuthContext } from '../../../context';
import { useRouting } from '../../../context/routing';
import { UsersRepository } from '../../../services/users/users.repository';
import { MagnifyQueryKeys } from '../../../utils/constants/react-query';

interface Props {
  children?: React.ReactNode;
}

export const RequireUser = ({ children }: Props) => {
  const authContext = useAuthContext();
  const routing = useRouting();
  const {
    isLoading,
    data: user,
    isFetching,
  } = useQuery([MagnifyQueryKeys.AUTH_USER], UsersRepository.me, {
    onError: () => {
      authContext.updateUser(null);
    },
    onSuccess: () => {
      authContext.updateUser(user);
    },
  });

  const loading = isLoading || isFetching;
  if (loading) {
    return (
      <Box align="center" height="100vh" justify="center" width="100vw">
        <Spinner />
      </Box>
    );
  }

  const getContent = () => {
    if (!user) {
      routing.goToLogin();
      return null;
    }

    return children;
  };

  return <>{getContent()}</>;
};
