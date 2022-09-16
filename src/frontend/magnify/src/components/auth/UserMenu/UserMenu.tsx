import { Avatar, Box, Text } from 'grommet';
import { User } from 'grommet-icons';
import React from 'react';
import { useStore } from '../../../controller';

const UserMenu = () => {
  const { user } = useStore();

  return (
    <Box direction="row" gap="small">
      <Text color="brand">{user?.name}</Text>
      <Box>
        <Avatar
          {...(user?.avatar ? { src: user.avatar } : { children: <User /> })}
          role="img"
          size="24px"
          title={user?.username}
        />
      </Box>
    </Box>
  );
};

export default UserMenu;
