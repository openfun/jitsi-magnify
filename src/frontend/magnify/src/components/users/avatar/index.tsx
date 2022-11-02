import { Avatar, Text } from 'grommet';
import * as React from 'react';
import { useMemo } from 'react';
import { User } from '../../../types';

export interface UserAvatarProps {
  user: User;
}

export const UserAvatar = ({ user }: UserAvatarProps) => {
  const initials = useMemo(() => {
    if (user) {
      const splitName = user.name.split(' ');
      const initials = splitName[0][0] + splitName[1][0];
      return initials.toUpperCase();
    }
    return '';
  }, [user]);
  return (
    <Avatar background={'light-3'} size={'40px'}>
      <Text style={{ textDecoration: 'none' }}>{initials}</Text>
    </Avatar>
  );
};
