import { Box, Text } from 'grommet';
import { MarginType } from 'grommet/utils';
import React from 'react';

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
      margin={margin}
      pad={{ vertical: 'xsmall', horizontal: 'small' }}
      round="8px"
    >
      <Box margin={{ left: '11px' }}>
        <label htmlFor={name}>
          <Text color="brand" size="xsmall" weight="bold">
            {label}
          </Text>
          {required && (
            <Text color="status-error" margin={{ left: 'xxsmall' }} size="xsmall">
              *
            </Text>
          )}
        </label>
      </Box>
      <Box direction="row">{children}</Box>
      {displayErrors && errors.length > 0 && (
        <Box margin={{ left: '11px' }}>
          <Text color="status-error" size="xsmall">
            {errors.join(', ')}
          </Text>
        </Box>
      )}
    </Box>
  );
};

export default Fieldset;
