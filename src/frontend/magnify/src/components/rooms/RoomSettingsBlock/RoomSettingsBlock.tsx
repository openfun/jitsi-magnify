import { Box, Grid, ResponsiveContext, Text } from 'grommet';
import React, { useMemo } from 'react';
import { Room, RoomSettings } from '../../../types/room';
import { Section } from '../../design-system';
import RoomSettingToggle from '../RoomSettingToggle';

type TogglesRows = { label: string; settingKey: keyof RoomSettings }[][];

export interface RoomSettingsBlockProps {
  room: Room | undefined;
  roomName: string;
  title?: string;
  description?: string;
  toggles: TogglesRows;
}

const RoomSettingsBlock = ({
  room,
  roomName,
  title,
  description,
  toggles,
}: RoomSettingsBlockProps) => {
  const size = React.useContext(ResponsiveContext);
  const maxRowLength = useMemo(() => Math.max(...toggles.map((row) => row.length)), [toggles]);

  return (
    <Section title={title}>
      {description && <Text margin={{ bottom: 'medium' }}>{description}</Text>}
      <Grid
        columns={size !== 'small' ? { count: maxRowLength, size: 'auto' } : '100%'}
        gap="medium"
      >
        {toggles.map((row) => {
          return (
            <Box key={row.reduce((acc, toggle) => acc + '-' + toggle.settingKey, 'row')}>
              {row.map(({ label, settingKey }) => (
                <RoomSettingToggle
                  label={label}
                  checked={room?.settings?.[settingKey]}
                  roomName={roomName}
                  settingKey={settingKey}
                  key={settingKey}
                />
              ))}
              {size !== 'small' &&
                Array.from({ length: maxRowLength - row.length }, (_elt, index) => (
                  <Box key={index} />
                ))}
            </Box>
          );
        })}
      </Grid>
    </Section>
  );
};

export default RoomSettingsBlock;
