import { useQueryClient } from '@tanstack/react-query';
import React, { useEffect, useState } from 'react';

import { User } from '../../types/entities/user';
import { Maybe } from '../../types/misc';
import { MagnifyQueryKeys } from '../../utils/constants/react-query';

export interface AuthContextInterface {
  user: Maybe<User> | null;
  updateUser: (user: Maybe<User> | null) => void;
}

const AuthContext = React.createContext<Maybe<AuthContextInterface>>(undefined);

type AuthContextProviderProps = {
  children: React.ReactNode;
  initialUser?: Maybe<User> | null;
};

export const AuthContextProvider = ({ children, ...props }: AuthContextProviderProps) => {
  const [user, setUser] = useState<Maybe<User> | null>(props.initialUser ?? undefined);
  const queryClient = useQueryClient();

  useEffect(() => {
    if (props.initialUser != null) {
      queryClient.setQueryData([MagnifyQueryKeys.AUTH_USER], props.initialUser);
    }
  }, []);

  const context: AuthContextInterface = React.useMemo(
    () => ({
      user: user,
      updateUser: (user: Maybe<User> | null) => {
        queryClient.setQueryData([MagnifyQueryKeys.AUTH_USER], user);
        setUser(user);
      },
    }),
    [user],
  );
  return <AuthContext.Provider value={context}>{children}</AuthContext.Provider>;
};

export const useAuthContext = () => {
  const authContext = React.useContext(AuthContext);

  if (authContext) {
    return authContext;
  }

  throw new Error(`useAuthContext must be used within a AuthContextProvider`);
};
