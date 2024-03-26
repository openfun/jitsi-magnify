import { CarouselLayout, FocusLayoutContainer, GridLayout, ParticipantTile, useLayoutContext, useTracks, VideoTrack, useEnsureParticipant, useTrackRefContext, isTrackReference, TrackMutedIndicator, ParticipantName, TrackLoop, TrackReferenceOrPlaceholder, FocusToggle, TrackRefContext, FocusToggleIcon, UnfocusToggleIcon, ParticipantPlaceholder } from "@livekit/components-react"
import { Participant, Track } from "livekit-client"
import * as React from "react"
import { UserAvatar } from "../../users"
import { AdminIcon, GridIcon, HandRaisedIcon, LayoutIcon, PinIcon, SpeakerIcon } from "../utils/icons"
import { Button, defaultTokens } from "@openfun/cunningham-react"
import { ParticipantLayoutContextProps, useParticipantLayoutContext, usePinnedTracks } from "../controls/participants"
import { Box, DropButton } from "grommet"
import { useIsMobile } from "../../../hooks/useIsMobile"
import { colors } from "grommet/themes/base"


export enum Layouts {
    SPEAKER,
    PIN,
    GRID
}


export const LayoutToggle = () => {
    const context = useParticipantLayoutContext()

    const selector =
        <div style={{ backgroundColor: `${defaultTokens.theme.colors["primary-400"]}`, borderRadius: "0.5em", flexDirection: "column", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <Button style={{width: "100%"}} icon={<PinIcon />} onClick={() => context?.setLayout(Layouts.PIN)}>Pin</Button>
            <Button style={{width: "100%"}} icon={<GridIcon />} onClick={() => context?.setLayout(Layouts.GRID)}>Grid</Button>
            <Button style={{width: "100%"}} icon={<SpeakerIcon />} onClick={() => context?.setLayout(Layouts.SPEAKER)}>Speaker</Button>
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
                            <CarouselLayout tracks={otherTracks} style={{ paddingTop: "0.5em", paddingLeft: "0.2em", paddingRight: "0.2em" }} >
                                <VideoDisplay style={{ width: !mobile ? '100%' : '' }} />
                            </CarouselLayout>

                            <div className="lk-grid-layout-wrapper" style={{ minHeight: "100%", padding: "0px", border: "solid black 0.1em", borderRadius: "0.5em" }}>
                                {pinnedTracks.length > 0 ?
                                    <GridLayout tracks={pinnedTracks}>
                                        <VideoDisplay style={{ width: "100%" }} />
                                    </GridLayout> :
                                    <div style={{ width: "100%", display: 'flex', flexDirection: "column", justifyContent: "center", alignItems: "center" }}>
                                        <ParticipantPlaceholder style={{ width: "100%" }} />
                                        <div style={{ display: "flex", flexDirection: "row", alignItems: "center", gap: "1em" }}>
                                            <h4>Press </h4>
                                            <FocusToggleIcon />
                                            <h4>to focus on a track</h4>
                                        </div>

                                    </div>
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
                                <VideoDisplay style={{ width: "100%" }} />
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
                        <Button style={{ backgroundColor: "transparent" }} icon={!pin ? <FocusToggleIcon /> : <UnfocusToggleIcon />} onClick={() => { togglePinTrack(trackref) }} />
                    </div>
                    <div style={{ position: "absolute", top: "0.1em", right: "0.1em", display: "flex", alignItems: "center", gap: "1em", color: "#ffd90f" }}>
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
    const handraised = JSON.parse(participant.metadata || "{}").raised
    console.log(handraised);

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








Save code participants 




import { CameraDisabledIcon, CameraIcon, ChatCloseIcon, MicDisabledIcon, MicIcon, ScreenShareIcon, ScreenShareStopIcon, TrackReferenceOrPlaceholder, VideoConference, useLocalParticipant, useRemoteParticipants } from "@livekit/components-react"
import { Button, Decision, Modal, ModalSize, Popover, VariantType, useModal, useModals, useToastProvider } from "@openfun/cunningham-react"
import React, { Dispatch, PropsWithChildren, SetStateAction, useContext, useEffect, useMemo, useRef, useState } from "react"
import { UserAvatar } from "../../users"
import { LocalParticipant, RemoteParticipant } from "livekit-client"
import { useRoomService } from "../../../services/livekit/room.services"
import { SleepIcon, ParticipantsIcon, RemoveUserIcon, MoreIcon, HandRaisedIcon, TickIcon, AdminIcon } from "../utils/icons"
import { useIsMobile } from "../../../hooks/useIsMobile"
import { useAudioAllowed, useScreenSharingAllowed, useVideoAllowed } from "../utils/hooks"
import { Layouts } from "../conference/conference"
import { f } from "msw/lib/glossary-de6278a9"


export interface ParticipantLayoutContextProps {
    visible: boolean,
    setVisible: Dispatch<SetStateAction<boolean>>,
    toggle: () => void,
    handraised: Set<string>,
    isRaised: boolean,
    isWaiting: boolean,
    layout: Layouts,
    setLayout: (layout: Layouts) => void,
    pinnedTracks: Map<string, TrackReferenceOrPlaceholder>,
    togglePinTrack: (track: TrackReferenceOrPlaceholder) => void
}

const ParticipantLayoutContextDefault: ParticipantLayoutContextProps = {
    visible: true,
    setVisible: () => { },
    toggle: () => { },
    handraised: new Set(),
    isRaised: false,
    isWaiting: false,
    layout: Layouts.PIN,
    setLayout: (layout: Layouts) => { },
    pinnedTracks: new Map(),
    togglePinTrack: (track: TrackReferenceOrPlaceholder) => { }
}

export interface ToggleProps {
    visible: boolean,
}

export const ParticipantContext = React.createContext<ParticipantLayoutContextProps>(ParticipantLayoutContextDefault);

export const useParticipantLayoutContext = () => {
    const context = useContext(ParticipantContext)
    return context
}

export const ParticipantLayoutContext = (props: PropsWithChildren<ToggleProps>) => {
    const [visible, setVisible] = useState<boolean>(props.visible)
    const [layout, setLayout] = useState<Layouts>(Layouts.GRID)
    const [pinnedTracks, setPinnedTracks] = useState<Map<string, TrackReferenceOrPlaceholder>>(new Map())
    const participants = useRemoteParticipants()
    const allMetadata = participants.map((value, index) => { return JSON.parse(value.metadata || "{}").raised })
    const allSubscribe = participants.map((value, index) => { return value.permissions?.canSubscribe })
    const isRaised = allMetadata.includes(true)
    const isWaiting = allSubscribe.includes(false)

    const pinTrack = (track: TrackReferenceOrPlaceholder, sid: string): void => {
        const n = new Map(pinnedTracks)
        n.set(sid, track)
        setPinnedTracks(n)
    }

    const togglePinTrack = (track: TrackReferenceOrPlaceholder) => {
        if (track.publication?.trackSid && pinnedTracks.has(track.publication.trackSid)) {
            unPinTrack(track.publication.trackSid)
        } else {
            track.publication?.trackSid && pinTrack(track, track.publication?.trackSid)
        }
    }

    const unPinTrack = (sid: string): void => {
        const n = new Map(pinnedTracks)
        n.delete(sid)
        setPinnedTracks(n)
    }

    const toggleLayout = (layout: Layouts) => {
        setLayout(layout)
    }

    const toggle = () => {
        setVisible(!visible)
    }

    return (
        <ParticipantContext.Provider value={{setVisible: setVisible,visible: visible, toggle: toggle, handraised: new Set([""]), isRaised: isRaised, isWaiting: isWaiting, layout: layout, setLayout: toggleLayout, togglePinTrack: togglePinTrack, pinnedTracks: pinnedTracks }}>
            {props.children}
        </ParticipantContext.Provider>
    )
}

export interface PinnedTrackUtils {
    pinnedTracks: TrackReferenceOrPlaceholder[]
    togglePinTrack: (track: TrackReferenceOrPlaceholder) => void
}

export const usePinnedTracks = (): PinnedTrackUtils => {
    const ctx = useContext(ParticipantContext)
    return { togglePinTrack: ctx.togglePinTrack, pinnedTracks: ctx.pinnedTracks ? Array.from(ctx.pinnedTracks.values()) : [] }
}

export interface ParticipantLayoutOptions {
    visible? : boolean
}

export interface ParticipantLayoutProps extends React.HTMLAttributes<HTMLDivElement>, ParticipantLayoutOptions {
    
}

interface MetaData {
    admin: boolean
}


export const ParticipantsLayout = ({ visible, ...props }: ParticipantLayoutProps) => {
    const remoteParticipants = useRemoteParticipants()
    const layoutContext = useParticipantLayoutContext()
    const localParticipant = useLocalParticipant()
    const localMetaData = ((localParticipant == undefined) || (localParticipant.localParticipant.metadata == undefined) ? DefaultMetaData : JSON.parse(localParticipant.localParticipant.metadata)) as MetaData
    const isAdmin = localMetaData.admin
    const mobile = useIsMobile()

    const participants = [localParticipant.localParticipant, ...remoteParticipants]
    return (
        <div {...props} style={{ display: layoutContext?.visible ? 'block' : 'none', width: "100%", minWidth:"20vw", }} >
            <div style={{ textAlign: "center", position: "relative", alignItems: "center", justifyItems: "center", gridTemplateColumns: "10fr 1fr" }}>
                {<h4 > Participants </h4>
                }
                <div style={{ position: "absolute", right: "0px", top: "0px", transform: "translate(0, -25%)", textAlign: "center", verticalAlign: "center" }} >
                    {<Button style={{ float: "right", backgroundColor: "transparent" }} onClick={layoutContext?.toggle} iconPosition="right" icon={<ChatCloseIcon />} />}
                </div>
            </div>
            {participants.length == 0 ?
                <div style={{ textAlign: "center", display: "flex", flexDirection: "column", alignItems: "center" }}>
                    <i>
                        Seems like you are alone there...
                    </i>
                    <SleepIcon></SleepIcon>
                </div> :
                <div>
                    {isAdmin && <AdminBulkActions />}
                    {participants.map((value, index) => {
                        return (
                            value.name &&
                            <div style={{ borderTop: "solid black 0.1em", display: "grid", alignItems: "center", justifyItems: "center", width: "100%", gridTemplateColumns: "1fr 10fr" }}>
                                <div style={{ paddingLeft: "0.5em", gridRow: "1/2", gridColumn: "1/2", display: "flex", flexDirection: "row", gap: "1em", justifyContent: "center", alignItems: "center" }}>
                                    <UserAvatar username={value.name}></UserAvatar>
                                    {JSON.parse(value.metadata || "{}").admin && <AdminIcon />}
                                </div>
                                {<div style={{ gridRow: "1/2", gridColumn: "2/3", textAlign: "left", width: "100%" }}>
                                    <p style={{ paddingLeft: "1em", width:"100%" }}>{value.name + (value.isLocal ? " ( you )" : "")}</p>
                                </div>}
                                {isAdmin && !value.isLocal && <div style={{ gridRow: "1/2", gridColumn: "3/4" }}>
                                    {<UserActions participant={value} />}
                                </div>}
                            </div>
                        )

                    })}
                </div>}
        </div>
    )
}

interface UserActionInfo {
    participant: RemoteParticipant | LocalParticipant
}

interface ParticipantMetaData {
    raised?: boolean
}

const DefaultMetaData = {
    raised: false
} as ParticipantMetaData

const UserActions = (infos: UserActionInfo) => {
    const roomService = useRoomService()

    const audio = useAudioAllowed(infos.participant.permissions)
    const video = useVideoAllowed(infos.participant.permissions)
    const screenSharing = useScreenSharingAllowed(infos.participant.permissions)

    const { toast } = useToastProvider()
    const localParticipant = infos.participant
    const localMetaData = ((localParticipant.metadata == undefined || localParticipant.metadata == "") ? DefaultMetaData : JSON.parse(localParticipant.metadata)) as ParticipantMetaData

    const handleError = () => {
        toast("An error occured", VariantType.ERROR)
    }

    const audioMute = () => {
        const allowedSources = [...!audio ? ["MICROPHONE"] : [], ...video ? ["CAMERA"] : [], ...screenSharing ? ["SCREEN_SHARE", "SCREEN_SHARE_AUDIO"] : []]
        roomService.setAllowedSources(infos.participant, allowedSources).catch(() => {
            handleError()
        })
    }

    const videoMute = () => {
        const allowedSources = [...audio ? ["MICROPHONE"] : [], ...!video ? ["CAMERA"] : [], ...screenSharing ? ["SCREEN_SHARE", "SCREEN_SHARE_AUDIO"] : []]
        roomService.setAllowedSources(infos.participant, allowedSources).catch(() => {
            handleError()
        })
    }

    const screenSharingMute = () => {
        const allowedSources = [...audio ? ["MICROPHONE"] : [], ...video ? ["CAMERA"] : [], ...!screenSharing ? ["SCREEN_SHARE", "SCREEN_SHARE_AUDIO"] : []]
        roomService.setAllowedSources(infos.participant, allowedSources).catch(() => {
            handleError()
        })
    }

    const modals = useModals()

    const removeParticipant = () => {
        const confirmRemoval = async () => {
            await modals.deleteConfirmationModal({ children: `Do you really want to remove ${infos.participant.name} ?` })
                .then((decision: Decision) => {
                    if (decision == "delete") {
                        roomService.remove(infos.participant).catch(() => handleError())
                    }
                })
        }
        confirmRemoval()
    }

    const [settingsOpened, setSettingsOpened] = useState(false)

    const switchPopover = () => {
        setSettingsOpened(!settingsOpened)
    }

    const closePopover = () => {
        setSettingsOpened(false)
    }

    const mobile = useIsMobile()

    const accept = () => {
        roomService.initParticipant(infos.participant).then(() => {
        }).catch(() => {
            handleError()
        })
    }

    const reject = () => {
        roomService.remove(infos.participant).then(() => {
        }).catch(() => {
            handleError()
        })
    }

    const kickModal = useModal()

    const parentRef = useRef(null)
    const actionDiv =

        <div style={{ justifyContent: "space-between", display: "flex", gap: "0.5em", flexDirection: "row", backgroundColor: "black" }}>
            <Button style={{ backgroundColor: "transparent" }} onClick={audioMute} icon={audio ? <MicIcon /> : <MicDisabledIcon />} />
            <Button style={{ backgroundColor: "transparent" }} onClick={videoMute} icon={video ? <CameraIcon /> : <CameraDisabledIcon />} />
            <Button style={{ backgroundColor: "transparent" }} onClick={screenSharingMute} icon={screenSharing ? <ScreenShareIcon /> : <ScreenShareStopIcon />} />
            {mobile && <Button style={{ backgroundColor: "transparent" }} onClick={removeParticipant} icon={<RemoveUserIcon />} />}
        </div>


    useEffect(() => {
        if (!infos.participant.permissions?.canSubscribe && JSON.parse(localParticipant.metadata || "{}").admin) {
            toast(infos.participant.name + ' veut rejoindre la conférence', VariantType.INFO)
        }
    }, [infos.participant])

    return (
        (infos.participant.permissions?.canSubscribe) ?
            <div ref={parentRef} style={{ justifyContent: "space-between", display: "flex", gap: "0.5em" }}>
                {!mobile && <Button style={{ backgroundColor: "transparent" }} onClick={removeParticipant} icon={<RemoveUserIcon />} />}
                {settingsOpened &&
                    <Popover parentRef={parentRef} onClickOutside={closePopover}>
                        {actionDiv}
                    </Popover>}
                <Modal {...kickModal} size={ModalSize.SMALL} title={"Warning"}>
                    {`Do you really want to remove ${infos.participant.name} ?`}
                </Modal>
                <Button onClick={switchPopover} icon={<MoreIcon />} style={{ backgroundColor: "transparent" }} />
            </div>
            :
            <div style={{ justifyContent: "space-between", display: "flex", gap: "0.5em", flexDirection: "row", backgroundColor: "" }}>
                <Button style={{ color: "#0DCE36", backgroundColor: "transparent" }} onClick={accept} icon={<TickIcon />} />
                <Button style={{ backgroundColor: "transparent" }} onClick={reject} icon={<ChatCloseIcon style={{ strokeWidth: "1.5", stroke: "red" }} />} />
            </div>

    )
}

export const ParticipantLayoutToggle = ({ ...props }: ParticipantLayoutProps) => {
    const layoutContext = useParticipantLayoutContext()
    return (
            <Button onClick={layoutContext?.toggle} icon={<ParticipantsIcon />} style={{...props.style}} />
        
    )
}


export const RaiseHand = () => {
    const localParticipant = useLocalParticipant().localParticipant


    const { toast } = useToastProvider()
    const [raised, setHand] = React.useState<boolean>(false)

    const error = () => {
        toast("An error occured", VariantType.ERROR)
    }

    const sendRaise = () => {
        const data = JSON.parse(localParticipant.metadata || "{}")
        data.raised = !raised
        localParticipant.setMetadata(JSON.stringify(data))
        setHand(!raised)
    }

    return (
        <div  >
            <Button style={{ backgroundColor: !raised ? "" : "white", color: raised ? "black" : "white" }} onClick={sendRaise} icon={<HandRaisedIcon />} />
        </div>
    )
}

export const AdminBulkActions = () => {
    const roomService = useRoomService()
    const participants = useRemoteParticipants()
    const [allVideoMuted, setallVideoMuted] = useState<boolean>(true)
    const [allAudioMuted, setallAudioMuted] = useState<boolean>(true)
    const [allScreenMuted, setallScreenMuted] = useState<boolean>(true)
    const modals = useModals()
    const allowedSources = useMemo(() => {
        return [...allVideoMuted ? ["CAMERA"] : [], ...allAudioMuted ? ["MICROPHONE"] : [], ...allScreenMuted ? ["SCREEN_SHARE", "SCREEN_SHARE_AUDIO"] : []]
    }, [allAudioMuted, allVideoMuted, allScreenMuted])


    const confirmBulk = async (): Promise<boolean> => {
        return await modals.confirmationModal({ children: `This action will affect all users` })
            .then((decision: Decision) => {
                return decision == "yes" ? true : false
            }).catch(() => false)
    }

    const tVideo = () => {
        confirmBulk().then((choice) => {
            if (choice == true) {
                const sources = [...!allVideoMuted ? ["CAMERA"] : [], ...allAudioMuted ? ["MICROPHONE"] : [], ...allScreenMuted ? ["SCREEN_SHARE", "SCREEN_SHARE_AUDIO"] : []]
                const res = participants.map((p) => roomService.setAllowedSources(p, sources).then(() => true).catch(() => false)).every(Boolean)
                if (res) {
                    setallVideoMuted(!allVideoMuted)
                }
            }
        })

    }

    const tAudio = () => {
        confirmBulk().then((choice) => {
            if (choice == true) {
                const sources = [...allVideoMuted ? ["CAMERA"] : [], ...!allAudioMuted ? ["MICROPHONE"] : [], ...allScreenMuted ? ["SCREEN_SHARE", "SCREEN_SHARE_AUDIO"] : []]
                const res = participants.map((p) => roomService.setAllowedSources(p, sources).then(() => true).catch(() => false)).every(Boolean)
                if (res) {
                    setallAudioMuted(!allAudioMuted)
                }
            }
        })
    }

    const tScreen = () => {
        confirmBulk().then((choice) => {
            if (choice == true) {
                const sources = [...allVideoMuted ? ["CAMERA"] : [], ...allAudioMuted ? ["MICROPHONE"] : [], ...!allScreenMuted ? ["SCREEN_SHARE", "SCREEN_SHARE_AUDIO"] : []]
                const res = participants.map((p) => roomService.setAllowedSources(p, sources).then(() => true).catch(() => false)).every(Boolean)
                if (res) {
                    setallScreenMuted(!allScreenMuted)
                }
            }
        })
    }

    return (
        <div style={{ justifyContent: "center", display: "flex", gap: "0.5em" }}>
            <Button style={{ backgroundColor: "transparent"}} onClick={tAudio} icon={!allAudioMuted ? <MicDisabledIcon /> : <MicIcon  /> } > { !allAudioMuted ? "Unmute all" : "Mute all"}</Button>
        </div>
    )
}