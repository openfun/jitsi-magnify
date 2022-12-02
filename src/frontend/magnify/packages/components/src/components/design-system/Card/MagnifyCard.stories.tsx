import { ComponentMeta, ComponentStory } from '@storybook/react';
import React from 'react';
import { MagnifyCard } from './MagnifyCard';

export default {
  title: 'DesignSystem/Card',
  component: MagnifyCard,
} as ComponentMeta<typeof MagnifyCard>;

const Template: ComponentStory<typeof MagnifyCard> = (args) => <MagnifyCard {...args} />;

// create the template and stories
export const basicCard = Template.bind({});
basicCard.args = {
  title: 'Test Card',
  children: <div>Hello 👋</div>,
};
