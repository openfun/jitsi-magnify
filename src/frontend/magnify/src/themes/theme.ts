import { ThemeType } from 'grommet';

const theme: ThemeType = {
  global: {
    font: {
      family: 'Roboto',
      size: '14px',
      height: '20px',
    },
    colors: {
      brand: '#035ccd',
      'neutral-1': '#294c79',
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
  formField: {
    border: false,
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

export default theme;
