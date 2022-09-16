import { render, screen } from '@testing-library/react';
import React from 'react';
import { IntlProvider } from 'react-intl';
import { QueryClient, QueryClientProvider } from 'react-query';
import { ControllerProvider, MockController } from '../../../controller';
import { ConnexionStatus, Store } from '../../../controller/store';
import { createRandomProfile } from '../../../factories/profile';
import IdentityBlock from './IdentityBlock';

describe('IdentityBlock', () => {
  it('should render the avatar and identity forms with right default values', async () => {
    const controller = new MockController();
    const store: Store = {
      connexionStatus: ConnexionStatus.CONNECTED,
      user: createRandomProfile(),
    };

    render(
      <ControllerProvider controller={controller} store={store}>
        <QueryClientProvider client={new QueryClient()}>
          <IntlProvider locale="en">
            <IdentityBlock />
          </IntlProvider>
        </QueryClientProvider>
      </ControllerProvider>,
    );

    const nameInput = screen.getByLabelText('Name*');
    const usernameInput = screen.getByLabelText('Username*');
    const emailInput = screen.getByLabelText('Email*');
    const saveButton = screen.getByText('Save');

    expect(nameInput).toHaveValue(store.user?.name);
    expect(usernameInput).toHaveValue(store.user?.username);
    expect(emailInput).toHaveValue(store.user?.email);
    expect(saveButton).toBeDisabled();

    const avatarImage = screen.getByTitle('Your avatar');
    expect(avatarImage).toHaveStyle(`background-image: url(${store.user?.avatar})`);
  });
});
