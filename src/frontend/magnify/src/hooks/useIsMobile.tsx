import { ResponsiveContext } from 'grommet';
import { useContext } from 'react';

export const useIsMobile = () => {
  const size = useContext(ResponsiveContext);
  return size === 'small' || size === 'medium';
};

export const useIsSmallSize = () => {
  const size = useContext(ResponsiveContext);
  return size === 'small';
};
