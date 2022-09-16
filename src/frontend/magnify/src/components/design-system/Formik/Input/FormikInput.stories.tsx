import React from 'react';
import FormikInput from './FormikInput';
import { ComponentMeta, ComponentStory } from '@storybook/react';
import withFormik from '@bbbtech/storybook-formik';
import * as Yup from 'yup';

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
} as ComponentMeta<typeof FormikInput>;

const Template: ComponentStory<typeof FormikInput> = (args, context) => (
  <div>
    {context.parameters.title}
    <FormikInput {...args} />
  </div>
);

export const basicInput = Template.bind({});

basicInput.args = {
  name: 'username',
  placeholder: 'Username',
  label: 'name',
};
basicInput.parameters = {
  title: 'Test',
};

const inputWithErrorsSchema = Yup.object().shape({
  username: Yup.string()
    .min(1, 'Too Short!')
    .max(50, 'Too Long!')
    .required('Your name is required'),
});

export const inputWithErrors = Template.bind({});

inputWithErrors.args = {
  name: 'username',
  label: 'Name',
};

inputWithErrors.parameters = {
  title: 'Input with errors',
  formik: {
    initialValues: { username: '' },
    initialTouched: { username: true },
    initialErrors: { username: 'Your name is required' },
    validationSchema: inputWithErrorsSchema,
  },
};
