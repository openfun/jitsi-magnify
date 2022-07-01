import React from 'react';
import { useStore } from '../../../controller';
import { Avatar, Box, Text } from 'grommet';
import { User } from 'grommet-icons';

const UserMenu = () => {
  const { user } = useStore();

  return (
    <Box direction="row" gap="small">
      <Text color="brand">{user?.name}</Text>
      <Box>
        <Avatar
          {...(user?.avatar ? { src: user.avatar } : { children: <User /> })}
          size="24px"
          role="img"
          title={user?.username}
        />
      </Box>
    </Box>
  );
};

export default UserMenu;
