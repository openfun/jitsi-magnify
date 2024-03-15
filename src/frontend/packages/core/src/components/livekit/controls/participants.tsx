import { CameraDisabledIcon, CameraIcon, ChatCloseIcon, GearIcon, MicDisabledIcon, MicIcon, ScreenShareIcon, ScreenShareStopIcon, useLocalParticipant, useRemoteParticipants } from "@livekit/components-react"
import { Button, Decision, Modal, ModalSize, Popover, VariantType, useModal, useModals, useToastProvider } from "@openfun/cunningham-react"
import React, { PropsWithChildren, useContext, useEffect, useRef, useState } from "react"
import { UserAvatar } from "../../users"
import { Participant, RemoteParticipant } from "livekit-client"

import { useRoomService } from "../../../services/livekit/room.services"
import { SleepIcon, ParticipantsIcon, RemoveUserIcon, MoreIcon, HandRaisedIcon, TickIcon } from "../utils/icons"
import { useIsMobile } from "../../../hooks/useIsMobile"
import { useAudioAllowed, useScreenSharingAllowed, useVideoAllowed } from "../utils/hooks"





export interface ParticipantLayoutContextProps {
    visible: boolean,
    toggle: () => void,
    handraised: Set<string>,
    isRaised: boolean,
    isWaiting: boolean

}

export interface ToggleProps {
    visible: boolean,
}

export const ParticipantContext = React.createContext<ParticipantLayoutContextProps | undefined>(undefined);

export const useParticipantLayoutContext = () => {
    const context = useContext(ParticipantContext)
    return context
}

export const ParticipantLayoutContext = (props: PropsWithChildren<ToggleProps>) => {
    const [visible, setVisible] = useState<boolean>(props.visible)
    const participants = useRemoteParticipants()

    const allMetadata = participants.map((value, index) => { return JSON.parse(value.metadata || "{}").raised })
    const allSubscribe = participants.map((value, index) => { return value.permissions?.canSubscribe })
    const isRaised = allMetadata.includes(true)
    const isWaiting = allSubscribe.includes(false)

    const toggle = () => {
        setVisible(!visible)
    }

    return (
        <ParticipantContext.Provider value={{ visible: visible, toggle: toggle, handraised: new Set([""]), isRaised: isRaised, isWaiting: isWaiting }}>
            {props.children}
        </ParticipantContext.Provider>
    )
}

export interface ParticipantLayoutOptions {

}


export interface ParticipantLayoutProps extends React.HTMLAttributes<HTMLDivElement>, ParticipantLayoutOptions {

}

interface MetaData {
    admin: boolean
}


export const ParticipantsLayout = ({ ...props }: ParticipantLayoutProps) => {
    const participants = useRemoteParticipants()
    const layoutContext = useParticipantLayoutContext()
    const localParticipant = useLocalParticipant().localParticipant.metadata
    const localMetaData = ((localParticipant == undefined) ? DefaultMetaData : JSON.parse(localParticipant)) as MetaData
    const isAdmin = localMetaData.admin
    const mobile = useIsMobile()


    return (
        <div {...props} style={{ display: layoutContext?.visible ? 'block' : 'none', width: "20vw" }} >
            <div style={{ textAlign: "center", position: "relative", alignItems: "center", justifyItems: "center", gridTemplateColumns: "10fr 1fr" }}>
                {mobile ? <Button style={{ backgroundColor: "transparent" }} onClick={layoutContext?.toggle} icon={<ParticipantsIcon />}></Button> : <h4 > Participants </h4>
                }
                <div style={{ position: "absolute", right: "0px", top: "0px", transform: "translate(0, -25%)", textAlign: "center", verticalAlign: "center" }} >
                    {!mobile && <Button style={{ float: "right", backgroundColor: "transparent" }} onClick={layoutContext?.toggle} iconPosition="right" icon={<ChatCloseIcon />} />}
                </div>
            </div>
            {participants.length == 0 ?
                <div style={{ textAlign: "center", display: "flex", flexDirection: "column", alignItems: "center" }}>
                    <i>
                        Seems like you are alone there...
                    </i>
                    <SleepIcon></SleepIcon>
                </div> :
                participants.map((value, index) => {
                    return (
                        value.name &&
                        <div style={{ borderTop: "solid black 0.1em", display: "grid", alignItems: "center", justifyItems: "center", width: "20vw", gridTemplateColumns: "1fr 10fr 1fr" }}>
                            <div style={{ paddingLeft: "0.5em", gridRow: "1/2", gridColumn: "1/2" }}>
                                {JSON.parse(value.metadata || "{}").raised ? <Button icon={<HandRaisedIcon/>}/> : <UserAvatar username={value.name}></UserAvatar>}

                            </div>
                            {!mobile && <div style={{ gridRow: "1/2", gridColumn: "2/3", textAlign: "left", width: "100%" }}>
                                <p style={{ paddingLeft: "1em" }}> {value.name}</p>
                            </div>}
                            {isAdmin && <div style={{ gridRow: "1/2", gridColumn: "3/4" }}>
                                <UserActions participant={value} />
                            </div>}
                        </div>
                    )

                })}
        </div>
    )
}

interface UserActionInfo {
    participant: RemoteParticipant
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

    const kickModal = useModal()

    const parentRef = useRef(null)
    const actionDiv =

        <div style={{ justifyContent: "space-between", display: "flex", gap: "0.5em", flexDirection: "column", backgroundColor: "black" }}>
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
            <div style={{ justifyContent: "space-between", display: "flex", gap: "0.5em", flexDirection: "column", backgroundColor: "" }}>
                <Button style={{ color: "#0DCE36", backgroundColor: "transparent"}} onClick={accept} icon={<TickIcon  />} />
             </div>

    )
}

export const ParticipantLayoutToggle = ({ ...props }: ParticipantLayoutProps) => {
    const layoutContext = useParticipantLayoutContext()
    return (
        <div style={{ ...props.style }} >
            <Button onClick={layoutContext?.toggle} icon={<ParticipantsIcon />} style={{ color: (layoutContext?.isRaised || layoutContext?.isWaiting) ? "red" : "" }} />

        </div>
    )
}



export const RaiseHand = () => {
    const localParticipant = useLocalParticipant().localParticipant


    const { toast } = useToastProvider()
    const [raised, setHand] = React.useState<boolean>(false)

    const error = () => {
        toast("An error occured", VariantType.ERROR)
        console.log(error)
    }

    const sendRaise = () => {
        const data = JSON.parse(localParticipant.metadata || "{}")
        data.raised = !raised
        localParticipant.setMetadata(JSON.stringify(data))
        console.log("raised ? " + raised);
        setHand(!raised)
    }

    return (
    <div  >
        <Button style={{ backgroundColor: !raised ? "" : "yellow", color: raised ? "black" : "white" }} onClick={sendRaise} icon={<HandRaisedIcon />} />
    </div>
    )
}
