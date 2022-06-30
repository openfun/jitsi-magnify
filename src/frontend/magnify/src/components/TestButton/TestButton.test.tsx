import { render, screen, waitForElementToBeRemoved } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import React from 'react';
import { IntlProvider } from 'react-intl';
import { ControllerProvider, MockController } from '../../controller';
import { example1, example2 } from '../../controller/mocks/example';
import TestButton, { TestButtonVariant } from './TestButton';

describe('TestButton', () => {
  it('renders the test button in red when variant is red and react to click', async () => {
    const controller = new MockController();
    controller.getExamples.mockResolvedValue([example1, example2]);
    userEvent.setup();

    render(
      <IntlProvider locale="en">
        <ControllerProvider controller={controller}>
          <TestButton variant={TestButtonVariant.RED} />
        </ControllerProvider>
      </IntlProvider>,
    );

    // Verify the button style
    const testButton = screen.getByRole('button', { name: 'Test Button' });
    expect(testButton).toHaveStyle({ backgroundColor: 'red' });

    // Verify fetching content
    const debugDisplayer = await screen.findByText('[]');
    await waitForElementToBeRemoved(() => screen.queryByText('[]'));
    expect(debugDisplayer).toHaveTextContent(JSON.stringify([example1, example2], null, '  '), {
      normalizeWhitespace: false,
    });

    // Verify reaction to click
    await userEvent.click(testButton);
    expect(controller.sendTest).toHaveBeenCalledWith('Test Button clicked');
  });

  it('renders the test button in blue when variant is blue and react to click', async () => {
    const controller = new MockController();
    controller.getExamples.mockResolvedValue([example1, example2]);
    userEvent.setup();

    render(
      <IntlProvider locale="en">
        <ControllerProvider controller={controller}>
          <TestButton variant={TestButtonVariant.BLUE} />
        </ControllerProvider>
      </IntlProvider>,
    );

    // Verify the button style
    const testButton = screen.getByRole('button', { name: 'Test Button' });
    expect(testButton).toHaveStyle({ backgroundColor: 'blue' });

    // Verify fetching content
    const debugDisplayer = await screen.findByText('[]');
    await waitForElementToBeRemoved(() => screen.queryByText('[]'));
    expect(debugDisplayer).toHaveTextContent(JSON.stringify([example1, example2], null, '  '), {
      normalizeWhitespace: false,
    });

    // Verify reaction to click
    await userEvent.click(testButton);
    expect(controller.sendTest).toHaveBeenCalledWith('Test Button clicked');
  });
});
