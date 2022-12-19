import { act, render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import React from 'react';
import { describe, expect, it } from 'vitest';
import MagnifyList from './MagnifyList';

describe('MagnifyList', () => {
  it('should render successfully', async () => {
    const user = userEvent.setup();
    const elements: { id: string; name: string }[] = [
      { id: '1', name: 'John' },
      { id: '2', name: 'Doe' },
    ];

    const Wrapper = (
      <>
        <MagnifyList
          rows={elements}
          Row={(props) => (
            <div onClick={(event) => props.onToggle()} role={'presentation'}>
              {props.item.name} - selected: {props.selected ? 'true' : 'false'}
            </div>
          )}
        />
      </>
    );

    render(Wrapper);
    await screen.findByText('Doe - selected: false');
    const john = await screen.findByText('John - selected: false');
    await act(() => {
      user.click(john);
    });

    await waitFor(() => {
      expect(john).toHaveTextContent('John - selected: true');
    });
  });
  it('should render successfully without row', async () => {
    const elements: { id: string; name: string }[] = [];
    render(<MagnifyList Row={(props) => <div>Empty</div>} rows={elements} />);
    expect(screen.queryByText('Empty')).toBe(null);
  });
});
