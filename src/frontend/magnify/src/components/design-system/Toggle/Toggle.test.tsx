import { fireEvent, render, screen } from '@testing-library/react';
import { Grommet } from 'grommet';
import React from 'react';
import { IntlProvider } from 'react-intl';
import Toggle, { ToggleProps } from './Toggle';
import theme from '../../../themes/theme';

function StatefullToggle(props: ToggleProps) {
  const [checked, setChecked] = React.useState(false);
  return <Toggle {...props} checked={checked} onChange={() => setChecked(() => !checked)} />;
}

describe('Toggle', () => {
  it('should render as a checkbox', () => {
    render(
      <Grommet>
        <IntlProvider locale="en">
          <Toggle title="My toggle" label="This is a toggle" />
        </IntlProvider>
      </Grommet>,
    );
    expect(screen.getByRole('checkbox')).toBeInTheDocument();
  });

  it('should change its value on click', () => {
    render(
      <Grommet theme={theme}>
        <IntlProvider locale="en">
          <StatefullToggle title="My toggle" label="This is a toggle" />
        </IntlProvider>
      </Grommet>,
    );
    const toggle = screen.getByTitle('My toggle');
    expect(toggle).toHaveAttribute('aria-checked', 'false');

    fireEvent.click(toggle);
    expect(toggle).toHaveAttribute('aria-checked', 'true');
  });
});
