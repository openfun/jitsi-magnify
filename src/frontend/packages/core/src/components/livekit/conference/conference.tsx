import { CarouselLayout, FocusLayoutContainer, GridLayout, ParticipantTile, useLayoutContext, useTracks, VideoTrack, useEnsureParticipant, useTrackRefContext, isTrackReference, TrackMutedIndicator, ParticipantName, TrackLoop, TrackReferenceOrPlaceholder, FocusToggle, TrackRefContext, FocusToggleIcon, UnfocusToggleIcon, ParticipantPlaceholder } from "@livekit/components-react"
import { Participant, Track } from "livekit-client"
import * as React from "react"
import { UserAvatar } from "../../users"
import { AdminIcon, GridIcon, HandRaisedIcon, LayoutIcon, PinIcon, SpeakerIcon } from "../utils/icons"
import { Button, defaultTokens } from "@openfun/cunningham-react"
import { ParticipantLayoutContextProps, useParticipantLayoutContext, usePinnedTracks } from "../controls/participants"
import { Box, DropButton } from "grommet"
import { useIsMobile } from "../../../hooks/useIsMobile"


export enum Layouts {
    SPEAKER,
    PIN,
    GRID
}


export const LayoutToggle = () => {
    const context = useParticipantLayoutContext()

    const selector =
        <div style={{ backgroundColor: `${defaultTokens.theme.colors["primary-400"]}`, flexDirection: "column", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <Button icon={<PinIcon />} onClick={() => context?.setLayout(Layouts.PIN)} />
            <Button icon={<GridIcon />} onClick={() => context?.setLayout(Layouts.GRID)} />
            <Button icon={<SpeakerIcon />} onClick={() => context?.setLayout(Layouts.SPEAKER)} />
        </div>
    return (

        <DropButton dropContent={selector} dropProps={{ justify: "center", alignContent: "center", alignSelf: "center", background: "transparent", elevation: "none" }} margin={"none"} style={{ padding: "0.8em", display: "flex", justifyContent: "center" }} dropAlign={{ top: "bottom" }} >
            <LayoutIcon />
        </DropButton>

    )
}

const trackWeight = (track: TrackReferenceOrPlaceholder) => {

    return track.publication ? 1 : 0
}

export const ConferenceLayout = (props: React.CSSProperties) => {
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

    const mobile = useIsMobile()

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
                <div className="lk-grid-layout-wrapper" style={{ height: "100%" }}>
                    <GridLayout tracks={displayedVideoTracks}>
                        <VideoDisplay />
                    </GridLayout>
                </div>
            )

        case Layouts.PIN:
            const pinnedID = pinnedTracks.map(((t) => t.publication?.trackSid))
            const otherTracks = displayedVideoTracks.filter((t) => !pinnedID.includes(t.publication?.trackSid))
            
            return (
                otherTracks.length ?
                    <div className="lk-focus-layout-wrapper" style={{ height: "100%" }}>
                        <FocusLayoutContainer >
                            <CarouselLayout tracks={otherTracks} style={{ paddingTop: "0.5em" }} >
                                <VideoDisplay style={{width: !mobile ? '100%': ''}}/>
                            </CarouselLayout>

                            <div className="lk-grid-layout-wrapper" style={{ minHeight: "100%", padding: "0px", border: "solid black 0.1em", borderRadius: "0.5em" }}>
                                {pinnedTracks.length > 0 ?
                                    <GridLayout tracks={pinnedTracks}>
                                        <VideoDisplay style={{ width: "100%" }} />
                                    </GridLayout> :
                                    <ParticipantPlaceholder style={{ width: "100%" }} />
                                }
                            </div>
                        </FocusLayoutContainer>
                    </div> :
                    <div className="lk-grid-layout-wrapper" style={{ minHeight: "100%", maxHeight: "100%" }}>
                        <GridLayout tracks={pinnedTracks}>
                            <VideoDisplay />
                        </GridLayout>
                    </div>



            )

        case Layouts.SPEAKER:
            displayedVideoTracks.sort((a, b) => focusTrackPrioritize(b) - focusTrackPrioritize(a))
            let focusTrack = displayedVideoTracks[0]
            const notSpeakingTracks = displayedVideoTracks.filter((t) => t != focusTrack)
            return (
                notSpeakingTracks.length > 0 ?
                    <div className="lk-focus-layout-wrapper" style={{ height: "100%" }}>
                        <FocusLayoutContainer>
                            <CarouselLayout tracks={notSpeakingTracks} style={{ paddingTop: "0.5em" }}>
                            <VideoDisplay />
                            </CarouselLayout>
                            <div className="lk-grid-layout-wrapper" style={{ minHeight: "100%", padding: "0px", border: "solid black 0.1em", borderRadius: "0.5em" }}>
                                {focusTrack ?
                                    <GridLayout tracks={[focusTrack]}>
                                        <VideoDisplay />
                                    </GridLayout> :
                                    <ParticipantPlaceholder />
                                }
                            </div>

                        </FocusLayoutContainer >
                    </div > :
                    <div className="lk-grid-layout-wrapper" style={{ minHeight: "100%", maxHeight: "100%" }}>
                        <GridLayout tracks={[focusTrack]}>
                            <VideoDisplay />
                        </GridLayout>
                    </div>

            )
        default:
            return (
                <div className="lk-grid-layout-wrapper" style={{ height: "100%" }}>
                    <GridLayout tracks={tracksFiltered}>
                        <VideoDisplay />
                    </GridLayout>
                </div>
            )
            break;
    }
}

