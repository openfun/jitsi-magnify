import React from 'react';
import MeetingRow, { MeetingRowProps } from './MeetingRow';
import { ComponentStory, ComponentMeta } from '@storybook/react';
import {
  createRandomSingleMeeting,
  createRandomMeeting,
  createMeetingInProgress,
  createMeetingOver,
} from '../../../factories/meeting';

export default {
  title: 'Meetings/MeetingRow',
  component: MeetingRow,
} as ComponentMeta<typeof MeetingRow>;

const Template: ComponentStory<typeof MeetingRow> = (args: MeetingRowProps) => (
  <MeetingRow {...args} />
);

// Stories
export const NonRepeatingMeeting = Template.bind({});
NonRepeatingMeeting.args = {
  meeting: createRandomSingleMeeting(),
  baseJitsiUrl: '',
  onJoin: undefined,
};

export const OnceAWeek = Template.bind({});
OnceAWeek.args = { meeting: createRandomMeeting(), baseJitsiUrl: '', onJoin: undefined };

export const ThriceAWeek = Template.bind({});
ThriceAWeek.args = {
  meeting: createRandomMeeting({ numberOfMeetingPerWeek: 3 }),
  baseJitsiUrl: '',
  onJoin: undefined,
};

export const InProgress = Template.bind({});
InProgress.args = { meeting: createMeetingInProgress(), baseJitsiUrl: '', onJoin: undefined };

export const Over = Template.bind({});
Over.args = { meeting: createMeetingOver(), baseJitsiUrl: '', onJoin: undefined };
