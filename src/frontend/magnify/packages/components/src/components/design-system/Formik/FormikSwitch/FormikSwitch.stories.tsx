import withFormik from '@bbbtech/storybook-formik';
import { Meta, StoryFn } from '@storybook/react';
import React from 'react';
import { FormikSwitch } from './FormikSwitch';

export default {
  title: 'Formik/ToggleSwitch',
  component: FormikSwitch,
  decorators: [withFormik],
  parameters: {
    formik: {
      initialValues: { testChecked: true },
    },
  },
} as Meta<typeof FormikSwitch>;

const Template: StoryFn<typeof FormikSwitch> = (args, context) => (
  <div>
    {context.parameters.title}
    <FormikSwitch {...args} />
  </div>
);

export const basicSwitch = {
  render: Template,

  args: {
    name: 'testChecked',
    label: 'Test FormikSwitch',
  },
};
