import { ComponentMeta, ComponentStory } from '@storybook/react';

import { Button, Card } from 'grommet';
import React from 'react';

import ResponsiveLayout from '../Layout';
import MagnifyPageContent from './MagnifyPageContent';

export default {
  title: 'Layout/PageContent',
  component: MagnifyPageContent,
} as ComponentMeta<typeof MagnifyPageContent>;

const Template: ComponentStory<typeof MagnifyPageContent> = (args) => {
  return (
    <ResponsiveLayout {...args}>
      <MagnifyPageContent actions={<Button primary label={'Add'} />} title={'Page title'}>
        <Card>Exemple Page Content</Card>
      </MagnifyPageContent>
    </ResponsiveLayout>
  );
};

export const pageContent = Template.bind({});
