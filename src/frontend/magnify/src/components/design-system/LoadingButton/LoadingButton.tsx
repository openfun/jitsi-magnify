import React from 'react';
import { Box, Button, ButtonExtendedProps, Spinner } from 'grommet';

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
      primary={primary}
      disabled={isLoading || disabled}
      label={
        isLoading ? (
          <Box direction="row" gap="small">
            <Spinner
              border={[
                { side: 'all', color: primary ? 'white' : 'brand', size: 'small' },
                { side: 'bottom', color: primary ? 'brand' : 'white', size: 'small' },
              ]}
              pad="6px"
              margin="auto"
              size="xsmall"
            />
            <Box margin={'auto 0px'}>{label}</Box>
          </Box>
        ) : (
          <Box direction="row" gap="small">
            <Box margin={'auto 15px'}>{label}</Box>
          </Box>
        )
      }
    />
  );
}
