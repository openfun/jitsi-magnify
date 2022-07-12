import React from 'react';
import { IntlProvider } from 'react-intl';
import MyGroupsBlock from './MyGroupsBlock';
import { render, screen } from '@testing-library/react';
import { ControllerProvider, MockController } from '../../../controller';
import createRandomGroups from '../../../factories/groups';
import { QueryClient, QueryClientProvider } from 'react-query';
import { MemoryRouter } from 'react-router-dom';

describe('MyGroupsBlock', () => {
  it('should load a list of groups', async () => {
    const controller = new MockController();
    const groups = createRandomGroups(7);
    controller.getGroups.mockResolvedValue(groups);

    render(
      <ControllerProvider controller={controller}>
        <QueryClientProvider client={new QueryClient()}>
          <IntlProvider locale="en">
            <MemoryRouter>
              <MyGroupsBlock />
            </MemoryRouter>
          </IntlProvider>
        </QueryClientProvider>
      </ControllerProvider>,
    );

    await screen.findByText('(7 groups)');

    groups.forEach((group) => {
      screen.getByText(group.name);
    });
  });
});
