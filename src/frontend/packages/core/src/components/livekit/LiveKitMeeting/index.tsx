import { useRoomContext, Chat, LayoutContextProvider, WidgetState, RoomAudioRenderer } from '@livekit/components-react'
import { MagnifyControlBar } from '../controls/bar';

import '@livekit/components-styles';
import { useState } from 'react';
import { ConferenceLayout } from '../conference/conference';
import { ParticipantsLayout, ParticipantLayoutContext } from '../controls/participants';
import { RoomService, RoomServices } from '../../../services/livekit/room.services';
import { EventHandlerProvider } from '../../../services/livekit/events';


const OpenerIcon = () =>
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" stroke='currentColor' width={24} height={24}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5 8.25 12l7.5-7.5" />
    </svg>

const CloserIcon = () =>
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" width={24} height={24} strokeWidth={1.5} stroke="currentColor" >
        <path strokeLinecap="round" strokeLinejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" />
    </svg>

export interface LiveKitMeetingProps {
    token: string
}

export const LiveKitMeeting = ({
    ...props
}: LiveKitMeetingProps) => {

    const [widgetState, setWidgetState] = useState<WidgetState>({
        showChat: false,
        unreadMessages: 0,
    });
    return (
        <EventHandlerProvider>
        <RoomServiceContext token={props.token}>
            <ParticipantLayoutContext visible={true}>
                <LayoutContextProvider onWidgetChange={setWidgetState}>
                    <div style={{ maxHeight: "100vh", height: "100%", display: "grid", gridTemplateRows: "10fr 1fr", gridTemplateColumns: "0fr 6fr 0fr" }}>
                        <ParticipantsLayout style={{ gridRow: "1/2", gridColumn: "1/2", overflow: "hidden" }} />
                        <div style={{ position: "relative", gridRow: "1/2", gridColumn: "2/3", overflow: "hidden" }}>
                            <ConferenceLayout />
                        </div>
                        <Chat className={"test"} style={{ display: widgetState.showChat ? 'grid' : 'none', gridRow: "1/2", gridColumn: "3/4", width: "20vw", overflow: "hidden" }} />

                        <div style={{ gridRow: "2/3", gridTemplateColumns: "1fr 10fr", gridColumn: "1/4" }}>
                            <MagnifyControlBar />
                        </div>
                    </div>
                    <RoomAudioRenderer></RoomAudioRenderer>
                </LayoutContextProvider>
            </ParticipantLayoutContext>
        </RoomServiceContext>
        </EventHandlerProvider>

    )
}

const RoomServiceContext = (props: any) => {
    const room = useRoomContext()
    const service = new RoomService(props.token, room)
    console.log(window.config.LIVEKIT_ROOM_SERVICE_BASE_URL);

    return (
        <RoomServices.Provider value={service}>
            {props.children}
        </RoomServices.Provider>
    )
}




