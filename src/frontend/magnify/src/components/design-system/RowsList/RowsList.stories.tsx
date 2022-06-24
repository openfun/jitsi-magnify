import React from 'react';
import RowsList, { RowsListProps } from './RowsList';
import { ComponentStory, ComponentMeta } from '@storybook/react';
import {
  exampleActions,
  ExampleHeader,
  ExampleRow,
  ExampleRowProps,
  MinimalExampleRow,
} from './DemoComponents';

export default {
  title: 'DesignSystem/RowsList',
  component: RowsList,
} as ComponentMeta<typeof RowsList>;

/**
 * The rows to display
 */
const rows = [
  { id: '1', name: 'Hello' },
  { id: '2', name: 'Example 2' },
  { id: '3', name: 'Hi' },
];

/**
 * Stories
 */
const Template: ComponentStory<typeof RowsList<ExampleRowProps>> = (
  args: RowsListProps<ExampleRowProps>,
) => <RowsList {...args} />;

export const CompleteSelectable = Template.bind({});
CompleteSelectable.args = {
  label: {
    id: 'examples.label',
    defaultMessage:
      '{numberOfRows} {numberOfRows, plural, =0 {example} one {example} other {examples}}',
  },
  addLabel: 'Add Example',
  onAdd: () => alert('New example'),
  actionsLabel: 'Actions',
  Header: ExampleHeader,
  Row: ExampleRow,
  actions: exampleActions,
  rows,
};

export const Minimal = Template.bind({});
Minimal.args = {
  label: {
    id: 'examples.label',
    defaultMessage:
      '{numberOfRows} {numberOfRows, plural, =0 {example} one {example} other {examples}}',
  },
  Row: MinimalExampleRow,
  rows,
};
