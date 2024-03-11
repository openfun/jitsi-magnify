import { useQuery } from "@tanstack/react-query";
import { LiveKitMeeting } from "../../../components/livekit"
import { useAuthContext } from "../../../context"
import { MagnifyQueryKeys } from "../../../utils";
import { useNavigate, useParams } from "react-router-dom";
import { RoomsRepository } from "../../../services";
import React, { Fragment, useContext, useMemo, useState } from "react";
import { Box } from "grommet";
import { LiveKitRoom, PreJoin } from "@livekit/components-react";
import { defineMessages, useIntl } from "react-intl";
import { DEFAULT_LIVEKIT_DOMAIN } from "../../../utils/settings";
import { Room } from "livekit-client";

const messages = defineMessages({
  privateRoomError: {
    defaultMessage: 'Private room, you must connect.',
    description: 'Error when attempting to join a private room while not registered',
    id: 'views.rooms.livekit.index.privateRoom'
  }
})

export interface LocalUserChoices {
  videoEnabled: boolean,
  audioEnabled: boolean,
  videoDeviceId: string,
  audioDeviceId: string,
  username: string,
}

const UserPresets = React.createContext<LocalUserChoices>({} as LocalUserChoices)

export const usePresets = () => {
  const context = useContext(UserPresets)
  return context
}

export const RoomLiveKitView = () => {

  const navigate = useNavigate()

  const handleDisconnect = () => {
    navigate('/')
  }

  const intl = useIntl();
  const { id } = useParams()
  const [ready, setReady] = useState<boolean>()
  const user = useAuthContext().user
  const [choices, setChoices] = useState<LocalUserChoices>({
    videoEnabled: true,
    audioEnabled: false,
    videoDeviceId: '',
    audioDeviceId: '',
    username: user?.name ?? '',
  })

  const { data: room, isLoading, refetch } = useQuery([MagnifyQueryKeys.ROOM, id], () => {
    return RoomsRepository.get(id, user ? undefined : choices.username);
  }, { enabled: false });

  useEffect(() => {
    if (ready == true) {
      refetch()
    }
  }, [choices])

  const handlePreJoinSubmit = (userChoices: LocalUserChoices) => {
    setChoices(userChoices)
    setReady(true)
  }
  
  if (!isLoading && room && (room.livekit?.token == null)) {
    return <>{intl.formatMessage(messages.privateRoomError)}</>;
  }

  const roomOptions = useMemo(() => {
    return ({
      videoCaptureDefaults: {
        deviceId: choices.videoDeviceId ?? undefined
      },
      audioCaptureDefaults: {
        deviceId: choices.audioDeviceId ?? undefined
      },
      dynacast: true,
    })
  }, [choices])

  return (
    <Fragment>
      {!isLoading && (
        ready ?
          <LiveKitRoom data-lk-theme="default" serverUrl={DEFAULT_LIVEKIT_DOMAIN} token={room?.jitsi.token} connect={true} room={new Room(roomOptions)} audio={choices.audioEnabled} video={choices.videoEnabled} onDisconnected={handleDisconnect} connectOptions={{ autoSubscribe: true }}>
            <LiveKitMeeting token={room!.jitsi.token} />
          </LiveKitRoom>
          :
          <Box style={{ backgroundColor: "black", width: "100%", height: "100%", display: "flex", justifyContent: "center", alignItems: "center" }}>
            <PreJoin style={{ backgroundColor: "black" }} data-lk-theme="default" onSubmit={handlePreJoinSubmit} defaults={choices} persistUserChoices={true}></PreJoin>
          </Box>
      )}
    </Fragment>
  )
}



