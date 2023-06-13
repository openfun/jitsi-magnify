import { DefaultTokens } from '@openfun/cunningham-react';
import { ThemeType } from 'grommet';
import { tokens as cunningham } from '../cunningham-tokens';
import { deepMerge } from '../utils/helpers/merge';

export const getCustomTheme = (partialTheme: DefaultTokens = {}): ThemeType => {
  const cunninghamTheme = deepMerge(cunningham, partialTheme);
  return {
    tip: {
      content: {
        background: 'white',
      },
    },
    page: {
      ['narrow']: {
        width: { min: 'xsmall', max: 'xlarge' },
      },
    },
    global: {
      colors: {
        brand: cunninghamTheme.theme.colors['primary-500'],
        'neutral-1': cunninghamTheme.theme.colors['secondary-500'],
        'light-1': cunninghamTheme.theme.colors['greyscale-100'],
        'light-2': cunninghamTheme.theme.colors['greyscale-200'],
        'light-3': cunninghamTheme.theme.colors['greyscale-300'],
        'accent-1': cunninghamTheme.theme.colors['danger-500'],
        'status-warning': cunninghamTheme.theme.colors['warning-500'],
        'status-ok': cunninghamTheme.theme.colors['success-500'],
        'status-error': cunninghamTheme.theme.colors['danger-500'],
        'status-critical': cunninghamTheme.theme.colors['danger-800'],
      },
      edgeSize: {
        xxsmall: cunninghamTheme.theme.spacings.st,
        xsmall: cunninghamTheme.theme.spacings.t,
        small: cunninghamTheme.theme.spacings.s,
        medium: cunninghamTheme.theme.spacings.b,
        large: cunninghamTheme.theme.spacings.l,
        xlarge: cunninghamTheme.theme.spacings.xl,
      },
      spacing: cunninghamTheme.theme.spacings.b,
      elevation: {
        light: {
          xlarge:
            '0px 8px 10px -5px rgb(145 158 171 / 20%), 0px 16px 24px 2px rgb(145 158 171 / 14%), ' +
            '0px 6px 30px 5px rgb(145 158 171 / 12%)',
        },
      },
      breakpoints: {
        medium: { value: 768 },
        large: { value: 992 },
        small: { value: 576 },
      },
      font: {
        family: cunninghamTheme.theme.font.families.base,
        size: cunninghamTheme.theme.font.sizes.l,
        height: '1.5rem',
      },
      focus: {
        border: {
          color: 'light-3',
        },
      },
    },
    tag: {
      border: {
        color: 'brand',
        size: '2px',
      },
    },
    heading: {
      font: {
        family: cunninghamTheme.theme.font.families.accent,
        weight: cunninghamTheme.theme.font.weights.black,
      },
      level: {
        1: {
          font: {
            size: cunninghamTheme.theme.font.sizes.h1,
          },
        },
        2: {
          font: {
            size: cunninghamTheme.theme.font.sizes.h2,
          },
        },
        3: {
          font: {
            size: cunninghamTheme.theme.font.sizes.h3,
          },
        },
        4: {
          font: {
            size: cunninghamTheme.theme.font.sizes.h4,
          },
        },
        5: {
          font: {
            size: cunninghamTheme.theme.font.sizes.h5,
          },
        },
        6: {
          font: {
            size: cunninghamTheme.theme.font.sizes.h6,
          },
        },
      },
    },
  };
};
