import { Avatar, Text } from 'grommet';
import * as React from 'react';
import { useMemo } from 'react';
import { User } from '../../../types';

export interface UserAvatarProps {
  user: User;
}

const USER_DEFAULT_AVATAR_COLORS = [
  '#c0392b',
  '#1abc9c',
  '#e67e22',
  '#34495e',
  '#e74c3c',
  '#9b59b6',
  '#d35400',
  '#95a5a6',
  '#2c3e50',
  '#7f8c8d',
  '#f39c12',
  '#16a085',
  '#f1c40f',
  '#2ecc71',
  '#8e44ad',
  '#2980b9',
  '#ff9ff3',
  '#27ae60',
];

export const UserAvatar = ({ user }: UserAvatarProps) => {
  const initials = useMemo(() => {
    if (user) {
      const splitName = user.name.split(' ');
      const initials = splitName[0][0] + splitName[1][0];
      return initials.toUpperCase();
    }
    return '';
  }, [user]);

  const getBackgroundColor = (): string => {
    const uid: string = user.id;
    return USER_DEFAULT_AVATAR_COLORS[uid.charCodeAt(0) % USER_DEFAULT_AVATAR_COLORS.length];
  };

  return (
    <Avatar background={getBackgroundColor()} size={'40px'}>
      <Text style={{ textDecoration: 'none' }}>{initials}</Text>
    </Avatar>
  );
};
