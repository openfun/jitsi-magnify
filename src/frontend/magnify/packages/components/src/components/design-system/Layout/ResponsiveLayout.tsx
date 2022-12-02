import { Box, Page, PageContent } from 'grommet';
import * as React from 'react';
import { ResponsiveLayoutHeader } from './Header/ResponsiveLayoutHeader';

export interface ResponsiveLayoutProps {
  children?: React.ReactNode;
  logoSrc?: string;
  logoWidth?: string;
  logoHeight?: string;
}

export const ResponsiveLayout = ({ ...props }: ResponsiveLayoutProps) => {
  return (
    <Box background={'rgb(249, 250, 251)'} height={{ min: '100vh' }}>
      <ResponsiveLayoutHeader {...props} />
      <Page fill={true} kind="narrow" pad={'xxsmall'}>
        <PageContent>{props.children}</PageContent>
      </Page>
    </Box>
  );
};
