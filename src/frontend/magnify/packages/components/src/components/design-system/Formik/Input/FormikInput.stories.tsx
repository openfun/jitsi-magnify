import withFormik from '@bbbtech/storybook-formik';
import { Meta, StoryFn } from '@storybook/react';
import React from 'react';
import * as Yup from 'yup';
import { FormikInput } from './FormikInput';

const defaultSchema = Yup.object().shape({
  username: Yup.string().min(40, 'Too Short!').max(50, 'Too Long!'),
});

export default {
  title: 'Formik/Input',
  component: FormikInput,
  decorators: [withFormik],
  parameters: {
    formik: {
      initialValues: { username: 'John Doe' },
      validationSchema: defaultSchema,
    },
  },
} as Meta<typeof FormikInput>;

const Template: StoryFn<typeof FormikInput> = (args, context) => (
  <div>
    {context.parameters.title}
    <FormikInput {...args} />
  </div>
);

export const basicInput = {
  render: Template,

  args: {
    name: 'username',
    placeholder: 'Username',
    label: 'name',
  },

  parameters: {
    title: 'Test',
  },
};

const inputWithErrorsSchema = Yup.object().shape({
  username: Yup.string()
    .min(1, 'Too Short!')
    .max(50, 'Too Long!')
    .required('Your name is required'),
});

export const inputWithErrors = {
  render: Template,

  args: {
    name: 'username',
    label: 'Name',
  },

  parameters: {
    title: 'Input with errors',
    formik: {
      initialValues: { username: '' },
      initialTouched: { username: true },
      initialErrors: { username: 'Your name is required' },
      validationSchema: inputWithErrorsSchema,
    },
  },
};
