import React from 'react';
import * as icons from '.';
import { ComponentMeta } from '@storybook/react';
import { Box, Grid } from 'grommet';

export const Icons = () => {
  const allIcons = {
    GroupSVG: icons.GroupSVG,
    SettingsSVG: icons.SettingsSVG,
AvatarSVG: icons.AvatarSVG,
GridSVG: icons.GridSVG,
CalEventSVG: icons.CalEventSVG,
  } as Record<string, React.FC<icons.SvgProps>>;

  return (
    <Box pad="large">
      <Grid columns={'small'} gap="small">
        {Object.keys(allIcons).map((key) => {
          const Ic = allIcons[key];
          return (
            <Box pad="large" key={key}>
              <Box border="all" height="fit-content" width="fit-content" margin={'auto'}>
                <Ic color="black" size="70px" />
              </Box>
              <Box margin={'auto'}>{key}</Box>
            </Box>
          );
        })}
      </Grid>
    </Box>
  );
};

export default {
  title: 'Icons',
  component: Icons,
} as ComponentMeta<typeof Icons>;
