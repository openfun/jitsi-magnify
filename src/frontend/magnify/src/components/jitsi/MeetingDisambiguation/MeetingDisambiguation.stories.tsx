import { ComponentStory, ComponentMeta } from '@storybook/react';
import React from 'react';
import { createMeetingInProgress } from '../../../factories/meeting';
import createRandomRoom from '../../../factories/room';
import withToken from '../../../factories/withToken';
import MeetingDisambiguation from './MeetingDisambiguation';

export default {
  title: 'Jitsi/MeetingDisambiguation',
  component: MeetingDisambiguation,
} as ComponentMeta<typeof MeetingDisambiguation>;

const Template: ComponentStory<typeof MeetingDisambiguation> = (args) => (
  <MeetingDisambiguation {...args} />
);

// create the template and stories
export const basicMeetingDisambiguation = Template.bind({});
basicMeetingDisambiguation.args = {
  roomSlug: 'my-room-slug',
  possibilities: [
    { meeting: withToken(createMeetingInProgress(), 'test-token') },
    { meeting: withToken(createMeetingInProgress(), 'test-token') },
    { room: withToken(createRandomRoom(), 'test-token') },
  ],
};

export const meetingsOnly = Template.bind({});
meetingsOnly.args = {
  roomSlug: 'my-room-slug',
  possibilities: [
    { meeting: withToken(createMeetingInProgress(), 'test-token') },
    { meeting: withToken(createMeetingInProgress(), 'test-token') },
  ],
};
