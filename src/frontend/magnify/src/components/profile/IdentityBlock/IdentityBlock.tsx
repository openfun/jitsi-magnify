import React from 'react';
import { Box, Card } from 'grommet';
import AvatarForm from '../AvatarForm';
import IdentityForm from '../IdentityForm';
import { MarginType } from 'grommet/utils';
import { useStore } from '../../../controller';

export interface IdentityBlockProps {
  margin?: MarginType;
}

export default function IdentityBlock({ margin = { vertical: 'small' } }: IdentityBlockProps) {
  const { user } = useStore();

  return (
    <Card margin={margin} background="white">
      <Box direction="row">
        <Box margin={{ vertical: 'auto', horizontal: 'large' }}>
          <AvatarForm id={user?.id} src={user?.avatar} key={user?.id || ''} />
        </Box>
        <Box margin="large" style={{ flexGrow: 1 }}>
          <IdentityForm
            id={user?.id}
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
