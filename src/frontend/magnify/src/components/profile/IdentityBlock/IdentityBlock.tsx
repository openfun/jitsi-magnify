import React from 'react';
import { Box, Card } from 'grommet';
import AvatarForm from '../AvatarForm';
import IdentityForm from '../IdentityForm';

export interface IdentityBlockProps {
  name: string;
  username: string;
  email: string;
  avatar?: string;
}

export default function IdentityBlock({ name, username, email, avatar }: IdentityBlockProps) {
  return (
    <Card>
      <Box direction="row">
        <Box margin={{ vertical: 'auto', horizontal: 'large' }}>
          <AvatarForm src={avatar} />
        </Box>
        <Box margin="large" style={{ flexGrow: 1 }}>
          <IdentityForm name={name} email={email} username={username} />
        </Box>
      </Box>
    </Card>
  );
}
