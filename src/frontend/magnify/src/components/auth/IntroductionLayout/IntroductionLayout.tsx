import { Box, Grid, Image, Stack } from 'grommet';
import React from 'react';
import { useIsMobile } from '../../../hooks/useIsMobile';
import AuthForms from '../AuthForms';

export interface IntroductionLayoutProps {
  urlCover: string;
  urlLogo: string;
  background: string;
}

export default function IntroductionLayout({
  urlCover,
  urlLogo,
  background,
}: IntroductionLayoutProps) {
  const isMobile = useIsMobile();
  return (
    <Grid columns={{ count: isMobile ? 1 : 2, size: 'flex' }} gap="none">
      {!isMobile && (
        <Box background={'light-5'}>
          <Stack fill>
            <Box background={background} height="100%" width="100%" />
            <Box direction="column" height="100%" justify="between">
              <Box flex={{ grow: 1 }} height={{ max: '33vh' }} justify="center" margin="auto 25%">
                <Image alt="logo" src={urlLogo} />
              </Box>
              <Box flex={{ grow: 2 }} height={{ max: '66vh' }} justify="end">
                <Image alt="illustration" src={urlCover} width="110%" />
              </Box>
            </Box>
          </Stack>
        </Box>
      )}
      <Box background={'light-2'}>
        <AuthForms />
      </Box>
    </Grid>
  );
}
