import { useRoomContext, Chat, LayoutContextProvider, WidgetState, useLocalParticipantPermissions, RoomAudioRenderer, useLayoutContext, useTrackToggle } from '@livekit/components-react'
import { MagnifyControlBar } from '../controls/MagnifyControlBar/MagnifyControlBar';
import { Loader } from '@openfun/cunningham-react';
import '@livekit/components-styles';
import { useState, TouchEvent, useEffect } from 'react';
import { VideoConference } from '../conference/VideoConference';
import { ParticipantsLayout } from '../display/pannel/ParticipantsLayout/participants';
import { EventHandlerProvider } from '../../../services/livekit/events';
import { useIsMobile } from '../../../hooks/useIsMobile';
import { useMagnifyRoomContext } from '../../../context/room';
import { Track } from 'livekit-client';
import { Overlay } from '../mobile/Overlay';
import { MobileHeader } from '../mobile/MobileHeader';
import { RoomServiceContext } from '../../../context/livekit/roomservices';
import { ParticipantLayoutContext, useParticipantLayoutContext } from '../../../context/livekit/layout';

export interface LiveKitMeetingProps {
    token: string,
    audioInput: boolean,
    videoInput: boolean
}

export const WaitingRoom = () => {
    return (
        <div style={{ height: "100%", display: "flex", justifyContent: "center", alignItems: "center", margin: "auto", flexDirection: "column" }}>
            <Loader size='medium' />
            <h4 > En attente de validation par un modérateur</h4>
        </div>
    )
}

export const LiveKitMeeting = ({
    ...props
}: LiveKitMeetingProps) => {

    const [widgetState, setWidgetState] = useState<WidgetState>({
        showChat: false,
        unreadMessages: 0,
    });

    const room = useRoomContext()
    const permissions = useLocalParticipantPermissions()
    const magnifyRoom = useMagnifyRoomContext()
    // Apply presets
    const videoToggle = useTrackToggle({ source: Track.Source.Camera })
    const audioToggle = useTrackToggle({ source: Track.Source.Microphone })

    useEffect(() => {
        
        if (permissions?.canSubscribe) {
            if (!magnifyRoom.start_with_video_muted) {
                videoToggle.toggle(room.options.videoCaptureDefaults?.deviceId !== "")
            }
            if (!magnifyRoom.start_with_audio_muted) {
                audioToggle.toggle(room.options.audioCaptureDefaults?.deviceId !== "")
            }
        }
    }, [permissions])

    const mobile = useIsMobile()

    return (
        permissions?.canSubscribe ?
            <EventHandlerProvider>
                <RoomServiceContext token={props.token}>
                    <ParticipantLayoutContext visible={!mobile} >
                        <LayoutContextProvider onWidgetChange={setWidgetState}>
                            <Meeting />
                            <RoomAudioRenderer />
                        </LayoutContextProvider>
                    </ParticipantLayoutContext>
                </RoomServiceContext>
            </EventHandlerProvider>
            :
            <WaitingRoom />
    )
}

const Meeting = () => {
    const pContext = useParticipantLayoutContext()
    const ctx = useLayoutContext()

    const [touchStart, setTouchStart] = useState<number>(0)
    const [touchStartY, setTouchStartY] = useState<number>(0)
    const [touchEnd, setTouchEnd] = useState<number>(0)
    const minSwipeDistance = 50

    const onTouchStart = (e: TouchEvent<HTMLDivElement>) => {
        setTouchEnd(0)
        setTouchStart(e.targetTouches[0].clientX)
        setTouchStartY(e.targetTouches[0].clientY)
    }

    const onTouchMove = (e: TouchEvent<HTMLDivElement>) => {
        setTouchEnd(e.targetTouches[0].clientX)
    }

    const onTouchEnd = () => {
        if (!touchStart || !touchEnd || touchStartY > innerHeight / 2) return
        const distance = touchStart - touchEnd
        const isLeftSwipe = (distance > minSwipeDistance)
        const isRightSwipe = (distance < -minSwipeDistance)

        if (isRightSwipe) {
            if (!ctx.widget.state?.showChat) {
                pContext.setVisible(true)
            }
            ctx.widget.dispatch != undefined && ctx.widget.dispatch(({ msg: 'hide_chat' }))
        } else if (isLeftSwipe) {
            if (!pContext.visible) {
                ctx.widget.dispatch != undefined && ctx.widget.dispatch(({ msg: 'show_chat' }))
            }
            pContext.setVisible(false)
        }
    }

    const mobile = useIsMobile()

    return (
        <div style={{ maxHeight: "100%", height: "100%", display: "grid", gridTemplateRows: !mobile ? "87% 10%" : "6% 80% 9%", gridTemplateColumns: "0fr 6fr 0fr" }} onTouchEnd={onTouchEnd} onTouchStart={onTouchStart} onTouchMove={onTouchMove}>
            {mobile &&
                <Overlay />
            }
            {!mobile &&
                <ParticipantsLayout style={{ gridRow: "1/4", gridColumn: "1/2" }} />
            }

            {mobile &&
                <MobileHeader style={{ width: "100%", gridRow: "1/2", gridColumn: "1/3", display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '0.5em' }} />
            }
            <div style={{ gridRow: !mobile ? "1/2" : "2/3", gridColumn: "2/3" }} className={"confWrapper"}>
                <VideoConference />
            </div>
            <Chat style={{ display: ctx.widget.state?.showChat ? 'grid' : 'none', gridRow: "1/4", gridColumn: "3/4", width: "20vw", overflow: "hidden", backgroundColor: "transparent", border: "solid black 0.1em" }} />
            <div style={{ gridRow: !mobile ? "2/3" : "3/4", gridTemplateColumns: "1fr 10fr", gridColumn: "1/4" }}>
                <MagnifyControlBar />
            </div>
        </div>
    )
}





