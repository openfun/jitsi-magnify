import React from 'react';
import Fieldset from './Fieldset';
import { ComponentStory, ComponentMeta } from '@storybook/react';

export default {
  title: 'DesignSystem/Fieldset',
  component: Fieldset,
} as ComponentMeta<typeof Fieldset>;

const Template: ComponentStory<typeof Fieldset> = (args) => <Fieldset {...args} />;

// create the template and stories
export const basicFieldset = Template.bind({});
basicFieldset.args = {
  children: 'This is a Fieldset',
  label: 'My fieldset',
  required: true,
};
