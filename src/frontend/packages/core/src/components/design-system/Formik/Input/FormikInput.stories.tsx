import type { Meta, StoryFn, StoryObj } from '@storybook/react';
import { Formik } from 'formik';
import { FormikInput } from './FormikInput';

const meta: Meta<typeof FormikInput> = {
  title: 'Cunningham/Formik/Input',
  component: FormikInput,
} as Meta<typeof FormikInput>;
export default meta;

const Template: StoryFn<typeof FormikInput> = (args) => (
  <div style={{ paddingBottom: '200px' }}>
    <Formik initialValues={{ title: '' }} onSubmit={() => {}}>
      <FormikInput {...args} />
    </Formik>
  </div>
);

type Story = StoryObj<typeof FormikInput>;

export const Primary: Story = {
  render: Template,
  args: {
    name: 'title',
    label: 'Title',
  },
};
