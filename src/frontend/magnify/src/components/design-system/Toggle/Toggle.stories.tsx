import { ComponentMeta, ComponentStory } from '@storybook/react';
import React from 'react';
import Toggle, { ToggleVariant } from './Toggle';

export default {
  title: 'DesignSystem/Toggle',
  component: Toggle,
} as ComponentMeta<typeof Toggle>;

const Template: ComponentStory<typeof Toggle> = (args) => <Toggle {...args} />;

// create the template and stories
export const plain = Template.bind({});
plain.args = {
  title: 'Plain Toggle',
  label: 'A plain toggle',
  variant: ToggleVariant.PLAIN,
};

export const primary = Template.bind({});
primary.args = {
  title: 'Primary Toggle',
  label: 'A primary toggle',
  variant: ToggleVariant.PRIMARY,
};

export const primaryWithFixedWidth = Template.bind({});
primaryWithFixedWidth.args = {
  title: 'Primary Toggle',
  label: 'A primary toggle with fixed width',
  variant: ToggleVariant.PRIMARY,
  width: '400px',
};

export const disabled = Template.bind({});
disabled.args = {
  title: 'Disabled Toggle',
  label: 'A disabled toggle',
  variant: ToggleVariant.PRIMARY,
  disabled: true,
};

export const loading = Template.bind({});
loading.args = {
  title: 'Loading Toggle',
  label: 'A loading toggle',
  variant: ToggleVariant.PRIMARY,
  loading: true,
};

const SFTemplate: ComponentStory<typeof Toggle> = (args) => {
  const [checked, setChecked] = React.useState(false);

  return (
    <Toggle
      {...args}
      checked={checked}
      onChange={(event) => setChecked(event.currentTarget.checked)}
    />
  );
};

export const stateFull = SFTemplate.bind({});
stateFull.args = {
  title: 'StateFull Toggle',
  label: 'A toggle augmented with a React state',
  variant: ToggleVariant.PLAIN,
};
