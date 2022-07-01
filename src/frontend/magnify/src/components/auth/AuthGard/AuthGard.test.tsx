import React from 'react';
import { IntlProvider } from 'react-intl';
import AuthGard from './AuthGard';
import { act, render, screen, waitFor } from '@testing-library/react';
import { ConnexionStatus, ControllerProvider, MockController, useStore } from '../../../controller';
import { QueryClient, QueryClientProvider } from 'react-query';
import { createRandomProfile } from '../../../factories/profile';

const StateDisplayer = () => {
  const { connexionStatus, user } = useStore();
  return (
    <div>
      <div>{connexionStatus}</div>
      <div>{user?.name}</div>
    </div>
  );
};

const Wrapper = (controller: MockController) => (
  <ControllerProvider controller={controller}>
    <QueryClientProvider client={new QueryClient()}>
      <IntlProvider locale="en">
        <AuthGard />
        <StateDisplayer />
      </IntlProvider>
    </QueryClientProvider>
  </ControllerProvider>
);

describe('AuthGard', () => {
  it('should pass state to CONNECTED if the controller is connected', async () => {
    const controller = new MockController();

    // Controller is connected
    controller._jwt = 'success-token';
    const user = createRandomProfile();
    controller.getMyProfile.mockResolvedValue(user);
    await act(async () => {
      render(Wrapper(controller));
    });

    // The status should pass to "CONNECTED" and the user should have been fetched
    await screen.findByText(ConnexionStatus.CONNECTED);
    await waitFor(() => expect(controller.getMyProfile).toHaveBeenCalled());
    await screen.findByText('Redirecting...');
  });
});
