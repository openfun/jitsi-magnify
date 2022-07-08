import { Box, CheckBox, Spinner, Stack, ThemeContext, ThemeType } from 'grommet';
import { normalizeColor, WidthType } from 'grommet/utils';
import React from 'react';
import { useTheme } from 'styled-components';

const customToggleTheme = (theme: ThemeType, invisible: boolean) => {
  const invisibleIfInvisible = (color: string) => (invisible ? 'transparent' : color);
  return {
    checkBox: {
      border: {
        color: invisibleIfInvisible(normalizeColor('brand', theme)),
        width: '1px',
      },
      color: invisibleIfInvisible(normalizeColor('white', theme)),
      hover: {
        border: {
          color: 'none',
        },
      },
      toggle: {
        background: ({ checked }: { checked: boolean }) =>
          checked ? invisibleIfInvisible(normalizeColor('brand', theme)) : 'transparent',
        color: ({ checked }: { checked: boolean }) =>
          checked
            ? invisibleIfInvisible(normalizeColor('white', theme))
            : invisibleIfInvisible(normalizeColor('brand', theme)),
        knob: {
          extend: `
          top: 1px;
          left: 2px;
          height: 12px;
          width: 12px;
          `,
        },
        size: '40px',
        extend: `
          width: 32px;
          height: 16px;
          box-shadow: none;
        `,
      },
    },
  };
};

export enum ToggleVariant {
  PLAIN = 'plain',
  PRIMARY = 'primary',
}

export interface ToggleProps {
  disabled?: boolean;
  loading?: boolean;
  title?: string;
  label?: string;
  variant?: ToggleVariant | 'plain' | 'primary';
  width?: WidthType;
  checked?: boolean;
  onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

export default function Toggle({
  disabled,
  loading = false,
  title,
  label,
  variant = ToggleVariant.PLAIN,
  width,
  checked = false,
  onChange,
}: ToggleProps) {
  const theme = useTheme();

  return (
    <ThemeContext.Extend value={customToggleTheme(theme, loading)}>
      <Box
        {...(variant === ToggleVariant.PRIMARY
          ? { background: 'light-3', pad: 'small', round: 'xsmall' }
          : {})}
        width={width}
      >
        <Stack margin={{ top: 'auto', bottom: 'auto', left: 'small' }} anchor="left">
          <CheckBox
            a11yTitle={title}
            aria-checked={checked}
            checked={checked}
            disabled={disabled}
            onChange={onChange}
            title={title}
            label={label}
            toggle
            aria-busy={loading}
          />
          {loading && <Spinner size="xsmall" margin={{ left: '6px' }} />}
        </Stack>
      </Box>
    </ThemeContext.Extend>
  );
}
