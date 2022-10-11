import { JitsiMeeting } from '@jitsi/react-sdk';
import IJitsiMeetExternalApi from '@jitsi/react-sdk/lib/types/IJitsiMeetExternalApi';
import { Spinner } from 'grommet';
import React, { useRef } from 'react';

import { RoomSettings } from '../../../types/entities/room';
import { DEFAULT_TOOLBAR_BUTTONS } from '../../../utils/constants/jitsi/ToolbarButtons';
import { ArrayHelper } from '../../../utils/helpers/array';

export interface MagnifyMeetingProps {
  roomSlug?: string;
  roomName: string;
  meetingId?: string;
  jitsiDomain: string;
  configuration?: RoomSettings;
  jwt?: string;
}

export const MagnifyMeeting = ({ ...props }: MagnifyMeetingProps) => {
  // Jitsi refs
  const apiRef = useRef<IJitsiMeetExternalApi | null>(null);
  const iframeRef = useRef<HTMLDivElement | null>(null);

  // Users
  const [users, setUsers] = React.useState<any[]>([]);
  const handleParticipantsChanged = () => {
    const participants = apiRef.current?.getParticipantsInfo();
    setUsers(participants || []);
  };

  // Handle the Jitsi IFrame
  const handleApiReady = (apiObj: IJitsiMeetExternalApi) => {
    apiRef.current = apiObj;
    apiRef.current?.addListener('participantJoined', handleParticipantsChanged);
    apiRef.current?.addListener('participantLeft', handleParticipantsChanged);
    apiRef.current?.addListener('videoConferenceJoined', handleParticipantsChanged);
    apiRef.current?.addListener('videoConferenceLeft', handleParticipantsChanged);
    handleParticipantsChanged();
  };
  const handleIFrameLoaded = (iframe: HTMLDivElement) => {
    iframeRef.current = iframe;
    iframe.style.height = '100vh';
  };

  const getToolbarButtons = (): string[] => {
    let toolbarButtons = [...DEFAULT_TOOLBAR_BUTTONS];
    if (!props.configuration?.enableLobbyChat) {
      toolbarButtons = ArrayHelper.removeItem(toolbarButtons, 'chat');
    }

    if (!props.configuration?.screenSharingEnabled) {
      toolbarButtons = ArrayHelper.removeItem(toolbarButtons, 'desktop');
    }
    return toolbarButtons;
  };

  const getConfig = (): object => {
    return {
      ...props.configuration,
      toolbarButtons: getToolbarButtons(),
      prejoinConfig: {
        enabled: props.configuration?.waitingRoomEnabled ?? true,
      },
    };
  };

  return (
    <JitsiMeeting
      configOverwrite={getConfig()}
      domain={props.jitsiDomain}
      getIFrameRef={handleIFrameLoaded}
      jwt={props.jwt}
      onApiReady={handleApiReady}
      roomName={props.roomName}
      spinner={() => <Spinner />}
    />
  );
};
