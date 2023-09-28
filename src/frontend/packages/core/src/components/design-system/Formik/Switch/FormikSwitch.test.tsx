import { act, render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Formik } from 'formik';
import React from 'react';
import { FormikValuesChange } from '../ValuesChange/FormikValuesChange';
import { FormikSwitch } from './FormikSwitch';

describe('FormikSwitch', () => {
  it('Test handle change formik values', async () => {
    const user = userEvent.setup();
    let values: { testSwitch: boolean } = { testSwitch: true };
    const handleSubmit = (newValues: { testSwitch: boolean }) => {
      values = newValues;
    };
    render(
      <Formik initialValues={{ testSwitch: true }} onSubmit={handleSubmit}>
        <FormikValuesChange>
          <FormikSwitch label="testSwitch" name="testSwitch" />
        </FormikValuesChange>
      </Formik>,
    );

    const switchButton = await screen.findByRole('checkbox', { name: 'testSwitch' });
    act(() => {
      user.click(switchButton);
    });

    await waitFor(() => {
      expect(values.testSwitch).toEqual(false);
    });
  });
});
