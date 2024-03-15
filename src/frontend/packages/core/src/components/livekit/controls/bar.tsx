import { CameraDisabledIcon, CameraIcon, ChatIcon, LeaveIcon, MediaDeviceMenu, MicDisabledIcon, MicIcon, ScreenShareIcon, ScreenShareStopIcon, TrackToggleProps, UseChatToggleProps, useChatToggle, useDisconnectButton, useLocalParticipantPermissions, useTrackToggle } from "@livekit/components-react"
import { Button, defaultTokens } from "@openfun/cunningham-react"
import { Track } from "livekit-client"
import { Card } from "grommet"
import React, { MouseEventHandler } from "react"
import { ParticipantLayoutToggle } from "./participants"
import { useAudioAllowed, useScreenSharingAllowed, useVideoAllowed } from "../utils/hooks"
import { useIsSmallSize } from "../../../hooks/useIsMobile"



export const Leave = ({ ...props }) => {
    const { buttonProps } = useDisconnectButton(props)
    console.log(buttonProps)
    return (
        <Button onClick={buttonProps.onClick} iconPosition={"right"} style={{ backgroundColor: `${defaultTokens.theme.colors["danger-400"]}` }} icon={<LeaveIcon />} />
    )
}



export const ChatToggle = ({ ...props }: UseChatToggleProps) => {
    const { mergedProps: { onClick } } = useChatToggle(props)
    return (
        <Button onClick={onClick} icon={<ChatIcon />}></Button>
    )
}

export type ToggleSource = Exclude<
    Track.Source,
    Track.Source.ScreenShareAudio | Track.Source.Unknown
>;

interface MagnifyToggleProps<T extends ToggleSource> {
    props: TrackToggleProps<T>,
    enabledIcon: React.ReactNode,
    disabledIcon: React.ReactNode
}

export function TrackToggle<T extends ToggleSource>(props: MagnifyToggleProps<T>) {
    const { buttonProps, enabled } = useTrackToggle(props.props);
    const small = useIsSmallSize()
    return (
        <Button style={buttonProps.style} onClick={buttonProps.onClick as MouseEventHandler<HTMLButtonElement> & MouseEventHandler<HTMLAnchorElement>} icon={enabled ? props.enabledIcon : props.disabledIcon} iconPosition="right">
            { !small && props.props.children}
        </Button>
    );
}

interface ControlBarProps {
    videoControl?: boolean,
    audioControl?: boolean,
    screenSharingControl?: boolean
}

const defaultControlBarProps: ControlBarProps = {
    videoControl: true,
    audioControl: true,
    screenSharingControl: true
}

export const MagnifyControlBar = () => {
    const permissions = useLocalParticipantPermissions()
    const video = useVideoAllowed(permissions)
    const audio = useAudioAllowed(permissions)
    const screenSharing = useScreenSharingAllowed(permissions)
    return <ControlBar videoControl={video} audioControl={audio} screenSharingControl={screenSharing}/>
}

export const ControlBar = (props: ControlBarProps) => {
    const barProps = {...defaultControlBarProps, ...props }
    return (
        <div style={{ padding: "1em", display: 'flex', alignItems: "center", justifyContent: "center", gap: "1em"}}>
            <Card style={{ borderRadius: "0.6em", display: "flex", flexDirection: "row" }} className="bg-primary-400">
                <ParticipantLayoutToggle />
            </Card>

            {barProps.audioControl && <Card style={{ borderRadius: "0.6em", display: "flex", flexDirection: "row" }} className="bg-primary-400">
                <TrackToggle props={{ source: Track.Source.Microphone, children: "Microphone" }} enabledIcon={<MicIcon />} disabledIcon={<MicDisabledIcon />} />
                <MediaDeviceMenu style={{ backgroundColor: `${defaultTokens.theme.colors["primary-400"]}` }} kind="audioinput" />
            </Card>}

            {barProps.videoControl && <Card style={{ borderRadius: "0.6em", display: "flex", flexDirection: "row" }} className="bg-primary-400">
                <TrackToggle props={{ source: Track.Source.Camera, children: "Camera" }} enabledIcon={<CameraIcon />} disabledIcon={<CameraDisabledIcon />} />
                <MediaDeviceMenu style={{ backgroundColor: `${defaultTokens.theme.colors["primary-400"]}` }} kind="audioinput" />
            </Card>}

            {barProps.screenSharingControl && <Card style={{ borderRadius: "0.6em", display: "flex", flexDirection: "row" }} className="bg-primary-400">
                <TrackToggle props={{ source: Track.Source.ScreenShare }} enabledIcon={<ScreenShareStopIcon />} disabledIcon={<ScreenShareIcon />} />
            </Card>}

            <Card style={{ borderRadius: "0.6em", display: "flex", flexDirection: "row" }} className="bg-primary-400">
                <ChatToggle props={{}} />
            </Card>
            <Leave />
        </div>
    )
}