import React from 'react';
import MeetingDisambiguation from './MeetingDisambiguation';
import { ComponentStory, ComponentMeta } from '@storybook/react';
import { createMeetingInProgress } from '../../../factories/meeting';
import withToken from '../../../factories/withToken';
import createRandomRoom from '../../../factories/room';

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
