import React from 'react';
import CalendarInput from './CalendarInput';
import { ComponentStory, ComponentMeta } from '@storybook/react';

export default {
  title: 'DesignSystem/CalendarInput',
  component: CalendarInput,
} as ComponentMeta<typeof CalendarInput>;

const TestForm = (props: any) => {
  const [value, setValue] = React.useState(['2020-01-01', '2020-01-02']);

  return (
    <>
      <CalendarInput
        {...props}
        value={value}
        onChange={(event) => {
          console.log(event);
          setValue(event.value as [string, string]);
        }}
      />
    </>
  );
};

const Template: ComponentStory<typeof CalendarInput> = (args) => <TestForm {...args} />;

// create the template and stories
export const basicCalendarInput = Template.bind({});
basicCalendarInput.args = {
  label: 'CalendarInput',
};

export const basic = () => (
  <CalendarInput
    label="CalendarInput"
    name="date"
    value={[new Date('2022-05-01').toUTCString(), new Date('2022-05-02').toUTCString()]}
    onChange={console.log}
  />
);
