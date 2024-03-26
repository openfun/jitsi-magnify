import { CameraDisabledIcon, CameraIcon, ChatCloseIcon, MicDisabledIcon, MicIcon, ScreenShareIcon, ScreenShareStopIcon, TrackReferenceOrPlaceholder, VideoConference, useLocalParticipant, useRemoteParticipants } from "@livekit/components-react"
import { Button, Decision, Modal, ModalSize, Popover, VariantType, useModal, useModals, useToastProvider } from "@openfun/cunningham-react"
import { Dispatch, PropsWithChildren, SetStateAction, useContext, useEffect, useMemo, useRef, useState, createContext } from "react"
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

export const ParticipantContext = createContext<ParticipantLayoutContextProps>(ParticipantLayoutContextDefault);

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
    const [raised, setHand] = useState<boolean>(false)

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
            <Button style={{ backgroundColor: "transparent" }} onClick={tAudio} icon={allAudioMuted ? <MicDisabledIcon /> : <MicIcon  />} >{!allAudioMuted? "Mute all" : "Unmute all"}</Button>
        </div>
    )
}