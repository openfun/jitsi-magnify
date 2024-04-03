import { FocusToggleIcon, ParticipantName, TrackMutedIndicator, UnfocusToggleIcon, VideoTrack, isTrackReference, useTrackRefContext } from "@livekit/components-react"
import { usePinnedTracks } from "../../../../../context/livekit/layout"
import React from "react"
import { Button } from "grommet"
import { Track } from "livekit-client"
import { UserAvatar } from "../../../../users"
import { HandRaisedIcon } from "../../../assets/icons"
import './style.css'

export const VideoDisplay = (props: React.HTMLAttributes<HTMLDivElement>) => {
    const trackref = useTrackRefContext()
    const participant = trackref.participant
    const { togglePinTrack, pinnedTracks } = usePinnedTracks()
    const pin = React.useMemo<boolean>(() => {
        return pinnedTracks.includes(trackref)
    }, [pinnedTracks])

    return (
        <>
            {
                <div className="VideoContainer" style={{ ...props.style, outline: JSON.parse(participant.metadata || "{}").raised ? "solid #ffd90f 0.1em" : `${participant.isSpeaking ? `solid white 0.1em` : ""}`}}>
                    {(!trackref.publication || trackref.publication.isMuted || !isTrackReference(trackref)) ?
                        <UserAvatar username={trackref.participant.name ?? ""} /> :
                        <VideoTrack trackRef={trackref} style={{ borderRadius: "0.5em" }} />
                    }
                    <div className="BLContainer" style={{ backgroundColor: `${isTrackReference(trackref) ? "rgba(0,0,0,0.4)" : "transparent"}`}}>
                        <ParticipantName />
                    </div>
                    <div className="BRContainer">
                        <TrackMutedIndicator trackRef={{ participant: participant, source: Track.Source.Microphone }} />
                    </div>
                    <div className="TLContainer">
                        { trackref.publication && <Button style={{ backgroundColor: "transparent" }} icon={!pin ? <FocusToggleIcon /> : <UnfocusToggleIcon />} onClick={() => { togglePinTrack(trackref) }} />}
                    </div>
                    <div className="TRContainer" >
                        {JSON.parse(participant.metadata || "{}").raised && <HandRaisedIcon />}
                    </div>

                </div>}
        </>
    )
}