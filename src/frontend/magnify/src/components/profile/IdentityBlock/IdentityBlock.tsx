import React from 'react';
import { Box, Card } from 'grommet';
import AvatarForm from '../AvatarForm';
import IdentityForm from '../IdentityForm';
import { useStore } from '../../../controller';

export interface IdentityBlockProps {}

export default function IdentityBlock({}: IdentityBlockProps) {
  const { user } = useStore();

  return (
    <Card>
      <Box direction="row">
        <Box margin={{ vertical: 'auto', horizontal: 'large' }}>
          <AvatarForm src={user?.avatar} key={user?.id || ''} />
        </Box>
        <Box margin="large" style={{ flexGrow: 1 }}>
          <IdentityForm
            name={user?.name || ''}
            email={user?.email || ''}
            username={user?.username || ''}
            key={user?.id || ''}
          />
        </Box>
      </Box>
    </Card>
  );
}
