import React from 'react';
import { ReactNode, useEffect } from 'react';
import { ConnexionStatus, useStore } from '../controller';
import { createRandomProfile } from '../factories/profile';
import { Profile } from '../types/profile';

export default function InjectFakeUser({
  user,
  children,
}: {
  user?: Profile;
  children: ReactNode;
}) {
  const { setStore } = useStore();

  useEffect(() => {
    setStore({
      connexionStatus: ConnexionStatus.CONNECTED,
      user: user || createRandomProfile(),
    });
  }, []);

  return <>{children}</>;
}
