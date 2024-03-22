import { ControlBar, useRoomContext, Chat, LayoutContextProvider, WidgetState, useLocalParticipant, useLocalParticipantPermissions, RoomAudioRenderer, useLiveKitRoom } from '@livekit/components-react'
import { MagnifyControlBar } from '../controls/bar';
import { Loader } from '@openfun/cunningham-react';
import '@livekit/components-styles';
import { useState, useEffect } from 'react';
import { AudioConferenceLayout, ConferenceLayout } from '../conference/conference';
import { ParticipantLayoutToggle, ParticipantsLayout, ParticipantLayoutContext } from '../controls/participants';
import { RoomService, RoomServices } from '../../../services/livekit/room.services';
import { EventHandlerProvider } from '../../../services/livekit/events';


export interface LiveKitMeetingProps {
    token: string,
    audioInput: boolean,
    videoInput: boolean
}

export const WaitingRoom = () => {
    return (
        <div style={{ height: "100%", display: "flex", justifyContent: "center", alignItems: "center", margin: "auto", flexDirection: "column" }}>
            <Loader size='medium' />
            <h4 > En attente de validation par un administrateur</h4>
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

    const permissions = useLocalParticipantPermissions()

    return (
        permissions?.canSubscribe ?
            <EventHandlerProvider>
                <RoomServiceContext token={props.token}>
                    <ParticipantLayoutContext visible={true} >
                        <LayoutContextProvider onWidgetChange={setWidgetState}>
                            <div style={{ maxHeight: "100%", height: "100%", display: "grid", gridTemplateRows: "10% 80% 10%", gridTemplateColumns: "0fr 6fr 0fr" }}>
                                <div style={{ height:"100px",gridRow: "1/2", gridColumn: "2/3", display: "inline-block", overflowX: "scroll", whiteSpace: "nowrap", overflowY: "hidden", marginTop: "auto", marginBottom: "auto" }}>
                                    <AudioConferenceLayout />
                                </div>
                                <ParticipantsLayout style={{ gridRow: "1/4", gridColumn: "1/2" }} />
                                <div style={{ gridRow: "2/3", gridColumn: "2/3"}} className={"confWrapper"}>
                                    <ConferenceLayout />
                                </div>
                                <Chat style={{ display: widgetState.showChat ? 'grid' : 'none', gridRow: "1/4", gridColumn: "3/4", width: "20vw", overflow: "hidden", backgroundColor:"transparent", border:"solid black 0.1em" }} />

                                <div style={{ gridRow: "3/4", gridTemplateColumns: "1fr 10fr", gridColumn: "1/4" }}>
                                    <MagnifyControlBar />
                                </div>
                            </div>
                            <RoomAudioRenderer></RoomAudioRenderer>
                        </LayoutContextProvider>
                    </ParticipantLayoutContext>
                </RoomServiceContext>
            </EventHandlerProvider>
            :
            <WaitingRoom />

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




