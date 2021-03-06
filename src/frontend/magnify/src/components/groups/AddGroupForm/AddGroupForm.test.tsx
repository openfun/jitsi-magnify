import React from 'react';
import { IntlProvider } from 'react-intl';
import userEvent from '@testing-library/user-event';
import AddGroupForm from './AddGroupForm';
import { render, screen, waitFor } from '@testing-library/react';
import { ControllerProvider, MockController } from '../../../controller';
import createRandomGroup from '../../../factories/group';
import { QueryClient, QueryClientProvider } from 'react-query';

describe('AddGroupForm', () => {
  it('should render successfully', async () => {
    const controller = new MockController();
    const user = userEvent.setup();
    controller.createGroup.mockResolvedValue(createRandomGroup(5));
    const onSuccess = jest.fn();
    const onCancel = jest.fn();

    render(
      <IntlProvider locale="en">
        <ControllerProvider controller={controller}>
          <QueryClientProvider client={new QueryClient()}>
            <AddGroupForm onSuccess={onSuccess} onCancel={onCancel} />
          </QueryClientProvider>
        </ControllerProvider>
      </IntlProvider>,
    );

    await user.click(screen.getByRole('button', { name: 'Cancel' }));
    expect(onCancel).toHaveBeenCalled();

    await user.type(screen.getByRole('textbox', { name: 'Name' }), 'Test');
    await user.click(screen.getByRole('button', { name: 'Add group Test' }));
    await waitFor(() => expect(controller.createGroup).toHaveBeenCalledWith({ name: 'Test' }));
    expect(onSuccess).toHaveBeenCalled();
  });
});
