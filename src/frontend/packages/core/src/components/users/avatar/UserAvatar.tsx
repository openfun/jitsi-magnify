import { Avatar, Text } from 'grommet';

import * as React from 'react';
import { useMemo } from 'react';

export interface UserAvatarProps {
  name?: string;
  username: string;
  backgroundColor?: string;
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

export const UserAvatar = ({ username, name, backgroundColor }: UserAvatarProps) => {
  const initials = useMemo(() => {
    if (name && name.length >= 1) {
      const customName = name.replace(/\s+/g, ' ').trim();
      const splitName = customName.split(' ');

      let chars = splitName[0][0];
      if (splitName[1].length > 0) {
        chars += splitName[1][0];
      }
      return chars.toUpperCase();
    }
    const customUsername = username.replace(/\s+/g, ' ').trim();
    return customUsername[0];
  }, [name, username]);

  const getBackgroundColor = (): string => {
    return (
      backgroundColor ??
      USER_DEFAULT_AVATAR_COLORS[username.charCodeAt(0) % USER_DEFAULT_AVATAR_COLORS.length]
    );
  };

  return (
    <Avatar background={getBackgroundColor()} size="40px">
      <Text color="white" style={{ textDecoration: 'none' }}>
        {initials}
      </Text>
    </Avatar>
  );
};
