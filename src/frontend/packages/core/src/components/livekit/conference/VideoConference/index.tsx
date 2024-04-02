import { useTracks, ParticipantPlaceholder } from "@livekit/components-react"
import { Track } from "livekit-client"
import React from "react"
import { useParticipantLayoutContext, usePinnedTracks } from "../../../../context/livekit/layout"
import { GridLayout } from "../../display/layouts/GridLayout"
import { PinLayout } from "../../display/layouts/PinLayout"
import { SpeakerLayout } from "../../display/layouts/SpeakerLayout"
import { focusTrackPrioritize, trackWeight } from "../../utils/media"


export enum Layouts {
    SPEAKER,
    PIN,
    GRID
}

export const VideoConference = (props: React.CSSProperties) => {
    const rawTracks = useTracks(
        [
            { source: Track.Source.Camera, withPlaceholder: true },
            { source: Track.Source.ScreenShare, withPlaceholder: false },
            { source: Track.Source.Microphone, withPlaceholder: false }
        ]
    )

    // Filter pending join users
    const tracksFiltered = rawTracks.filter((track) => { return track.participant.permissions?.canSubscribe && track })

    // Filter camera source 
    const videoTracks = tracksFiltered.filter((t) => (t.source == Track.Source.Camera) || t.source == Track.Source.ScreenShare)
    videoTracks.sort((a, b) => trackWeight(a) - trackWeight(b))

    // Hide deactivated camera
    //const displayedVideoTracks = videoTracks.filter((t) => t.source == Track.Source.ScreenShare || (!t.publication?.isMuted && isTrackReference(t)))
    const displayedVideoTracks = videoTracks

    const context = useParticipantLayoutContext()

    const { pinnedTracks } = usePinnedTracks()

    if (Object.keys(context).length === 0) {
        return <></>
    }

    if (displayedVideoTracks.length == 0) {
        return (
            <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <ParticipantPlaceholder style={{ margin: "auto", alignItems: "center" }} />
            </div>
        )
    }

    switch (context?.layout) {
        case Layouts.GRID:
            return (
                <GridLayout tracks={displayedVideoTracks} />
            )

        case Layouts.PIN:
            const pinnedID = pinnedTracks.map(((t) => t.publication?.trackSid))
            const otherTracks = displayedVideoTracks.filter((t) => !pinnedID.includes(t.publication?.trackSid))
            return (
                <PinLayout pinnedTracks={pinnedTracks} otherTracks={otherTracks} />
            )

        case Layouts.SPEAKER:
            displayedVideoTracks.sort((a, b) => focusTrackPrioritize(b) - focusTrackPrioritize(a))
            let focusTrack = displayedVideoTracks[0]
            const notSpeakingTracks = displayedVideoTracks.filter((t) => t != focusTrack)
            return (
                <SpeakerLayout focusTrack={focusTrack} notSpeakingTracks={notSpeakingTracks} />
            )

        default:
            return (
                <GridLayout tracks={tracksFiltered} />
            )
    }
}