const focusTrackPrioritize = (a: TrackReferenceOrPlaceholder) => {
    if (a.source == Track.Source.ScreenShare) {
        return Infinity
    } else {
        return a.participant.lastSpokeAt?.getTime() ?? 0

    }
}

export interface FocusLayoutProps extends React.HTMLAttributes<HTMLMediaElement> {
    focusTrack: TrackReferenceOrPlaceholder
    otherTracks: TrackReferenceOrPlaceholder[]
}


const VideoDisplay = (props: React.HTMLAttributes<HTMLDivElement>) => {
    const trackref = useTrackRefContext()
    const participant = trackref.participant
    const { togglePinTrack, pinnedTracks } = usePinnedTracks()
    const pin = React.useMemo<boolean>(() => {
        return pinnedTracks.includes(trackref)
    }, [pinnedTracks])

    return (
        <>
            {
                <div  style={{ ...props.style, position: 'relative', display: "flex", justifyContent: "center", alignItems: "center", borderRadius: "0.5em", outline: `${participant.isSpeaking ? `solid white 0.1em` : ""}`, maxHeight: "100%", backgroundColor: "rgba(255,255,255,0.1)" }}>
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
                    <Button style={{ backgroundColor: "transparent" }} icon={!pin ? <FocusToggleIcon /> : <UnfocusToggleIcon />} onClick={() => { togglePinTrack(trackref) }}/>
                    </div>
                    <div style={{ position: "absolute", top: "0.1em", right: "0.1em", display: "flex", alignItems: "center", gap: "1em" }}>
                        {JSON.parse(participant.metadata || "{}").raised && <HandRaisedIcon />}
                    </div>

                </div>}
        </>
    )
}

const audioTrackPrioritize = (a: TrackReferenceOrPlaceholder) => {
    if (a.participant.isLocal) {
        return 3
    } else if (JSON.parse(a.participant.metadata || "{}").raised) {
        return 2
    } else {
        return -1 / (a.participant.lastSpokeAt?.getTime() ?? 1)
    }
}

export const VideoConferenceLayout = () => {

}

export const AudioConferenceLayout = () => {
    const tracks = useTracks(
        [
            { source: Track.Source.Microphone, withPlaceholder: true },
            { source: Track.Source.Camera, withPlaceholder: false },
        ]
    ).filter((t) => !isVideoActivated(t.participant) && t.participant.permissions?.canPublish).sort((a, b) => audioTrackPrioritize(a) - audioTrackPrioritize(b)).reverse()

    const tracksFiltered = tracks.filter((track) => { return track.participant.permissions?.canSubscribe })
    const layoutContext = useLayoutContext()
    return (
        <TrackLoop tracks={tracks}>
            <AudioDisplay style={{ margin: "1em", padding: "0.5em" }} />
        </TrackLoop>
    )
}

const isVideoActivated = (participant: Participant): boolean => {
    return (participant.getTrackPublications().filter((t) => (t.kind == Track.Kind.Video) && !t.isMuted).length > 0)
}


const AudioDisplay = (props: React.HTMLAttributes<HTMLDivElement>) => {
    const _ = useEnsureParticipant()
    const trackref = useTrackRefContext()
    const participant = trackref.participant
    return (

        <div style={{ display: "inline-block" }}>
            {trackref.source == Track.Source.Microphone &&
                <div style={{ margin: "10px", display: "flex", alignItems: "center", gap: "1em", borderRadius: "0.5em", outline: `${participant.isSpeaking ? `solid white 0.1em` : ""}`, backgroundColor: "rgba(255,255,255,0.1)", ...props.style }}>
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