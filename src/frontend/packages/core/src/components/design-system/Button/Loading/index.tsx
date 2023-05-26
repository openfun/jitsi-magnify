import { Button } from '@openfun/cunningham-react';
import { Spinner } from 'grommet';
import * as React from 'react';

export type LoadingButtonProps = Parameters<typeof Button>[0] & {
  label: string;
  loading?: boolean;
};

export const LoadingButton = ({ loading, disabled = false, ...props }: LoadingButtonProps) => {
  return (
    <Button
      disabled={loading || disabled}
      icon={loading ? <Spinner size="xsmall" /> : undefined}
      {...props}
    >
      {props.label}
    </Button>
  );
};
