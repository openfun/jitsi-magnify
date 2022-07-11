import { Accordion, AccordionPanel, Box, Heading, Text } from 'grommet';
import React from 'react';
import { Group } from '../../../types/group';
import { SquareAvatar } from '../../design-system';

interface JitsiMeetingExamplePanelProps {
  users: { participantId: string; displayName: string }[];
  groups: Group[];
}

/**
 * This component aims to demonstrate what can be built using jitsi in magnify.
 * Here for instance a simple panel. This is only for demo purposes as a basis to
 * develop a true panel, so it is by purpose not translated.
 */
export function JitsiMeetingExamplePanel({ users, groups }: JitsiMeetingExamplePanelProps) {
  return (
    <Box
      width={{ width: '300px', max: '300px' }}
      height={{ max: '100vh' }}
      overflow={{ vertical: 'auto' }}
      pad="medium"
    >
      <Heading level="3" size="small" color="brand">
        People in this meeting
      </Heading>

      {users.map((user) => (
        <Box key={user.participantId} direction="row" margin={{ vertical: 'small' }}>
          <Text size="small" margin={{ vertical: 'auto', horizontal: '5px' }}>
            {user.displayName}
          </Text>
        </Box>
      ))}

      <Heading level="3" size="small" color="brand">
        Groups in this meeting
      </Heading>

      {groups && (
        <Accordion>
          {groups.map((group) => (
            <AccordionPanel key={group.id} label={group.name}>
              {group.members.map((member) => (
                <Box key={member.id} direction="row" margin={{ vertical: 'small' }}>
                  <SquareAvatar src={member.avatar} title={member.name} />
                  <Text size="small" margin={{ vertical: 'auto', horizontal: '5px' }}>
                    {member.name}
                  </Text>
                </Box>
              ))}
            </AccordionPanel>
          ))}
        </Accordion>
      )}
    </Box>
  );
}
