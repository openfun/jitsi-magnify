import { Box, Card } from 'grommet';
import { MarginType } from 'grommet/utils';
import React from 'react';
import { useStore } from '../../../controller';
import AvatarForm from '../AvatarForm';
import IdentityForm from '../IdentityForm';

export interface IdentityBlockProps {
  margin?: MarginType;
}

export default function IdentityBlock({ margin = { vertical: 'small' } }: IdentityBlockProps) {
  const { user } = useStore();

  return (
    <Card background="white" margin={margin}>
      <Box direction="row">
        <Box margin={{ vertical: 'auto', horizontal: 'large' }}>
          <AvatarForm key={user?.id || ''} id={user?.id} src={user?.avatar} />
        </Box>
        <Box margin="large" style={{ flexGrow: 1 }}>
          <IdentityForm
            key={user?.id || ''}
            email={user?.email || ''}
            id={user?.id}
            name={user?.name || ''}
            username={user?.username || ''}
          />
        </Box>
      </Box>
    </Card>
  );
}
