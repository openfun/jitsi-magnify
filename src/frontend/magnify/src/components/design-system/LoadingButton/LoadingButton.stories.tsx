import { ComponentStory, ComponentMeta } from '@storybook/react';
import React from 'react';
import LoadingButton, { LoadingButtonProps } from './LoadingButton';

export default {
  title: 'DesignSystem/LoadingButton',
  component: LoadingButton,
} as ComponentMeta<typeof LoadingButton>;

// Template
const Template: ComponentStory<typeof LoadingButton> = (args: LoadingButtonProps) => (
  <LoadingButton {...args} />
);

// Stories
export const Loading = Template.bind({});
Loading.args = { isLoading: true, label: 'Button' };

export const NotLoading = Template.bind({});
NotLoading.args = { isLoading: false, label: 'Button' };

export const LoadingPrimary = Template.bind({});
LoadingPrimary.args = { isLoading: true, label: 'Button', primary: true };

export const NotLoadingPrimary = Template.bind({});
NotLoadingPrimary.args = { isLoading: false, label: 'Button', primary: true };
