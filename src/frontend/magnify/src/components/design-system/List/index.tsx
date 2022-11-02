import { TableRowProps } from 'grommet';
import * as React from 'react';

export interface MagnifyListProps<T> {
  rows: T[];
  renderRow: (item: T) => React.ReactNode;
}

export const MagnifyList = ({ ...props }: MagnifyListProps<TableRowProps>) => {
  return <div></div>;
};
