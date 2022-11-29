import withFormik from '@bbbtech/storybook-formik';
import { ComponentMeta, ComponentStory } from '@storybook/react';
import React from 'react';
import FormikDatePicker from './FormikDatePicker';

export default {
  title: 'Formik/DatePicker',
  component: FormikDatePicker,
  decorators: [withFormik],
  initialValues: { date: new Date() },
} as ComponentMeta<typeof FormikDatePicker>;

const Template: ComponentStory<typeof FormikDatePicker> = (args, context) => (
  <div>
    {context.parameters.title}
    <FormikDatePicker {...args} />
  </div>
);

export const basicDatePicker = Template.bind({});

basicDatePicker.args = {
  name: 'date',
};
