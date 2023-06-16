import { Button } from '@openfun/cunningham-react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { MagnifyTestingProvider } from '../../app';
import { MagnifyModal, MagnifyModalTypes } from './index';

describe('<MagnifyModal/>', () => {
  it('should render successfully', async () => {
    const onClose = vi.fn();
    const user = userEvent.setup();
    render(
      <MagnifyModal
        footer={<Button>Validate</Button>}
        isOpen={true}
        modalUniqueId="modal"
        onClose={onClose}
        titleModal="Modal title"
      >
        <div>John Doe</div>
      </MagnifyModal>,
      {
        wrapper: MagnifyTestingProvider,
      },
    );

    await screen.findByText('John Doe');
    screen.getByRole('button', { name: 'Cancel' });
    screen.getByRole('button', { name: 'Validate' });
    screen.getByRole('heading', { level: 4, name: 'Modal title' });
    const close = screen.getByTestId('closeIcon');
    await user.click(close);
    expect(onClose).toBeCalled();
  });

  it('should render successfully with warning type', async () => {
    const fn = vi.fn();
    const user = userEvent.setup();
    render(
      <MagnifyModal
        isOpen={true}
        modalUniqueId="modal"
        type={MagnifyModalTypes.WARNING}
        validateButtonCallback={fn}
        validateButtonLabel="Apply"
      >
        <div>John Doe</div>
      </MagnifyModal>,
      {
        wrapper: MagnifyTestingProvider,
      },
    );

    const button = screen.getByRole('button', { name: 'Apply' });
    await user.click(button);
    expect(fn).toBeCalled();
  });
});
