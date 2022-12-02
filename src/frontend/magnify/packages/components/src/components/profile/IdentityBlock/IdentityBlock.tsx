import { Box, Card } from 'grommet';
import { MarginType } from 'grommet/utils';
import React from 'react';
import { useAuthContext } from '../../../context';
import { useIsSmallSize } from '../../../hooks/useIsMobile';
import { AvatarForm } from '../AvatarForm';
import { IdentityForm } from '../IdentityForm';

export interface IdentityBlockProps {
  margin?: MarginType;
}

export const IdentityBlock = ({ margin = { vertical: 'small' } }: IdentityBlockProps) => {
  const { user } = useAuthContext();
  const isSmall = useIsSmallSize();

  return (
    <Card background="white" margin={margin} pad={isSmall ? 'medium' : 'small'}>
      <Box align={'center'} direction={isSmall ? 'column' : 'row'} justify={'center'}>
        <Box margin={{ vertical: 'auto', horizontal: 'medium' }}>
          <AvatarForm key={user?.id || ''} id={user?.id} />
        </Box>
        <Box margin="medium" style={{ flexGrow: 1 }} width={isSmall ? '100%' : 'auto'}>
          <IdentityForm />
        </Box>
      </Box>
    </Card>
  );
};
