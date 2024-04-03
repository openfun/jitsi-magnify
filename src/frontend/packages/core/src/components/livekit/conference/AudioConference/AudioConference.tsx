import { TrackLoop, useLayoutContext, useTracks } from "@livekit/components-react"
import { Track } from "livekit-client"
import { AudioDisplay } from "../../display/media/AudioDisplay/AudioDisplay"
import { audioTrackPrioritize, isVideoActivated } from "../../utils/media"

export const AudioConference = () => {
    const tracks = useTracks(
        [
            { source: Track.Source.Microphone, withPlaceholder: true },
            { source: Track.Source.Camera, withPlaceholder: false },
        ]
    ).filter((t) => !isVideoActivated(t.participant) && t.participant.permissions?.canPublish).sort((a, b) => audioTrackPrioritize(a) - audioTrackPrioritize(b)).reverse()
    return (
        <TrackLoop tracks={tracks}>
            <AudioDisplay style={{ margin: "1em", padding: "0.5em" }} />
        </TrackLoop>
    )
}