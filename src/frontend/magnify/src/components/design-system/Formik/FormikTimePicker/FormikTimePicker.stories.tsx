import withFormik from '@bbbtech/storybook-formik';
import { ComponentMeta, ComponentStory } from '@storybook/react';
import React from 'react';
import FormikTimePicker from './FormikTimePicker';

export default {
  title: 'Formik/TimePicker',
  component: FormikTimePicker,
  decorators: [withFormik],
} as ComponentMeta<typeof FormikTimePicker>;

const Template: ComponentStory<typeof FormikTimePicker> = (args, context) => (
  <div>
    {context.parameters.title}
    <FormikTimePicker {...args} />
  </div>
);

export const basicTimePicker = Template.bind({});

basicTimePicker.args = {
  name: 'time',
  isToday: true,
};
