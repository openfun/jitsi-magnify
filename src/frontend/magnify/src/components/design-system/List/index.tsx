import { Box } from 'grommet';
import * as React from 'react';
import { useState } from 'react';

export interface Row {
  id: string;
}

export interface RowPropsExtended<T> {
  item: T;
  selected: boolean;
  onToggle: () => void;
}

export interface MagnifyListProps<TRowProps extends Row> {
  rows: TRowProps[];
  Row: React.FC<RowPropsExtended<TRowProps>>;
}

export default function MagnifyList<TRowProps extends Row>({
  rows,
  Row,
  ...props
}: MagnifyListProps<TRowProps>) {
  const [selected, setSelected] = useState<Record<string, boolean>>(
    Object.fromEntries(rows.map((row) => [row.id, false])),
  );

  console.log(rows);

  const numberOfSelected = Object.values(selected).filter((selected) => selected).length;

  const handleToggle = (groupId: string) => {
    setSelected((pSelected) => ({ ...pSelected, [groupId]: !pSelected[groupId] }));
  };

  return (
    <Box gap={'10px'}>
      {rows.map((row) => (
        <Row
          key={row.id}
          item={row}
          onToggle={() => handleToggle(row.id)}
          selected={selected[row.id]}
        />
      ))}
    </Box>
  );
}
