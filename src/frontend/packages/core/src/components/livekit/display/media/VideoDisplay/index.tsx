import { FocusToggleIcon, ParticipantName, TrackMutedIndicator, UnfocusToggleIcon, VideoTrack, isTrackReference, useTrackRefContext } from "@livekit/components-react"
import { usePinnedTracks } from "../../../../../context/livekit/layout"
import React from "react"
import { Button } from "grommet"
import { Track } from "livekit-client"
import { UserAvatar } from "../../../../users"
import { HandRaisedIcon } from "../../../assets/icons"

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
                <div style={{ ...props.style, position: 'relative', display: "flex", justifyContent: "center", alignItems: "center", borderRadius: "0.5em", outline: JSON.parse(participant.metadata || "{}").raised ? "solid #ffd90f 0.1em" : `${participant.isSpeaking ? `solid white 0.1em` : ""}`, maxHeight: "100%", backgroundColor: "rgba(255,255,255,0.1)" }}>
                    {(!trackref.publication || trackref.publication.isMuted || !isTrackReference(trackref)) ?
                        <UserAvatar username={trackref.participant.name ?? ""} /> :
                        <VideoTrack trackRef={trackref} style={{ borderRadius: "0.5em" }} />
                    }
                    <div style={{
                        position: "absolute", left: 0, bottom: 0, display: "flex", alignItems: "center", backgroundColor: `${isTrackReference(trackref) ? "rgba(0,0,0,0.4)" : "transparent"}`, padding: "0.2em", borderRadius: "0.5em"
                    }}>
                        <ParticipantName />
                    </div>
                    <div style={{
                        position: "absolute", right: "0", bottom: "0.5em", display: "flex", alignItems: "center", padding: "0.1em"
                    }}>
                        <TrackMutedIndicator trackRef={{ participant: participant, source: Track.Source.Microphone }} />
                    </div>
                    <div style={{ position: "absolute", top: "0.1em", left: "0.1em", display: "flex", alignItems: "center", gap: "1em" }}>
                        { trackref.publication && <Button style={{ backgroundColor: "transparent" }} icon={!pin ? <FocusToggleIcon /> : <UnfocusToggleIcon />} onClick={() => { togglePinTrack(trackref) }} />}
                    </div>
                    <div style={{ position: "absolute", top: "0.1em", right: "0.1em", display: "flex", alignItems: "center", gap: "1em", color: "#ffd90f" }}>
                        {JSON.parse(participant.metadata || "{}").raised && <HandRaisedIcon />}
                    </div>

                </div>}
        </>
    )
}