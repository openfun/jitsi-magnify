import { Box, Grid, Image, Stack } from 'grommet';
import React from 'react';
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
  return (
    <Grid gap="none" columns={{ count: 2, size: 'flex' }}>
      <Box background="light-5">
        <Stack fill>
          <Box width="100%" height="100%" background={background} />
          <Box direction="column" height="100%" justify="between">
            <Box flex={{ grow: 1 }} height={{ max: '33vh' }} margin="auto 25%" justify="center">
              <Image src={urlLogo} alt="logo" />
            </Box>
            <Box flex={{ grow: 2 }} height={{ max: '66vh' }} justify="end">
              <Image width="110%" src={urlCover} alt="illustration" />
            </Box>
          </Box>
        </Stack>
      </Box>
      <Box background="light-2">
        <AuthForms />
      </Box>
    </Grid>
  );
}
