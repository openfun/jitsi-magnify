import { ParticipantName, TrackMutedIndicator, useEnsureParticipant, useTrackRefContext } from "@livekit/components-react"
import { Track } from "livekit-client"
import { UserAvatar } from "../../../../users"
import { AdminIcon, HandRaisedIcon } from "../../../assets/icons"

export const AudioDisplay = (props: React.HTMLAttributes<HTMLDivElement>) => {
    const _ = useEnsureParticipant()
    const trackref = useTrackRefContext()
    const participant = trackref.participant
    const handraised = JSON.parse(participant.metadata || "{}").raised

    return (

        <div style={{ display: "inline-block" }}>
            {trackref.source == Track.Source.Microphone &&
                <div style={{ margin: "10px", display: "flex", alignItems: "center", gap: "1em", borderRadius: "0.5em", outline: JSON.parse(participant.metadata || "{}").raised ? "solid white 0.3em" : `${participant.isSpeaking ? `solid white 0.1em` : ""}`, backgroundColor: "rgba(255,255,255,0.1)", ...props.style }}>
                    <UserAvatar username={trackref.participant.name ?? ""} />
                    {JSON.parse(participant.metadata || "{}").admin && <AdminIcon />}
                    <ParticipantName />
                    <TrackMutedIndicator trackRef={{ participant: participant, source: Track.Source.Microphone }} />
                    {JSON.parse(participant.metadata || "{}").raised &&
                        <HandRaisedIcon />}
                </div>
            }
        </div>
    )
}