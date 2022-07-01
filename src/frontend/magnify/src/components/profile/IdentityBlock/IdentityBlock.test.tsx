import React from 'react';
import { render, screen } from '@testing-library/react';
import { IntlProvider } from 'react-intl';
import IdentityBlock from './IdentityBlock';
import { ConnexionStatus, Store } from '../../../controller/store';
import { createRandomProfile } from '../../../factories/profile';
import { ControllerProvider, MockController } from '../../../controller';

describe('IdentityBlock', () => {
  it('should render the avatar and identity forms with right default values', async () => {
    const controller = new MockController();
    const store: Store = {
      connexionStatus: ConnexionStatus.CONNECTED,
      user: createRandomProfile(),
    };

    render(
      <ControllerProvider controller={controller} store={store}>
        <IntlProvider locale="en">
          <IdentityBlock />
        </IntlProvider>
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
