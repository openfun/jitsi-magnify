import { ControlBar, useRoomContext, Chat, LayoutContextProvider, WidgetState } from '@livekit/components-react'


import '@livekit/components-styles';
import { useState } from 'react';
import {ConferenceLayout} from '../conference/conference';
import { ParticipantLayoutToggle, ParticipantLayoutContext, ParticipantsLayout } from '../controls/participants';
import { RoomService, RoomServices } from '../../../services/livekit/room.services';

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
        <RoomServiceContext token={props.token}>
            <ParticipantLayoutContext visible={true}>
                <LayoutContextProvider onWidgetChange={setWidgetState}>
                    <div style={{ maxHeight: "100%", height: "100%", display: "grid", gridTemplateRows: "10fr 1fr", gridTemplateColumns: "0fr 6fr 0fr" }}>
                        <ParticipantsLayout style={{ gridRow: "1/2", gridColumn: "1/2" }} />
                        <div style={{ position: "relative",gridRow: "1/2", gridColumn: "2/3" }}>
                            <ConferenceLayout />
                            <ParticipantLayoutToggle style={{position:"absolute", top:"1em", left:"1em", gridColumn: "1/2", gridRow: "1/2"}} />
                        </div>
                        <Chat style={{ display: widgetState.showChat ? 'grid' : 'none', gridRow: "1/2", gridColumn: "3/4", width:"20vw" }} />

                        <div style={{ gridRow: "2/3", gridTemplateColumns: "1fr 10fr", gridColumn: "1/4"  }}>
                            <ControlBar controls={{ chat: true }} />
                        </div>
                    </div>
                </LayoutContextProvider>
            </ParticipantLayoutContext>
        </RoomServiceContext>

    )
}

const RoomServiceContext = (props: any) => {
    const room = useRoomContext()
    const service = new RoomService(props.token, room)

    return (
        <RoomServices.Provider value={service}>
            {props.children}
        </RoomServices.Provider>
    )
}




