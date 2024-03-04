import { useQuery } from "@tanstack/react-query";
import { LiveKitMeeting } from "../../../components/livekit"
import { useAuthContext } from "../../../context"
import { MagnifyQueryKeys } from "../../../utils";
import { useParams } from "react-router-dom";
import { RoomsRepository } from "../../../services";
import React, { Fragment, useContext, useState } from "react";
import { Box } from "grommet";
import { PreJoin } from "@livekit/components-react";

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
  console.log(context)
  return context
}

export const RoomLiveKitView = () => {

  const { id } = useParams()

  const [ready, setReady] = useState<boolean>()
  const user = useAuthContext().user

  const [choices, setChoices] = useState<LocalUserChoices>({
    videoEnabled: true,
    audioEnabled: false,
    videoDeviceId: '',
    audioDeviceId: '',
    username: user?.username ?? '',
  })

  const handlePreJoinSubmit = (choices: LocalUserChoices) => {
    console.log("choices : ", choices)
    setChoices(choices)
    setReady(true)
  }

  const { data: room, isLoading } = useQuery([MagnifyQueryKeys.ROOM, id], () => {
    return RoomsRepository.get(id);
  });

  if (room && room.jitsi?.token == null) {
    return <>Room Privé, connectez vous</>;
  }

  return (
    <Fragment>
    {!isLoading &&  (
      ready ?
        <UserPresets.Provider value={choices}>
          <LiveKitMeeting token={room!.jitsi.token} />
        </UserPresets.Provider> :
        <Box style={{ backgroundColor: "black", width: "100%", height: "100%", display: "flex", justifyContent: "center", alignItems: "center" }}>
          <PreJoin style={{ backgroundColor: "black" }} data-lk-theme="default" onSubmit={handlePreJoinSubmit} defaults={choices} persistUserChoices={true}></PreJoin>
        </Box>
    )}
    </Fragment>
  )
}



