import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import React from 'react';
import { IntlProvider } from 'react-intl';
import { exampleActions, ExampleHeader, ExampleRow, MinimalExampleRow } from './DemoComponents';
import RowsList from './RowsList';

// Mocks
const mockedRows = [
  { name: 'Example 1', id: '1' },
  { name: 'Example 2', id: '2' },
  { name: 'Example 3', id: '3' },
];

describe('RowsList', () => {
  it('should be selectable example by example and globally', async () => {
    const user = userEvent.setup();
    render(
      <IntlProvider locale="en">
        <RowsList
          Header={ExampleHeader}
          Row={ExampleRow}
          rows={mockedRows}
          label={{
            id: 'examples.label',
            defaultMessage:
              '{numberOfRows} {numberOfRows, plural, =0 {example} one {example} other {examples}}',
          }}
        />
      </IntlProvider>,
    );

    // Initial state: all rows are unselected;
    screen.getByText('Header, 0 selected');
    screen.getByText('(3 examples)');
    const checkboxes = screen.getAllByRole('checkbox', { name: 'Select' });
    expect(checkboxes).toHaveLength(3);

    // Select one example
    await user.click(checkboxes[1]);
    expect(checkboxes[1]).toBeChecked();
    screen.getByText('Header, 1 selected');

    // Select all
    await user.click(screen.getByRole('button', { name: 'Select all' }));
    checkboxes.forEach((checkbox) => expect(checkbox).toBeChecked());

    // Unselect all
    await user.click(screen.getByRole('button', { name: 'Clear' }));
    checkboxes.forEach((checkbox) => expect(checkbox).not.toBeChecked());

    // In any case, actions and add button is not visible
    expect(screen.queryByRole('button', { name: 'Add' })).not.toBeInTheDocument();
    expect(screen.queryByRole('menu', { name: 'Actions' })).not.toBeInTheDocument();
  });

  it('should allow and pluralize buttons according to the number of examples selected', async () => {
    const user = userEvent.setup();
    render(
      <IntlProvider locale="en">
        <RowsList
          Header={ExampleHeader}
          Row={ExampleRow}
          actions={exampleActions}
          actionsLabel="Actions"
          rows={mockedRows}
          label={{
            id: 'examples.label',
            defaultMessage:
              '{numberOfRows} {numberOfRows, plural, =0 {example} one {example} other {examples}}',
          }}
        />
      </IntlProvider>,
    );

    // Initial state: all checkboxes are unchecked; the number of examples is displayed
    const checkboxes = screen.getAllByRole('checkbox', { name: 'Select' });
    const actionMenu = screen.getByRole('menu', { name: 'Actions' });

    // No example selected: All actions are singular and disabled
    await user.click(actionMenu);
    expect(screen.getByText('Delete 0 example').parentElement).toBeDisabled();
    expect(screen.getByText('Edit').parentElement).toBeDisabled();

    // 1 example selected: All actions are singular and enabled
    await user.click(checkboxes[1]);
    await user.click(actionMenu);
    expect(screen.getByText('Delete 1 example').parentElement).not.toBeDisabled();
    expect(screen.getByText('Edit').parentElement).not.toBeDisabled();

    // 2 examples selected: All actions are plural and enabled
    await user.click(checkboxes[2]);
    await user.click(actionMenu);
    expect(screen.getByText('Delete 2 examples').parentElement).not.toBeDisabled();
    expect(screen.getByText('Edit').parentElement).toBeDisabled();
  });

  it('should display actions and add button if provided', async () => {
    const onAdd = jest.fn();
    const onEdit = jest.fn();
    const onDelete = jest.fn();

    const user = userEvent.setup();
    const mockedActions = [
      { ...exampleActions[0], onClick: onDelete },
      { ...exampleActions[1], onClick: onEdit },
    ];

    render(
      <IntlProvider locale="en">
        <RowsList
          Header={ExampleHeader}
          Row={ExampleRow}
          actions={mockedActions}
          actionsLabel="Actions"
          addLabel="Add example"
          onAdd={onAdd}
          rows={mockedRows}
          label={{
            id: 'examples.label',
            defaultMessage:
              '{numberOfRows} {numberOfRows, plural, =0 {example} one {example} other {examples}}',
          }}
        />
      </IntlProvider>,
    );

    const checkboxes = screen.getAllByRole('checkbox', { name: 'Select' });
    const actionMenu = screen.getByRole('menu', { name: 'Actions' });
    const addButton = screen.getByRole('button', { name: 'Add example' });

    await user.click(addButton);
    expect(onAdd).toHaveBeenCalled();

    await user.click(checkboxes[1]);
    await user.click(actionMenu);
    await user.click(screen.getByText('Edit'));
    expect(onEdit).toHaveBeenCalledWith({
      '1': false,
      '2': true,
      '3': false,
    });

    await user.click(checkboxes[2]);
    await user.click(actionMenu);
    await user.click(screen.getByText('Delete 2 examples'));
    expect(onDelete).toHaveBeenCalledWith({
      '1': false,
      '2': true,
      '3': true,
    });
  });

  it('should not display actions if action label is missing', () => {
    render(
      <IntlProvider locale="en">
        <RowsList
          Row={ExampleRow}
          actions={exampleActions}
          rows={mockedRows}
          label={{
            id: 'examples.label',
            defaultMessage:
              '{numberOfRows} {numberOfRows, plural, =0 {example} one {example} other {examples}}',
          }}
        />
      </IntlProvider>,
    );

    expect(screen.queryByRole('menu', { name: 'Actions' })).not.toBeInTheDocument();
  });

  it('should not display add button if add label is missing', () => {
    render(
      <IntlProvider locale="en">
        <RowsList
          Row={ExampleRow}
          onAdd={() => {}}
          rows={mockedRows}
          label={{
            id: 'examples.label',
            defaultMessage:
              '{numberOfRows} {numberOfRows, plural, =0 {example} one {example} other {examples}}',
          }}
        />
      </IntlProvider>,
    );

    expect(screen.queryByRole('button', { name: 'Add example' })).not.toBeInTheDocument();
  });

  it('should render event in the minimal set of arguments', () => {
    render(
      <IntlProvider locale="en">
        <RowsList
          Row={MinimalExampleRow}
          rows={mockedRows}
          label={{
            id: 'examples.label',
            defaultMessage:
              '{numberOfRows} {numberOfRows, plural, =0 {example} one {example} other {examples}}',
          }}
        />
      </IntlProvider>,
    );

    screen.getByText('(3 examples)');
    screen.getByText('Hello Example 1 (1)');
    screen.getByText('Hello Example 2 (2)');
    screen.getByText('Hello Example 3 (3)');
  });
});
