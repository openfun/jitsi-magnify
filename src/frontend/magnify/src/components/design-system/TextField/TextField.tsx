import { Box, Text, TextInput } from 'grommet';
import { MarginType } from 'grommet/utils';
import React from 'react';

export interface TextFieldProps {
  errors?: string[];
  label: string;
  margin?: MarginType;
  name: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  value: string;
}

export default function TextField({
  errors = [],
  label,
  margin,
  name,
  onChange,
  value,
}: TextFieldProps) {
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
        </label>
      </Box>
      <TextInput
        name={name}
        id={name}
        value={value}
        onChange={onChange}
        style={{ border: 'none' }}
      />
      {errors.length > 0 && (
        <Box margin={{ left: '11px' }}>
          <Text size="xsmall" color="status-error">
            {errors.join(', ')}
          </Text>
        </Box>
      )}
    </Box>
  );
}
