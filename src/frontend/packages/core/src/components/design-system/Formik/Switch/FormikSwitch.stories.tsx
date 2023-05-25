import type { Meta, StoryFn, StoryObj } from '@storybook/react';
import { Formik } from 'formik';
import { FormikSwitch } from './FormikSwitch';

const meta: Meta<typeof FormikSwitch> = {
  title: 'Cunningham/Formik/Switch',
  component: FormikSwitch,
} as Meta<typeof FormikSwitch>;
export default meta;

const Template: StoryFn<typeof FormikSwitch> = (args) => (
  <div style={{ paddingBottom: '200px' }}>
    <Formik initialValues={{ enable: false }} onSubmit={() => {}}>
      <FormikSwitch {...args} />
    </Formik>
  </div>
);

type Story = StoryObj<typeof FormikSwitch>;

export const Primary: Story = {
  render: Template,
  args: {
    name: 'enable',
    label: 'Enable',
  },
};
