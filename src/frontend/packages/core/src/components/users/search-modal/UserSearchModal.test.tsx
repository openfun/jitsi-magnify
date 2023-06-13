import { act, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { rest } from 'msw';
import React from 'react';
import { describe, expect, it, vi } from 'vitest';
import { server } from '../../../mocks/server';
import { buildApiUrl } from '../../../services';
import { UsersApiRoutes } from '../../../utils';
import { renderWrappedInTestingProvider } from '../../../utils/test-utils';
import { UserSearchModal } from './index';

describe('UserSearch Modal', () => {
  it('should render successfully', async () => {
    const user = userEvent.setup();
    const onSelectUser = vi.fn();
    const { baseElement } = renderWrappedInTestingProvider(
      <UserSearchModal isOpen={true} modalUniqueId={'search-user'} onSelectUser={onSelectUser} />,
    );
    const addButton = await screen.findByRole('button', { name: 'Add' });
    const userTextInput = await screen.findByRole('textbox', { name: 'Find a user' });

    await act(async () => {
      user.type(userTextInput, 'John');
    });

    await screen.findByText('JD');
    await waitFor(() => {
      expect(1).toBe(baseElement.getElementsByClassName('user-row').length);
    });

    const johnDoe = await screen.findByText('John Doe');
    expect(baseElement.getElementsByClassName('user-row')[0]).toHaveStyle(
      'border: 1px solid transparent',
    );
    await act(async () => {
      user.click(johnDoe);
      user.click(addButton);
    });

    await waitFor(() => {
      expect(baseElement.getElementsByClassName('user-row')[0]).toHaveStyle(
        'border: 1px solid #055fd2',
      );
      expect(onSelectUser).toHaveBeenNthCalledWith(1, {
        id: '123',
        name: 'John Doe',
        email: 'john.doe@gmail.com',
        username: 'JohnDoe',
        language: 'en',
      });
    });
  });

  it('should render successfully with error', async () => {
    const user = userEvent.setup();
    const onSelectUser = vi.fn();
    server.use(
      rest.get(buildApiUrl(UsersApiRoutes.SEARCH), (req, res, ctx) => {
        return res(ctx.status(500), ctx.json({}));
      }),
    );
    renderWrappedInTestingProvider(
      <UserSearchModal isOpen={true} modalUniqueId={'search-user'} onSelectUser={onSelectUser} />,
    );
    const userTextInput = await screen.findByRole('textbox', { name: 'Find a user' });

    await act(async () => {
      user.type(userTextInput, 'John');
    });

    await waitFor(async () => {
      await screen.findByText('An error has occurred');
    });
  });
});
