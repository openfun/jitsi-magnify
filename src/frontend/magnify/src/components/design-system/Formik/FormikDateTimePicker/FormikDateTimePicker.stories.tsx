import withFormik from '@bbbtech/storybook-formik';
import { ComponentMeta, ComponentStory } from '@storybook/react';
import React from 'react';
import FormikDateTimePicker from './FormikDateTimePicker';

export default {
  title: 'Formik/DateTimePicker',
  component: FormikDateTimePicker,
  decorators: [withFormik],
  initialValues: { date: new Date() },
} as ComponentMeta<typeof FormikDateTimePicker>;

const Template: ComponentStory<typeof FormikDateTimePicker> = (args, context) => (
  <div>
    {context.parameters.title}
    <FormikDateTimePicker {...args} />
  </div>
);

export const basicDateTimePicker = Template.bind({});

basicDateTimePicker.args = {
  timeName: 'time',
  dateName: 'date',
  frenchSuggestions: ['14:00', '15:00'],
  localTimeSuggestions: ['2:00 PM', '3:00 PM'],
};
