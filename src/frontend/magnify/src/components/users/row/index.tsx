import { Box, CheckBox, Text } from 'grommet';
import * as React from 'react';
import { User } from '../../../types';
import { UserAvatar } from '../avatar';

export interface UserRowProps {
  user: User;
  isSelected?: boolean;
  onToggle?: () => void;
}

export const UserRow = ({ user, ...props }: UserRowProps) => {
  return (
    <Box align={'center'} border={true} direction={'row'} justify={'between'} pad={'xsmall'}>
      <Box align={'center'} direction={'row'} gap={'small'} justify={'between'}>
        <CheckBox checked={props.isSelected} onChange={props.onToggle} />
        <UserAvatar user={user} />
        <Text>{user.name}</Text>
      </Box>
      <Text>{user.email}</Text>
    </Box>
  );
};
