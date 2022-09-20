import { Formik } from 'formik';
import {
  AreasType,
  Box,
  Grid,
  GridColumnsType,
  GridSizeType,
  ResponsiveContext,
  ResponsiveValue,
} from 'grommet';
import React, { useContext } from 'react';
import { defineMessages, useIntl } from 'react-intl';

import MagnifyCard from '../../design-system/Card';
import FormikSwitch from '../../design-system/Formik/FormikSwitch';
import { FormikValuesChange } from '../../design-system/Formik/ValuesChange/FormikValuesChange';

const messages = defineMessages({
  askForAuthentication: {
    defaultMessage: `Ask for authentication`,
    description:
      'Label for the toggle in the room configuration (security) that enables asking for ' +
      'authentication when joining a room',
    id: 'components.rooms.config.askForAuthentication',
  },
  askForPassword: {
    defaultMessage: `Ask for password`,
    description:
      'Label for the toggle in the room configuration (security) that enables asking for a ' +
      'password when joining a room',
    id: 'components.rooms.config.askForPassword',
  },

  enableChat: {
    defaultMessage: `Enable chat`,
    description: 'Label for the toggle in the room configuration that enables chat',
    id: 'components.rooms.config.enableChat',
  },
  enableScreenSharing: {
    defaultMessage: `Enable screen sharing`,
    description: 'Label for the toggle in the room configuration that enables screen sharing',
    id: 'components.rooms.config.enableScreenSharing',
  },
  enableWaitingRoom: {
    defaultMessage: `Enable waiting room`,
    description:
      'Label for the toggle in the room configuration (security) that enables the waiting room',
    id: 'components.rooms.config.enableWaitingRoom',
  },
  everyoneStartsMuted: {
    defaultMessage: `Everyone starts muted`,
    description:
      'Label for the toggle in the room configuration that makes everyone starting muted',
    id: 'components.rooms.config.everyoneStartsMuted',
  },
  everyoneStartsWithoutCamera: {
    defaultMessage: `Everyone starts without camera`,
    description:
      'Label for the toggle in the room configuration that makes everyone starting without camera',
    id: 'components.rooms.config.everyoneStartsWithoutCamera',
  },
  moderationTitle: {
    defaultMessage: `Moderation`,
    description: 'Title for the room configuration section with moderation settings',
    id: 'components.rooms.config.moderationTitle',
  },
  securityTitle: {
    defaultMessage: `Security`,
    description: 'Title for the room configuration section with security settings',
    id: 'components.rooms.config.securityTitle',
  },
  settingsTitle: {
    defaultMessage: `Settings`,
    description: 'Title for the room configuration section with general settings',
    id: 'components.rooms.config.settingsTitle',
  },
});

const RoomConfig = ({ roomName }: { roomName: string }) => {
  const intl = useIntl();
  const size = useContext(ResponsiveContext);
  const initialValues = {
    askForAuthentication: true,
    askForPassword: true,
    chatEnabled: true,
    everyoneStartsMuted: true,
    everyoneStartsWithoutCamera: true,
    screenSharingEnabled: true,
    waitingRoomEnabled: true,
  };

  const isMobile = size === 'small';

  const columns: Record<ResponsiveValue, GridColumnsType> = {
    small: ['auto'],
    medium: ['auto', 'auto'],
  };

  const rows: Record<ResponsiveValue, GridSizeType[]> = {
    small: ['auto', 'auto', 'auto'],
    medium: ['auto', 'auto'],
  };

  // set the different areas you need for every size
  const areas: Record<ResponsiveValue, AreasType> = {
    small: [
      { name: 'settings', start: [0, 0], end: [0, 0] },
      { name: 'moderation', start: [0, 1], end: [0, 1] },
      { name: 'security', start: [0, 2], end: [0, 2] },
    ],
    medium: [
      { name: 'settings', start: [0, 0], end: [1, 0] },
      { name: 'moderation', start: [0, 1], end: [0, 1] },
      { name: 'security', start: [1, 1], end: [1, 1] },
    ],
  };

  return (
    <Formik initialValues={initialValues} onSubmit={(values) => console.log(values)}>
      <FormikValuesChange>
        <Grid
          areas={isMobile ? areas.small : areas.medium}
          columns={isMobile ? columns.small : columns.medium}
          gap={'20px'}
          rows={isMobile ? rows.small : rows.medium}
        >
          <Box gridArea={'settings'}>
            <MagnifyCard title={intl.formatMessage(messages.settingsTitle)}>
              <Box gap={'10px'}>
                <FormikSwitch
                  label={intl.formatMessage(messages.enableChat)}
                  name={'chatEnabled'}
                />
                <FormikSwitch
                  label={intl.formatMessage(messages.enableScreenSharing)}
                  name={'screenSharingEnabled'}
                />
              </Box>
            </MagnifyCard>
          </Box>
          <Box gap={'10px'} gridArea={'moderation'}>
            <MagnifyCard title={intl.formatMessage(messages.moderationTitle)}>
              <Box gap={'medium'} height={'100%'}>
                <FormikSwitch
                  label={intl.formatMessage(messages.everyoneStartsMuted)}
                  name={'everyoneStartsMuted'}
                />
                <FormikSwitch
                  label={intl.formatMessage(messages.everyoneStartsWithoutCamera)}
                  name={'everyoneStartsWithoutCamera'}
                />
              </Box>
            </MagnifyCard>
          </Box>

          <Box gap={'10px'} gridArea={'security'}>
            <MagnifyCard title={intl.formatMessage(messages.securityTitle)}>
              <Box gap={'medium'}>
                <FormikSwitch
                  label={intl.formatMessage(messages.enableWaitingRoom)}
                  name={'waitingRoomEnabled'}
                />
                <FormikSwitch
                  label={intl.formatMessage(messages.askForPassword)}
                  name={'askForPassword'}
                />
                <FormikSwitch
                  label={intl.formatMessage(messages.askForAuthentication)}
                  name={'askForAuthentication'}
                />
              </Box>
            </MagnifyCard>
          </Box>
        </Grid>
      </FormikValuesChange>
    </Formik>
  );
};

export default RoomConfig;
