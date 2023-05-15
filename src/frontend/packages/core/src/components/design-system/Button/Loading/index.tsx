import { Button, Spinner } from 'grommet';
import { ButtonExtendedProps } from 'grommet/components/Button';
import * as React from 'react';

export interface LoadingButtonProps extends ButtonExtendedProps {
  loading?: boolean;
}

export const LoadingButton = ({ loading, ...props }: LoadingButtonProps) => {
  return (
    <Button
      disabled={loading}
      icon={loading ? <Spinner size={'xsmall'} /> : undefined}
      {...props}
    />
  );
};
