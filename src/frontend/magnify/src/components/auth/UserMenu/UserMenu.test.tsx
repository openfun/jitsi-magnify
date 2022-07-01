import React from 'react';
import { IntlProvider } from 'react-intl';
import UserMenu from './UserMenu';
import { render, screen } from '@testing-library/react';
import { ControllerProvider, MockController } from '../../../controller';
import { ConnexionStatus, Store } from '../../../controller/store';
import { createRandomProfile } from '../../../factories/profile';
import { QueryClient, QueryClientProvider } from 'react-query';

describe('UserMenu', () => {
  it('should render the user name and avatar', async () => {
    const controller = new MockController();
    const store: Store = {
      connexionStatus: ConnexionStatus.CONNECTED,
      user: createRandomProfile(),
    };

    render(
      <ControllerProvider controller={controller} store={store}>
        <QueryClientProvider client={new QueryClient()}>
          <IntlProvider locale="en">
            <UserMenu />
          </IntlProvider>
        </QueryClientProvider>
      </ControllerProvider>,
    );

    await screen.findByText(store!.user!.name!);
    await screen.findByRole('img', { name: store!.user!.username! });
  });
});
