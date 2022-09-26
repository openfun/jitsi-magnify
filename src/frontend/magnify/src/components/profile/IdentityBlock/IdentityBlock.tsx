import { Box, Card } from 'grommet';
import { MarginType } from 'grommet/utils';
import React from 'react';
import { useStore } from '../../../controller';
import { useIsSmallSize } from '../../../hooks/useIsMobile';
import AvatarForm from '../AvatarForm';
import IdentityForm from '../IdentityForm';

export interface IdentityBlockProps {
  margin?: MarginType;
}

export default function IdentityBlock({ margin = { vertical: 'small' } }: IdentityBlockProps) {
  const { user } = useStore();
  const isSmall = useIsSmallSize();

  return (
    <Card background="white" margin={margin} pad={isSmall ? 'medium' : 'small'}>
      <Box align={'center'} direction={isSmall ? 'column' : 'row'} justify={'center'}>
        <Box margin={{ vertical: 'auto', horizontal: 'medium' }}>
          <AvatarForm key={user?.id || ''} id={user?.id} src={user?.avatar} />
        </Box>
        <Box margin="medium" style={{ flexGrow: 1 }} width={isSmall ? '100%' : 'auto'}>
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
