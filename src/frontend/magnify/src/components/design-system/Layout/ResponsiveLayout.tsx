import { Box, Page, PageContent } from 'grommet';
import * as React from 'react';
import { ResponsiveLayoutHeader } from './Header/ResponsiveLayoutHeader';

export interface ResponsiveLayoutProps {
  children?: React.ReactNode;
  logoSrc?: string;
  logoWidth?: string;
  logoHeight?: string;
}

function ResponsiveLayout({ ...props }: ResponsiveLayoutProps) {
  return (
    <Box background={'white'} height={{ min: '100vh' }}>
      <ResponsiveLayoutHeader {...props} />
      <Page fill={true} kind="narrow" pad={'xxsmall'}>
        <PageContent>{props.children}</PageContent>
      </Page>
    </Box>
  );
}

export default ResponsiveLayout;
