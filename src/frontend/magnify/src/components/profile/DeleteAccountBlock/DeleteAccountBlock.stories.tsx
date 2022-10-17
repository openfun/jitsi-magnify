import { ComponentMeta, ComponentStory } from '@storybook/react';
import React from 'react';
import DeleteAccountBlock from './DeleteAccountBlock';

export default {
  title: 'profile/DeleteAccountBlock',
  component: DeleteAccountBlock,
} as ComponentMeta<typeof DeleteAccountBlock>;

const Template: ComponentStory<typeof DeleteAccountBlock> = () => <DeleteAccountBlock />;

// create the template and 2 stories for variants blue and red
export const Simple = Template.bind({});
Simple.args = {};
