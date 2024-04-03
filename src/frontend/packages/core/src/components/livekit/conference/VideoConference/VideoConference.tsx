import { useTracks, ParticipantPlaceholder } from "@livekit/components-react"
import { Track } from "livekit-client"
import React from "react"
import { useParticipantLayoutContext, usePinnedTracks } from "../../../../context/livekit/layout"
import { MagnifyGridLayout } from "../../display/layouts/GridLayout/GridLayout"
import { PinLayout } from "../../display/layouts/PinLayout/PinLayout"
import { SpeakerLayout } from "../../display/layouts/SpeakerLayout/SpeakerLayout"
import { focusTrackPrioritize, trackWeight } from "../../utils/media"
import './style.css'

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
            <div className="VideoConference">
                <ParticipantPlaceholder className="Placeholder" />
            </div>
        )
    }

    switch (context?.layout) {
        case Layouts.GRID:
            return (
                <MagnifyGridLayout tracks={displayedVideoTracks} />
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
                <MagnifyGridLayout tracks={tracksFiltered} />
            )
    }
}






