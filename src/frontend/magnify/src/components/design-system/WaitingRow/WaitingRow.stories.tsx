import React from 'react';
import WaitingRow from './WaitingRow';
import { ComponentStory, ComponentMeta } from '@storybook/react';

export default {
  title: 'DesignSystem/WaitingRow',
  component: WaitingRow,
} as ComponentMeta<typeof WaitingRow>;

const Template: ComponentStory<typeof WaitingRow> = (args) => <WaitingRow {...args} />;

// create the template and stories
export const basicWaitingRow = Template.bind({});
basicWaitingRow.args = {};
