import { ThemeType } from 'grommet';

export const customTheme: ThemeType = {
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
      family: 'Roboto',
      size: '14px',
      height: '20px',
    },
    colors: {
      brand: '#035ccd',
      'neutral-1': '#294c79',
      'light-1': '#f9fcfd',
      'light-2': '#f2f7fd',
      'light-3': '#e5eefa',
      'accent-1': '#ff0000',
    },
    focus: {
      border: {
        color: 'light-3',
      },
    },
  },
  button: {
    size: {
      small: {
        border: {
          radius: '5px',
        },
      },
      medium: {
        border: {
          radius: '5px',
        },
      },
    },
    border: {
      radius: '5px',
    },
  },
  tag: {
    border: {
      color: 'brand',
      size: '2px',
    },
  },
  heading: {
    level: {
      2: {
        font: {
          weight: 'normal',
        },
      },
    },
  },
};
