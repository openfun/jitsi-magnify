import React from 'react';
import ActivableButton from './ActivableButton';
import { ComponentStory, ComponentMeta } from '@storybook/react';

export default {
  title: 'DesignSystem/ActivableButton',
  component: ActivableButton,
} as ComponentMeta<typeof ActivableButton>;

const Template: ComponentStory<typeof ActivableButton> = (args) => <ActivableButton {...args} />;

// create the template and stories
export const basicActivableButtonDeactivated = Template.bind({});
basicActivableButtonDeactivated.args = {
  label: 'ActivableButton',
  primary: true,
};

export const basicActivableButtonActivated = Template.bind({});
basicActivableButtonActivated.args = {
  label: 'ActivableButton',
  primary: true,
  active: true,
};
