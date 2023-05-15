import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { act, fireEvent, render, screen, waitFor } from '@testing-library/react';
import { Formik } from 'formik';
import { Grommet } from 'grommet';
import React from 'react';
import { IntlProvider } from 'react-intl';
import { describe, expect, it } from 'vitest';

import { customTheme } from '../../../../themes';
import { FormikValuesChange } from '../ValuesChange/FormikValuesChange';
import { FormikSwitch } from './FormikSwitch';

interface TestFormProps {
  handleSubmit: (values: { testSwitch: boolean }) => void;
}
function TestForm(props: TestFormProps) {
  const queryClient = new QueryClient();
  return (
    <Grommet theme={customTheme}>
      <IntlProvider locale="en">
        <QueryClientProvider client={queryClient}>
          <Formik initialValues={{ testSwitch: true }} onSubmit={props.handleSubmit}>
            <FormikValuesChange>
              <FormikSwitch label={'testSwitch'} name={'testSwitch'} />
            </FormikValuesChange>
          </Formik>
        </QueryClientProvider>
      </IntlProvider>
    </Grommet>
  );
}

describe('FormikSwitch', () => {
  it('should render as a checkbox', async () => {
    let values: { testSwitch: boolean } = { testSwitch: true };
    render(<TestForm handleSubmit={(newValues) => (values = newValues)} />);
    const switchButton = screen.getByRole('checkbox', { name: 'testSwitch' });
    expect(switchButton).toBeInTheDocument();
    expect(switchButton).not.toEqual(null);
    expect(switchButton.getAttribute('name')).toEqual('testSwitch');
  });
  it('Test handle change formik values', async () => {
    let values: { testSwitch: boolean } = { testSwitch: true };
    const handleSubmit = (newValues: { testSwitch: boolean }) => {
      values = newValues;
    };
    render(<TestForm handleSubmit={handleSubmit} />);
    const switchButton = screen.getByRole('checkbox', { name: 'testSwitch' });
    act(() => {
      fireEvent.click(switchButton);
    });

    await waitFor(() => {
      expect(values.testSwitch).toEqual(false);
    });
  });
});
