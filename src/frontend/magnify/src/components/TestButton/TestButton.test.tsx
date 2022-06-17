import React from 'react';
import { IntlProvider } from 'react-intl';
import TestButton, { TestButtonVariant } from './TestButton';
import { render, screen } from '@testing-library/react';
import { ControllerProvider, MockController } from '../../controller';
import userEvent from '@testing-library/user-event';

describe('TestButton', () => {
  it('renders the test button in red when variant is red and react to click', async () => {
    const controller = new MockController();
    userEvent.setup();

    render(
      <IntlProvider locale="en">
        <ControllerProvider controller={controller}>
          <TestButton variant={TestButtonVariant.RED} />
        </ControllerProvider>
      </IntlProvider>,
    );

    const testButton = screen.getByRole('button', { name: 'Test Button' });
    expect(testButton).toHaveStyle({ backgroundColor: 'red' });

    await userEvent.click(testButton);
    expect(controller.sendTest).toHaveBeenCalledWith('Test Button clicked');
  });

  it('renders the test button in blue when variant is blue and react to click', async () => {
    const controller = new MockController();
    userEvent.setup();

    render(
      <IntlProvider locale="en">
        <ControllerProvider controller={controller}>
          <TestButton variant={TestButtonVariant.BLUE} />
        </ControllerProvider>
      </IntlProvider>,
    );

    const testButton = screen.getByRole('button', { name: 'Test Button' });
    expect(testButton).toHaveStyle({ backgroundColor: 'blue' });

    await userEvent.click(testButton);
    expect(controller.sendTest).toHaveBeenCalledWith('Test Button clicked');
  });
});
