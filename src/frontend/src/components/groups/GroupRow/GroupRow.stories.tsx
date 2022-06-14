import React from 'react';
import GroupRow, { GroupRowProps } from './GroupRow';
import { ComponentStory, ComponentMeta } from '@storybook/react';
import { Context as ResponsiveContext } from 'react-responsive';
import { mockedGroup3Members, mockedGroup9Members } from './mocks';

export default {
  title: 'Groups/GroupRow',
  component: GroupRow,
} as ComponentMeta<typeof GroupRow>;

//Test component that wraps GroupRow within a ResponsiveContext.Provider with given size
interface GroupRowWithinResponsiveContextProps extends GroupRowProps {
  width: number;
}
const GroupRowWithinResponsiveContext = (props: GroupRowWithinResponsiveContextProps) => {
  return (
    <ResponsiveContext.Provider value={{ width: props.width }}>
      <div style={{ width: `${props.width}px` }}>
        <GroupRow {...props} />
      </div>
    </ResponsiveContext.Provider>
  );
};
const onToogle = console.log;

// Template
const Template: ComponentStory<typeof GroupRowWithinResponsiveContext> = (
  args: GroupRowWithinResponsiveContextProps,
) => <GroupRowWithinResponsiveContext {...args} />;

// Stories
export const GroupRow9People400px = Template.bind({});
GroupRow9People400px.args = { width: 400, group: mockedGroup9Members, onToogle };

export const GroupRow9People700px = Template.bind({});
GroupRow9People700px.args = { width: 700, group: mockedGroup9Members, onToogle };

export const GroupRow9People900px = Template.bind({});
GroupRow9People900px.args = { width: 900, group: mockedGroup9Members, onToogle };

export const GroupRow9People1300px = Template.bind({});
GroupRow9People1300px.args = { width: 1300, group: mockedGroup9Members, onToogle };

export const GroupRow9People1850px = Template.bind({});
GroupRow9People1850px.args = { width: 1850, group: mockedGroup9Members, onToogle };

export const GroupRow3People1300px = Template.bind({});
GroupRow3People1300px.args = { width: 1300, group: mockedGroup3Members, onToogle };
