import withFormik from '@bbbtech/storybook-formik';
import { ComponentMeta, ComponentStory } from '@storybook/react';
import React from 'react';
import FormikSwitch from './FormikSwitch';

export default {
  title: 'Formik/ToggleSwitch',
  component: FormikSwitch,
  decorators: [withFormik],
  parameters: {
    formik: {
      initialValues: { testChecked: true },
    },
  },
} as ComponentMeta<typeof FormikSwitch>;

const Template: ComponentStory<typeof FormikSwitch> = (args, context) => (
  <div>
    {context.parameters.title}
    <FormikSwitch {...args} />
  </div>
);

export const basicSwitch = Template.bind({});

basicSwitch.args = {
  name: 'testChecked',
  label: 'Test FormikSwitch',
};
