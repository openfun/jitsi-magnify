import { Meta, StoryFn } from '@storybook/react';
import { Box, Grid } from 'grommet';
import React from 'react';
import { Section } from './Section';

export default {
  title: 'DesignSystem/Section',
  component: Section,
} as Meta<typeof Section>;

export const basicSection = {
  args: {
    title: 'Section Title',
    children: <>Lorem ipsum dolor sit amet, consectetur adipiscing elit.</>,
  },
};

export const sectionWithoutTitle = {
  args: {
    children: <>Lorem ipsum dolor sit amet, consectetur adipiscing elit.</>,
  },
};

export const gridContentSection = {
  args: {
    title: 'Grid Section',
    children: (
      <Grid columns={{ count: 'fit', size: 'small' }} gap="medium">
        <Box background="light-4" height="150px" />
        <Box background="light-4" height="150px" />
        <Box background="light-4" height="150px" />
        <Box background="light-4" height="150px" />
        <Box background="light-4" height="150px" />
        <Box background="light-4" height="150px" />
      </Grid>
    ),
  },
};
