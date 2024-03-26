import { ControlBar, useLayoutContext, useLocalParticipant, useLocalParticipantPermissions } from "@livekit/components-react"
import { useParticipantLayoutContext } from "./participants"
import { useAudioAllowed, useScreenSharingAllowed, useVideoAllowed } from "../utils/hooks"
import { useEffect } from "react"

export const MagnifyControlBar = () => {
    const localPermissions = useLocalParticipantPermissions()
    const video = useVideoAllowed(localPermissions)
    const audio = useAudioAllowed(localPermissions)
    const sccreenSharing = useScreenSharingAllowed(localPermissions)
    return (
        <ControlBar controls={{ chat: true, camera : video, microphone : audio, screenShare : sccreenSharing}} />
    )
}