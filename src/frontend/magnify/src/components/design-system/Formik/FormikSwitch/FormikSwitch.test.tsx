import { act, fireEvent, render, screen, waitFor } from '@testing-library/react';
import React from 'react';

import { Formik } from 'formik';
import theme from '../../../../themes/theme';
import { QueryClient, QueryClientProvider } from 'react-query';
import { Grommet } from 'grommet';
import { IntlProvider } from 'react-intl';

import FormikSwitch from './FormikSwitch';
import {FormikValuesChange} from "../ValuesChange/FormikValuesChange";


interface TestFormProps {
  handleSubmit: (values: { testSwitch: boolean }) => void;
}
function TestForm(props: TestFormProps) {
  const queryClient = new QueryClient();
  return (
    <Grommet theme={theme}>
      <IntlProvider locale="en">
        <QueryClientProvider client={queryClient}>
          <Formik initialValues={{ testSwitch: true }} onSubmit={props.handleSubmit}>
            <FormikValuesChange>
              <FormikSwitch name={'testSwitch'} label={'testSwitch'} />
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
    const switchButton = screen.getByRole('checkbox', {name: 'testSwitch'});
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
    const switchButton = screen.getByRole('checkbox', {name: 'testSwitch'});
    act(() => {
      fireEvent.click(switchButton);
    });

    await waitFor(() => {
      expect(values.testSwitch).toEqual(false);
    });
  });
});
