import { LiveKitRoom, VideoConference, PreJoin } from '@livekit/components-react'

import { DEFAULT_LIVEKIT_DOMAIN } from '../../../utils/settings'

import '@livekit/components-styles';
import { Room } from 'livekit-client';
import { Fragment, useMemo, useState } from 'react';
import { Box } from 'grommet';
import { useAuthContext } from '../../../context';

export interface LiveKitMeetingProps {
    token: string
}

interface LocalUserChoices {
    videoEnabled: boolean,
    audioEnabled: boolean,
    videoDeviceId: string,
    audioDeviceId: string,
    username: string,
}

export const LiveKitMeeting = ({
    ...props
}: LiveKitMeetingProps) => {

    const { user } = useAuthContext()
    const [ready, setReady] = useState(false)
    const [choices, setChoices] = useState<LocalUserChoices>({
        videoEnabled: true,
        audioEnabled: false,
        videoDeviceId: '',
        audioDeviceId: '',
        username: user?.username ?? '',
    })

    const roomOptions = useMemo(() => {
        return ({
            videoCaptureDefaults: {
                deviceId: choices.videoDeviceId ?? undefined
            },
            audioCaptureDefaults: {
                deviceId: choices.audioDeviceId ?? undefined
            },
            dynacast: true
        })
    }, [choices])

    const handlePreJoinSubmit = (choices: LocalUserChoices) => {
        setChoices(choices)
        setReady(true)
    }

    return (
        <Fragment>
            {!ready &&
                <Box style={{ backgroundColor: "black", width: "100%", height: "100%", display: "flex", justifyContent: "center", alignItems: "center" }}>
                    <PreJoin style={{ backgroundColor: "black" }} data-lk-theme="default" onSubmit={handlePreJoinSubmit} defaults={choices} persistUserChoices={false}></PreJoin>
                </Box>
            }
            {ready && <LiveKitRoom data-lk-theme="default" serverUrl={DEFAULT_LIVEKIT_DOMAIN} token={props.token} connect={true} room={new Room(roomOptions)} audio={choices.audioEnabled} video={choices.videoEnabled} connectOptions={{ autoSubscribe: true }}>
                <VideoConference />
            </LiveKitRoom>}
        </Fragment>
    )
}





