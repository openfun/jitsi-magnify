import { CameraDisabledIcon, CameraIcon, ChatCloseIcon, LayoutContext, MicDisabledIcon, MicIcon, useLocalParticipant, useParticipants, useRemoteParticipants } from "@livekit/components-react"
import { Button, Toast, VariantType, useToastProvider } from "@openfun/cunningham-react"
import React, { PropsWithChildren, useContext, useEffect, useState } from "react"
import { UserAvatar } from "../../users"
import { Participant, RemoteParticipant, Track } from "livekit-client"

import { useRoomService } from "../../../services/livekit/room.services"
import { SleepIcon, ParticipantsIcon } from "../utils/icons"



export interface ParticipantLayoutContextProps {
    visible: boolean,
    toggle: () => void
}

export interface ToggleProps {
    visible: boolean
}

export const ParticipantContext = React.createContext<ParticipantLayoutContextProps | undefined>(undefined);

export const useParticipantLayoutContext = () => {
    const context = useContext(ParticipantContext)
    return context
}

export const ParticipantLayoutContext = (props: PropsWithChildren<ToggleProps>) => {
    const [visible, setVisible] = useState<boolean>(props.visible)

    const toggle = () => {
        setVisible(!visible)
    }

    return (
        <ParticipantContext.Provider value={{ visible: visible, toggle: toggle }}>
            {props.children}
        </ParticipantContext.Provider>
    )
}

export interface ParticipantLayoutOptions {

}


export interface ParticipantLayoutProps extends React.HTMLAttributes<HTMLDivElement>, ParticipantLayoutOptions {

}

export const ParticipantsLayout = ({ ...props }: ParticipantLayoutProps) => {
    const participants = useRemoteParticipants()
    const layoutContext = useParticipantLayoutContext()

    return (
        <div {...props} style={{ display: layoutContext?.visible ? 'block' : 'none', width: "20vw" }} >
            <div style={{ textAlign: "center", position: "relative", alignItems: "center", justifyItems: "center", gridTemplateColumns: "10fr 1fr" }}>
                <h4 > Participants </h4>
                <div style={{ position: "absolute", right: "0px", top: "0px", transform: "translate(0, -25%)", textAlign: "center", verticalAlign: "center" }} >
                    <Button style={{ float: "right", backgroundColor: "transparent" }} onClick={layoutContext?.toggle} iconPosition="right" icon={<ChatCloseIcon />} />
                </div>
            </div>
            {participants.length == 0 ? 
            <div style={{textAlign:"center", display:"flex", flexDirection:"column", alignItems:"center"}}>
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
                            <UserAvatar username={value.name}></UserAvatar>
                        </div>
                        <div style={{ gridRow: "1/2", gridColumn: "2/3", textAlign: "left", width: "100%" }}>
                            <p style={{ paddingLeft: "1em" }}> {value.name}</p>
                        </div>
                        <div style={{ gridRow: "1/2", gridColumn: "3/4" }}>
                            <UserActions participant={value} />
                        </div>
                    </div>
                )

            })}
        </div>
    )
}

interface UserActionInfo {
    participant: RemoteParticipant
}

const UserActions = (infos: UserActionInfo) => {
    const roomService = useRoomService()

    const [audio, setAudio] = React.useState<boolean>(true)
    const [video, setVideo] = React.useState<boolean>(true)
    const { toast } = useToastProvider()

    useEffect(() => {
        console.log('video', (infos.participant.permissions?.canPublish && (infos.participant.permissions?.canPublishSources ?? [1]).includes(1)) ?? true);

        setVideo((infos.participant.permissions?.canPublish && (infos.participant.permissions?.canPublishSources ?? [1]).includes(1)) ?? true)
        setAudio((infos.participant.permissions?.canPublish && (infos.participant.permissions?.canPublishSources ?? [2]).includes(2)) ?? true)
    }, [infos])

    const error = () => {
        toast("An error occured", VariantType.ERROR)
    }

    const audioMute = () => {
        const allowedSources = [...!audio ? ["MICROPHONE"] : [], ...video ? ["CAMERA"] : []]
        roomService.setAllowedSources(infos.participant, allowedSources).then(() => {
            setAudio(!audio)
        }).catch(() => {
            error()
        })
    }

    const videoMute = () => {
        const allowedSources = [...audio ? ["MICROPHONE"] : [], ...!video ? ["CAMERA"] : []]
        roomService.setAllowedSources(infos.participant, allowedSources).then(() => {
            setVideo(!video)
        }).catch(() => {
            error()
        })
    }

    return (
        <div style={{ justifyContent: "space-between", display: "flex", gap: "0.5em" }}>
            <Button style={{ backgroundColor: "transparent" }} onClick={audioMute} icon={audio ? <MicIcon /> : <MicDisabledIcon />} />
            <Button style={{ backgroundColor: "transparent" }} onClick={videoMute} icon={video ? <CameraIcon /> : <CameraDisabledIcon />} />
        </div>
    )
}


interface AvatarInfo {
    participant: Participant
}


export const ParticipantLayoutToggle = ({ ...props }: ParticipantLayoutProps) => {
    const layoutContext = useParticipantLayoutContext()
    return (
        <div style={{ ...props.style, visibility: layoutContext?.visible ? 'hidden' : 'visible' }} >
            <Button onClick={layoutContext?.toggle} icon={<ParticipantsIcon />} />
        </div>
    )
}