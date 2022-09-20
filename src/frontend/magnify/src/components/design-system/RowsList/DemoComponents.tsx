import { Button, Card, CheckBox } from 'grommet';
import React from 'react';
import { HeaderProps, RowPropsExtended } from './RowsList';

export interface ExampleRowProps {
  id: string;
  name: string;
}

/**
 * The row component. It can be shown as selected and react to toggle
 */
export const ExampleRow = ({
  id,
  name,
  onToggle,
  selected,
}: ExampleRowProps & RowPropsExtended) => {
  return (
    <Card background="brand" margin={{ vertical: 'xsmall' }} pad="small">
      <CheckBox checked={selected} label="Select" onChange={onToggle} />
      Hello {name} (id: {id})
    </Card>
  );
};
export const MinimalExampleRow = ({ id, name }: ExampleRowProps) => (
  <Card background="brand" margin={{ vertical: 'xsmall' }} pad="small">
    Hello {name} ({id})
  </Card>
);

/**
 * The header, that can be used to select multiple rows
 */
export const ExampleHeader = ({ selected, setSelected }: HeaderProps) => (
  <Card margin={{ vertical: 'xsmall' }} pad="small">
    Header, {Object.values(selected).filter((x) => x).length} selected
    <Button
      primary
      margin="xsmall"
      onClick={() => setSelected({ '1': false, '2': false, '3': false })}
    >
      Clear
    </Button>
    <Button
      primary
      margin="xsmall"
      onClick={() => setSelected({ '1': true, '2': true, '3': true })}
    >
      Select all
    </Button>
  </Card>
);

/**
 * The actions in the menu
 */
export const exampleActions = [
  {
    label: {
      id: 'groups.delete',
      defaultMessage:
        'Delete {numberOfSelected} {numberOfSelected, plural, =0 {example} one {example}' +
        ' other {examples}}',
    },
    onClick: () => {},
    disabled: (numberSelected: number) => numberSelected === 0,
  },
  {
    label: {
      id: 'groups.edit',
      defaultMessage: 'Edit',
    },
    onClick: () => {},
    disabled: (numberSelected: number) => numberSelected !== 1,
  },
];
