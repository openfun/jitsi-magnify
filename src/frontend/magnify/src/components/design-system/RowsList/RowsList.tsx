import { Box, Button, Card, Grid, Menu, Text } from 'grommet';
import React, { useState } from 'react';
import { useIntl, MessageDescriptor } from 'react-intl';
import WaitingRow from '../WaitingRow';

export interface Row {
  id: string;
}

export interface RowPropsExtended {
  selected: boolean;
  onToggle: () => void;
}

export interface HeaderProps {
  selected: Record<string, boolean>;
  setSelected: (selected: Record<string, boolean>) => void;
}

export interface RowsListProps<TRowProps extends Row> {
  /**
   * The intl message for the title of the group
   * It should be pluralized with the number of groups
   */
  label: MessageDescriptor;
  /**
   * Add label
   */
  addLabel?: string;
  /**
   * Add callback
   */
  onAdd?: () => void;
  /**
   * Actions label
   */
  actionsLabel?: string;
  /**
   * the component to use to render a row
   * It can accept the following props:
   * - selected: whether the row is selected or not
   * - onToggle: () => void: callback to toggle the selection of the row
   * - ...others: other props to pass to the component, those props come from the `rows` prop
   * If you don't want to use selection of rows, just ignore those props when
   * rendering the rows
   */
  Row: React.FC<RowPropsExtended & TRowProps>;
  /**
   * The component to use to render the header
   * It can accept the following props:
   * - numberSelected: the number of selected rows
   * - setSelected: (selection: Record<string, boolean>) => void: callback to set the selection of the rows globally
   * If you don't want to use the header, you can ignore it
   */
  Header?: React.FC<HeaderProps>;
  /**
   * The actions allowed
   */
  actions?: {
    label: MessageDescriptor;
    onClick: (selection: Record<string, boolean>) => void;
    disabled: (numberOfSelected: number) => boolean;
  }[];
  /**
   * The list of rows
   */
  rows: TRowProps[];
  /**
   * Are we still loading the rows?
   */
  isLoading?: boolean;
  /**
   * Should we display a loading placeholder at the location of the title?
   * Make this true if you display the number of rows in the title, but you don't know
   * how many rows you have yet
   */
  titleIsLoading?: boolean;
}

/**
 * This component is used for genericity. We often need to display a list of rows,
 * with a header, and some actions, depending of the selected rows.
 *
 * Features provided are:
 * - Display a pluralized label for the group (based on an internationalized label)
 * - Display an add button if both the label and the onAdd callback are provided
 * - Display actions if both an "actions" label and an actions array is provided
 *    (containing labels, callbacks and way to determine if the action is disabled)
 * - Display a header if provided, that accept the number of selected rows and a
 *    callback to set the selection of the rows globally
 * - Display the rows, using a provided component and a list of props to pass to it
 *    Each row will receive additionnal props that indicate if they are selected or not
 *    and a callback to toggle the selection of the row
 *
 * You can override a lot in this component.
 */
export default function RowsList<TRowProps extends Row>({
  label,
  addLabel,
  onAdd,
  actionsLabel,
  Header,
  Row,
  actions,
  rows,
  isLoading = false,
  titleIsLoading = false,
}: RowsListProps<TRowProps>) {
  const intl = useIntl();

  const [selected, setSelected] = useState<Record<string, boolean>>(
    Object.fromEntries(rows.map((row) => [row.id, false])),
  );

  const numberOfSelected = Object.values(selected).filter((selected) => selected).length;

  const handleToggle = (groupId: string) => {
    setSelected((pSelected) => ({ ...pSelected, [groupId]: !pSelected[groupId] }));
  };

  return (
    <Card background="white" pad="medium">
      <Grid
        fill
        columns={['flex', 'flex']}
        gap="small"
        rows={['flex']}
        areas={[
          { name: 'title', start: [0, 0], end: [0, 0] },
          { name: 'actions', start: [1, 0], end: [1, 0] },
        ]}
      >
        <Box gridArea="title" pad={{ vertical: 'medium', horizontal: 'small' }}>
          <Box margin="auto 0px">
            {titleIsLoading ? (
              <Box width="small">
                <WaitingRow />
              </Box>
            ) : (
              <Text color="brand" size="medium" weight="bold">
                ({intl.formatMessage(label, { numberOfRows: rows.length })})
              </Text>
            )}
          </Box>
        </Box>
        <Box
          direction="row"
          gridArea="actions"
          justify="end"
          pad={{ vertical: 'medium', horizontal: 'small' }}
        >
          {onAdd && addLabel && (
            <Button
              primary
              label={addLabel}
              margin={{ vertical: 'auto', horizontal: 'xsmall' }}
              onClick={onAdd}
            />
          )}
          {actions && actionsLabel && (
            <Menu
              aria-label={actionsLabel}
              label={actionsLabel}
              margin={{ vertical: 'auto', horizontal: 'xsmall' }}
              name={actionsLabel}
              role="menu"
              items={actions.map(({ label, onClick, disabled }) => ({
                label: intl.formatMessage(label, { numberOfSelected }),
                onClick: () => onClick(selected),
                disabled: disabled(numberOfSelected),
              }))}
            />
          )}
        </Box>
      </Grid>
      {Header && <Header selected={selected} setSelected={setSelected} />}
      {!isLoading &&
        rows.map((row) => (
          <Row
            key={row.id}
            {...row}
            onToggle={() => handleToggle(row.id)}
            selected={selected[row.id]}
          />
        ))}
      {isLoading && Array.from({ length: 3 }, (_v, i) => <WaitingRow key={i} />)}
    </Card>
  );
}
