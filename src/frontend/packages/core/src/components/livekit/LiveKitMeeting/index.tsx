import { LiveKitRoom, VideoConference, PreJoin, useTracks, useMediaDevices, useRoomContext } from '@livekit/components-react'

import '@livekit/components-styles';
import { Room } from 'livekit-client';
import { Fragment, useMemo, useState } from 'react';
import { Box, Button } from 'grommet';
import { useAuthContext } from '../../../context';
import { useNavigate } from 'react-router-dom';
import { usePresets } from '../../../views/rooms/livekit';

export interface LiveKitMeetingProps {
    token: string
}

export const LiveKitMeeting = ({
    ...props
}: LiveKitMeetingProps) => {

    const navigate = useNavigate()

    const choices = usePresets()

    const roomOptions = useMemo(() => {
        return ({
            videoCaptureDefaults: {
                deviceId: choices.videoDeviceId ?? undefined
            },
            audioCaptureDefaults: {
                deviceId: choices.audioDeviceId ?? undefined
            },
            dynacast: true,
        })
    }, [choices])

    const handleDisconnect = () => {
        navigate('/')
    }

    return (
        <LiveKitRoom data-lk-theme="default" serverUrl={window.config.LIVEKIT_DOMAIN} token={props.token} connect={true} room={new Room(roomOptions)} audio={choices.audioEnabled} onDisconnected={handleDisconnect} video={choices.videoEnabled} connectOptions={{ autoSubscribe: true }}>
            <VideoConference />
        </LiveKitRoom>
    )
}




