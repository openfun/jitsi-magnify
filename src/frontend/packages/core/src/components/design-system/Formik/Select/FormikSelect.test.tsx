import { act, render, screen, waitFor } from '@testing-library/react';
import { Formik } from 'formik';
import React from 'react';
import { FormikSelect } from './index';

describe('FormikSelect', () => {
  it('', async () => {
    const options = [
      { value: 'fr', label: 'French' },
      { value: 'en', label: 'English' },
    ];
    const selectLabel = 'test-select-label';
    const selectName = 'test-select-name';
    render(
      <Formik initialValues={{ [selectName]: 'fr' }} onSubmit={() => {}}>
        <FormikSelect
          label={selectLabel}
          labelKey="label"
          name={selectName}
          options={options}
          valueKey={{ key: 'value', reduce: true }}
        />
      </Formik>,
    );

    screen.getByLabelText(selectLabel);
    screen.getByText(selectLabel);
    const input = screen.getByRole('textbox', { name: `${selectName}, fr` });
    expect(input).toHaveValue('French');

    const button = screen.getByRole('button', { name: `${selectName}; Selected: fr` });
    act(() => {
      button.click();
    });

    await waitFor(() => {
      screen.getByText('English');
    });
  });
});
