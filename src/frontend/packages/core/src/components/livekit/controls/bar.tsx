import { CameraDisabledIcon, CameraIcon, ChatCloseIcon, ChatIcon, LeaveIcon, MediaDeviceMenu, MicDisabledIcon, MicIcon, ScreenShareIcon, ScreenShareStopIcon, TrackToggleProps, UseChatToggleProps, useChatToggle, useDisconnectButton, useTrackToggle, useTracks } from "@livekit/components-react"
import { Button, defaultTokens } from "@openfun/cunningham-react"
import { Track } from "livekit-client"
import { Card } from "grommet"
import React, { MouseEventHandler, useEffect, useState } from "react"
import { TrackSource } from "livekit-client/dist/src/proto/livekit_models_pb"
import { ParticipantLayoutToggle } from "./participants"



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
    return (
        <Button style={buttonProps.style} onClick={buttonProps.onClick as MouseEventHandler<HTMLButtonElement> & MouseEventHandler<HTMLAnchorElement>} icon={enabled ? props.enabledIcon : props.disabledIcon} iconPosition="right">
            {props.props.children}
        </Button>
    );
}

export const ControlBar = () => {
    return (
        <div style={{ padding: "1em", display: 'flex', alignItems: "center", justifyContent: "center", gap: "1em", borderTop: "1px solid black" }}>
            <Card style={{ borderRadius: "0.6em", display: "flex", flexDirection: "row" }} className="bg-primary-400">
                <ParticipantLayoutToggle />
            </Card>
            <Card style={{ borderRadius: "0.6em", display: "flex", flexDirection: "row" }} className="bg-primary-400">
                <TrackToggle props={{ source: Track.Source.Microphone, children: "Microphone" }} enabledIcon={<MicIcon />} disabledIcon={<MicDisabledIcon />} />
                <MediaDeviceMenu style={{ backgroundColor: `${defaultTokens.theme.colors["primary-400"]}` }} kind="audioinput" />
            </Card>
            <Card style={{ borderRadius: "0.6em", display: "flex", flexDirection: "row" }} className="bg-primary-400">
                <TrackToggle props={{ source: Track.Source.Camera, children: "Camera" }} enabledIcon={<CameraIcon />} disabledIcon={<CameraDisabledIcon />} />
                <MediaDeviceMenu style={{ backgroundColor: `${defaultTokens.theme.colors["primary-400"]}` }} kind="audioinput" />
            </Card>
            <Card style={{ borderRadius: "0.6em", display: "flex", flexDirection: "row" }} className="bg-primary-400">
                <TrackToggle props={{ source: Track.Source.ScreenShare }} enabledIcon={<ScreenShareStopIcon />} disabledIcon={<ScreenShareIcon />} />
            </Card>

            <Card style={{ borderRadius: "0.6em", display: "flex", flexDirection: "row" }} className="bg-primary-400">
                <ChatToggle props={{}} />
            </Card>
            <Leave />
        </div>
    )
}