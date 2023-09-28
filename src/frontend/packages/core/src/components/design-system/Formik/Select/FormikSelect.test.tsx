import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Formik } from 'formik';
import React from 'react';
import { vi } from 'vitest';
import { MagnifyTestingProvider } from '../../../app';
import { FormikSelect } from './index';

describe('FormikSelect', () => {
  it('should render', async () => {
    const callback = vi.fn();
    const user = userEvent.setup();
    const options = [
      { value: 'en', label: 'English' },
      { value: 'fr', label: 'French' },
    ];
    const selectLabel = 'test-select-label';
    const selectName = 'test-select-name';
    render(
      <Formik initialValues={{ [selectName]: 'fr' }} onSubmit={() => {}}>
        <FormikSelect
          changeCallback={callback}
          fullWidth={true}
          label={selectLabel}
          name={selectName}
          options={options}
        />
      </Formik>,
      { wrapper: MagnifyTestingProvider },
    );

    const input = await screen.findByRole('combobox', {
      name: selectLabel,
    });

    await user.click(input);
    const englishOption = await screen.findByRole('option', { name: 'English' });
    await user.click(englishOption);
    expect(callback).toBeCalledWith('en');
  });
});
