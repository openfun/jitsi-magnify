import { Meta, StoryFn } from '@storybook/react';
import React from 'react';
import { Toggle, ToggleVariant } from './Toggle';

export default {
  title: 'DesignSystem/Toggle',
  component: Toggle,
} as Meta<typeof Toggle>;

export const plain = {
  args: {
    title: 'Plain Toggle',
    label: 'A plain toggle',
    variant: ToggleVariant.PLAIN,
  },
};

export const primary = {
  args: {
    title: 'Primary Toggle',
    label: 'A primary toggle',
    variant: ToggleVariant.PRIMARY,
  },
};

export const primaryWithFixedWidth = {
  args: {
    title: 'Primary Toggle',
    label: 'A primary toggle with fixed width',
    variant: ToggleVariant.PRIMARY,
    width: '400px',
  },
};

export const disabled = {
  args: {
    title: 'Disabled Toggle',
    label: 'A disabled toggle',
    variant: ToggleVariant.PRIMARY,
    disabled: true,
  },
};

export const loading = {
  args: {
    title: 'Loading Toggle',
    label: 'A loading toggle',
    variant: ToggleVariant.PRIMARY,
    loading: true,
  },
};

const SFTemplate: StoryFn<typeof Toggle> = (args) => {
  const [checked, setChecked] = React.useState(false);

  return (
    <Toggle
      {...args}
      checked={checked}
      onChange={(event) => setChecked(event.currentTarget.checked)}
    />
  );
};

export const stateFull = {
  render: SFTemplate,

  args: {
    title: 'StateFull Toggle',
    label: 'A toggle augmented with a React state',
    variant: ToggleVariant.PLAIN,
  },
};
