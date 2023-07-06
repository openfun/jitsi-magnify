import { act, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import React from 'react';
import { describe, expect, it, vi } from 'vitest';
import createRandomUser from '../../../../factories/users';
import { renderWrappedInTestingProvider } from '../../../../utils/test-utils';
import { UserRowBase } from './RowUserBase';

describe('RowUserBase', () => {
  it('basic should render successfully', async () => {
    const randomUser = createRandomUser();
    renderWrappedInTestingProvider(<UserRowBase user={randomUser} />);
    await screen.findByText(randomUser.username);
    await screen.findByText(randomUser.name);
  });

  it('basic render with empty Box instead of Menu if there is not actions defined', async () => {
    const randomUser = createRandomUser();
    renderWrappedInTestingProvider(<UserRowBase user={randomUser} />);
    await screen.findByTestId('emptyBox');
  });

  it('should render successfully with checkbox not selected', async () => {
    const user = userEvent.setup();
    const randomUser = createRandomUser();
    const onToggle = vi.fn();
    renderWrappedInTestingProvider(
      <UserRowBase onToggle={onToggle} showSelect={true} user={randomUser} />,
    );
    const checkbox: HTMLInputElement = await screen.findByRole('checkbox');
    expect(checkbox?.checked).toEqual(false);
    await act(() => {
      user.click(checkbox);
    });

    await waitFor(() => {
      expect(onToggle).toHaveBeenCalledOnce();
    });
  });

  it('should render successfully with checkbox selected', async () => {
    const randomUser = createRandomUser();
    renderWrappedInTestingProvider(
      <UserRowBase isSelected={true} showSelect={true} user={randomUser} />,
    );
    const checkbox: HTMLInputElement = await screen.findByRole('checkbox');
    expect(checkbox?.checked).toEqual(true);
  });

  it('should render successfully with rightContent', async () => {
    const randomUser = createRandomUser();
    renderWrappedInTestingProvider(
      <UserRowBase rightContent={<div>right</div>} user={randomUser} />,
    );
    await screen.findByText('right');
  });

  it('should render successfully with onClick', async () => {
    const user = userEvent.setup();
    const randomUser = createRandomUser();
    const onClick = vi.fn();
    renderWrappedInTestingProvider(<UserRowBase onClick={onClick} user={randomUser} />);

    const userElement = await screen.findByText(randomUser.name);
    await act(() => {
      user.click(userElement);
    });

    await waitFor(async () => {
      expect(onClick).toHaveBeenNthCalledWith(1, randomUser);
    });
  });

  it('should render successfully with more actions', async () => {
    const user = userEvent.setup();
    const onHelloClick = vi.fn();
    const randomUser = createRandomUser();
    renderWrappedInTestingProvider(
      <UserRowBase
        moreActions={[{ label: 'Hello', onClick: onHelloClick }]}
        showActions={true}
        user={randomUser}
      />,
    );
    const moreButton = await screen.findByRole('button', { name: 'Open Menu' });
    await act(() => {
      user.click(moreButton);
    });
    const hello = await screen.findByText('Hello');
    await act(() => {
      user.click(hello);
    });

    await waitFor(() => {
      expect(onHelloClick).toHaveBeenCalledOnce();
    });
  });
});
