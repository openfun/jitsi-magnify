import { useLocalParticipantPermissions } from "@livekit/components-react"
import { useAudioAllowed, useScreenSharingAllowed, useVideoAllowed } from "../../utils/permissions"
import { ControlBar } from "../ControlBar/ControlBar"

export const MagnifyControlBar = () => {
    const permissions = useLocalParticipantPermissions()
    const video = useVideoAllowed(permissions)
    const audio = useAudioAllowed(permissions)
    const screenSharing = useScreenSharingAllowed(permissions)
    return <ControlBar videoControl={video} audioControl={audio} screenSharingControl={screenSharing} />
}