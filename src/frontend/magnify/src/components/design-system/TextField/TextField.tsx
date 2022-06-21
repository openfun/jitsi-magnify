import { Box, Button, Text, TextInput } from 'grommet';
import { MarginType } from 'grommet/utils';
import React, { useState } from 'react';
import { View, Hide } from 'grommet-icons';

export interface TextFieldProps {
  /**
   * Should we display error messages if any?
   * It can be a good idea to not to display error messages at the very beginning
   * @default true
   */
  displayErrors?: boolean;
  /**
   * The error messages to display
   * @default []
   */
  errors?: string[];
  /**
   * The label for the text field
   * @required
   */
  label: string;
  /**
   * Additional margin to apply to the text field
   * @default: 'none'
   */
  margin?: MarginType;
  /**
   * The name of the text field
   * @required
   */
  name: string;
  /**
   * The callback to call when the value of the text field changes
   * @required
   */
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  /**
   * Is the text field required? (should display an indicator if yes)
   * @default false
   */
  required?: boolean;
  /**
   * The type of the text field (text, password, ...)
   * Currently only text and password are supported
   * @default 'text'
   */
  type?: 'text' | 'password';
  /**
   * The value of the text field
   */
  value: string;
}

export default function TextField({
  displayErrors = true,
  errors = [],
  label,
  margin = 'none',
  name,
  onChange,
  required = false,
  type = 'text',
  value,
}: TextFieldProps) {
  const [revealPassword, setRevealPassword] = useState(false);

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
      <Box direction="row">
        <TextInput
          name={name}
          id={name}
          value={value}
          onChange={onChange}
          style={{ border: 'none' }}
          type={type === 'password' ? (revealPassword ? 'text' : 'password') : type}
        />
        {type === 'password' && (
          <Button
            icon={revealPassword ? <View /> : <Hide />}
            onClick={() => setRevealPassword(!revealPassword)}
            style={{ padding: '7px' }}
            title={revealPassword ? 'Hide' : 'Show'}
          />
        )}
      </Box>
      {displayErrors && errors.length > 0 && (
        <Box margin={{ left: '11px' }}>
          <Text size="xsmall" color="status-error">
            {errors.join(', ')}
          </Text>
        </Box>
      )}
    </Box>
  );
}
