import { fireEvent, render, screen } from '@testing-library/react';
import { Grommet } from 'grommet';
import React from 'react';
import { IntlProvider } from 'react-intl';
import { MagnifyTestingProvider } from '../../app';
import { Toggle, ToggleProps } from './Toggle';

const StatefullToggle = (props: ToggleProps) => {
  const [checked, setChecked] = React.useState(false);
  return <Toggle {...props} checked={checked} onChange={() => setChecked(() => !checked)} />;
};

describe('Toggle', () => {
  it('should render as a checkbox', () => {
    render(
      <Grommet>
        <IntlProvider locale="en">
          <Toggle label="This is a toggle" title="My toggle" />
        </IntlProvider>
      </Grommet>,
    );
    expect(screen.getByRole('checkbox')).toBeInTheDocument();
  });

  it('should change its value on click', () => {
    render(<StatefullToggle label="This is a toggle" title="My toggle" />, {
      wrapper: MagnifyTestingProvider,
    });
    const toggle = screen.getByTitle('My toggle');
    expect(toggle).toHaveAttribute('aria-checked', 'false');

    fireEvent.click(toggle);
    expect(toggle).toHaveAttribute('aria-checked', 'true');
  });
});
