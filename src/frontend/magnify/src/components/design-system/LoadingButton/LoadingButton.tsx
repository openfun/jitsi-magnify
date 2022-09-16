import { Box, Button, ButtonExtendedProps, Spinner } from 'grommet';
import React from 'react';

export interface LoadingButtonProps extends ButtonExtendedProps {
  isLoading: boolean;
}

export default function LoadingButton({
  isLoading,
  primary,
  label,
  disabled,
  ...rest
}: LoadingButtonProps) {
  return (
    <Button
      {...rest}
      disabled={isLoading || disabled}
      primary={primary}
      label={
        isLoading ? (
          <Box direction="row" gap="small">
            <Spinner
              margin="auto"
              pad="6px"
              size="xsmall"
              border={[
                { side: 'all', color: primary ? 'white' : 'brand', size: 'small' },
                { side: 'bottom', color: primary ? 'brand' : 'white', size: 'small' },
              ]}
            />
            <Box margin="auto 0px">{label}</Box>
          </Box>
        ) : (
          <Box direction="row" gap="small">
            <Box margin="auto 15px">{label}</Box>
          </Box>
        )
      }
    />
  );
}
