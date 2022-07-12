import React from 'react';
import { IntlProvider } from 'react-intl';
import AddUserForm from './AddUserForm';
import { render, screen, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from 'react-query';
import userEvent from '@testing-library/user-event';
import { ControllerProvider, MockController } from '../../../controller';
import createRandomGroup from '../../../factories/group';

describe('AddUserForm', () => {
  it('should render successfully', async () => {
    const controller = new MockController();
    controller.addUserToGroup.mockResolvedValue(createRandomGroup(7));
    const user = userEvent.setup();

    render(
      <IntlProvider locale="en">
        <QueryClientProvider client={new QueryClient()}>
          <ControllerProvider controller={controller}>
            <AddUserForm groupId="group-id" />
          </ControllerProvider>
        </QueryClientProvider>
      </IntlProvider>,
    );

    await user.type(screen.getByRole('textbox', { name: 'Email' }), 'test@test.fr');
    await user.click(screen.getByRole('button', { name: 'Add user' }));
    await waitFor(() =>
      expect(controller.addUserToGroup).toHaveBeenCalledWith({
        groupId: 'group-id',
        userEmail: 'test@test.fr',
      }),
    );
  });
});
