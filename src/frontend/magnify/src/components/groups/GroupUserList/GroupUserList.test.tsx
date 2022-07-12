import React from 'react';
import { IntlProvider } from 'react-intl';
import userEvent from '@testing-library/user-event';
import GroupUserList from './GroupUserList';
import { render, screen, waitForElementToBeRemoved } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from 'react-query';
import { ControllerProvider, MockController } from '../../../controller';
import createRandomGroup from '../../../factories/group';
import { MemoryRouter } from 'react-router-dom';

describe('GroupUserList', () => {
  it('should render successfully', async () => {
    const controller = new MockController();
    controller.getGroup.mockResolvedValue(createRandomGroup(7));
    const user = userEvent.setup();

    render(
      <IntlProvider locale="en">
        <QueryClientProvider client={new QueryClient()}>
          <ControllerProvider controller={controller}>
            <MemoryRouter>
              <GroupUserList groupId="group-id" />
            </MemoryRouter>
          </ControllerProvider>
        </QueryClientProvider>
      </IntlProvider>,
    );

    await user.click(screen.getByRole('button', { name: 'Add user to group' }));
    await screen.findByRole('textbox', { name: 'Email' });
    await user.click(screen.getByRole('button', { name: 'Cancel' }));
    await waitForElementToBeRemoved(() => screen.getByRole('button', { name: 'Cancel' }));
  });
});
