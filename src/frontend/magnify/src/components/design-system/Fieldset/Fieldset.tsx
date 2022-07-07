import React from 'react';
import { Box, Text } from 'grommet';
import { MarginType } from 'grommet/utils';

export interface FieldsetProps {
  label: string;
  name: string;
  children: React.ReactNode;
  margin?: MarginType;
  required?: boolean;
  displayErrors?: boolean;
  errors?: string[];
}

const Fieldset = ({
  name,
  label,
  children,
  margin = { vertical: 'small' },
  required = false,
  displayErrors = false,
  errors = [],
}: FieldsetProps) => {
  return (
    <Box
      border={{ side: 'all', color: 'brand' }}
      round="8px"
      pad={{ vertical: 'xsmall', horizontal: 'small' }}
      margin={margin}
    >
      <Box margin={{ left: '11px' }}>
        <label htmlFor={name}>
          <Text size="xsmall" weight="bold" color="brand">
            {label}
          </Text>
          {required && (
            <Text size="xsmall" color="status-error" margin={{ left: 'xxsmall' }}>
              *
            </Text>
          )}
        </label>
      </Box>
      <Box direction="row">{children}</Box>
      {displayErrors && errors.length > 0 && (
        <Box margin={{ left: '11px' }}>
          <Text size="xsmall" color="status-error">
            {errors.join(', ')}
          </Text>
        </Box>
      )}
    </Box>
  );
};

export default Fieldset;
