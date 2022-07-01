import { ComponentMeta, ComponentStory } from '@storybook/react';
import { Box, Grid } from 'grommet';
import React from 'react';
import Section from './Section';

export default {
  title: 'DesignSystem/Section',
  component: Section,
} as ComponentMeta<typeof Section>;

const Template: ComponentStory<typeof Section> = (args) => <Section {...args} />;

// create the template and stories
export const basicSection = Template.bind({});
basicSection.args = {
  title: 'Section Title',
  children: <>Lorem ipsum dolor sit amet, consectetur adipiscing elit.</>,
};

export const sectionWithoutTitle = Template.bind({});
sectionWithoutTitle.args = {
  children: <>Lorem ipsum dolor sit amet, consectetur adipiscing elit.</>,
};

export const gridContentSection = Template.bind({});
gridContentSection.args = {
  title: 'Grid Section',
  children: (
    <Grid columns={{ count: 'fit', size: 'small' }} gap="medium">
      <Box height="150px" background="light-4" />
      <Box height="150px" background="light-4" />
      <Box height="150px" background="light-4" />
      <Box height="150px" background="light-4" />
      <Box height="150px" background="light-4" />
      <Box height="150px" background="light-4" />
    </Grid>
  ),
};
