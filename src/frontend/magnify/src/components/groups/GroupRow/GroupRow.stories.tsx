import { ComponentStory, ComponentMeta } from '@storybook/react';
import { ResponsiveContext } from 'grommet';
import React from 'react';
import createRandomGroup from '../../../factories/group';
import GroupRow, { GroupRowProps } from './GroupRow';

export default {
  title: 'Groups/GroupRow',
  component: GroupRow,
} as ComponentMeta<typeof GroupRow>;

//Test component that wraps GroupRow within a ResponsiveContext.Provider with given size
interface GroupRowWithinResponsiveContextProps extends GroupRowProps {
  width: number;
  size: 'small' | 'medium' | 'large';
}
const GroupRowWithinResponsiveContext = ({
  size,
  width,
  ...rest
}: GroupRowWithinResponsiveContextProps) => {
  return (
    <ResponsiveContext.Provider value={size}>
      <div style={{ width: `${width}px` }}>
        <GroupRow {...rest} />
      </div>
    </ResponsiveContext.Provider>
  );
};
const onToggle = console.log;

// Template
const Template: ComponentStory<typeof GroupRowWithinResponsiveContext> = (
  args: GroupRowWithinResponsiveContextProps,
) => <GroupRowWithinResponsiveContext {...args} />;
const TemplateFree: ComponentStory<typeof GroupRow> = (args: GroupRowProps) => (
  <GroupRow {...args} />
);

// Stories
export const GroupRow9PeopleSmall = Template.bind({});
GroupRow9PeopleSmall.args = { width: 400, size: 'small', group: createRandomGroup(9), onToggle };

export const GroupRow9PeopleMedium = Template.bind({});
GroupRow9PeopleMedium.args = { width: 900, size: 'medium', group: createRandomGroup(9), onToggle };

export const GroupRow9PeopleLarge = Template.bind({});
GroupRow9PeopleLarge.args = { width: 1850, size: 'large', group: createRandomGroup(9), onToggle };

export const GroupRow3PeopleMedium = Template.bind({});
GroupRow3PeopleMedium.args = { width: 900, size: 'medium', group: createRandomGroup(3), onToggle };

export const GroupRow9PeopleAdaptive = TemplateFree.bind({});
GroupRow9PeopleAdaptive.args = { group: createRandomGroup(9), onToggle };
