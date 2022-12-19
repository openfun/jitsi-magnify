import { ErrorMessage, useField } from 'formik';
import { Box, Text, TextInput, TextInputProps } from 'grommet';
import { Hide, View } from 'grommet-icons';
import { normalizeColor } from 'grommet/utils';
import * as React from 'react';
import { FunctionComponent, useState } from 'react';
import styled, { css } from 'styled-components';

const CustomInput = styled(TextInput)`
  ${({ theme }) => css`
    background-color: ${normalizeColor('light-2', theme)};
  `}
  border: none;
`;

export interface FormikInputProps extends TextInputProps {
  label: string;
  name: string;
  placeholder?: string;
}

export const FormikInput: FunctionComponent<FormikInputProps> = (props) => {
  const [field] = useField(props.name);
  const [showPassword, setShowPassword] = useState(false);

  const getInputType = (): string => {
    if (props.type === 'password') {
      return showPassword ? 'text' : 'password';
    }
    return props.type ?? 'text';
  };

  return (
    <Box gap={'5px'} width="100%">
      {props.label != '' && (
        <label htmlFor={props.name}>
          <Text size={'xsmall'} weight={'bold'}>
            {props.label}
          </Text>
        </label>
      )}
      <div>
        <Box style={{ position: 'relative' }}>
          <CustomInput
            {...field}
            {...props}
            ref={null}
            aria-label={props.label !== '' ? props.label : props.name}
            id={props.name}
            type={getInputType()}
          />
          {props.type === 'password' && (
            <Box
              focusIndicator={false}
              onClick={() => setShowPassword(!showPassword)}
              style={{
                cursor: 'pointer',
                position: 'absolute',
                top: '8px',
                right: '10px',
              }}
            >
              {showPassword ? <View /> : <Hide />}
            </Box>
          )}
        </Box>
        <ErrorMessage
          name={props.name}
          render={(msg: string) => {
            return (
              <Text color={'accent-1'} size={'xsmall'}>
                {msg}
              </Text>
            );
          }}
        />
      </div>
    </Box>
  );
};
