import { useRoomContext, Chat, LayoutContextProvider, WidgetState, useLocalParticipant, useLocalParticipantPermissions, RoomAudioRenderer, useLayoutContext } from '@livekit/components-react'
import { ChatToggle, MagnifyControlBar } from '../controls/bar';
import { Loader } from '@openfun/cunningham-react';
import '@livekit/components-styles';
import { useState, TouchEvent, HTMLAttributes } from 'react';
import { ConferenceLayout } from '../conference/conference';
import { ParticipantLayoutToggle, ParticipantsLayout, ParticipantLayoutContext, useParticipantLayoutContext } from '../controls/participants';
import { RoomService, RoomServices } from '../../../services/livekit/room.services';
import { EventHandlerProvider } from '../../../services/livekit/events';
import { useIsMobile } from '../../../hooks/useIsMobile';
import { Box } from 'grommet';



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
                            <Meeting />
                            <RoomAudioRenderer></RoomAudioRenderer>
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
    const [chat, setChat] = useState(false)
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
        } else {
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
                <ParticipantsLayout style={{ gridRow: "1/4", gridColumn: "1/2", overflow: 'hidden' }} />
            }

            {mobile && 
                <MobileHeader style={{width:"100%", gridRow:"1/2", gridColumn:"1/3", display:'flex', justifyContent:'space-between', alignItems:'center', paddingTop:'0.5em'}}/>
            }
            <div style={{ gridRow: !mobile ? "1/2" : "2/3", gridColumn: "2/3" }} className={"confWrapper"}>
                <ConferenceLayout />
            </div>
            <Chat style={{ display: ctx.widget.state?.showChat ? 'grid' : 'none', gridRow: "1/4", gridColumn: "3/4", width: "20vw", overflow: "hidden", backgroundColor: "transparent", border: "solid black 0.1em" }} />
            <div style={{ gridRow: !mobile ? "2/3" : "3/4", gridTemplateColumns: "1fr 10fr", gridColumn: "1/4" }}>
                <MagnifyControlBar />
            </div>
        </div>
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


const Overlay = () => {
    const layoutContext = useParticipantLayoutContext()
    const chatContext = useLayoutContext()
    return (
        <>
            <Box style={{ backgroundColor: "black", position: "fixed", width: "100%", height: "100%", zIndex: 2, display: layoutContext.visible ? "grid" : "none", boxShadow: "1px 5px 5px black" }} elevation='100px'>
                <ParticipantsLayout />
            </Box>
            <Box style={{ backgroundColor: "black", position: "fixed", right: "0", width: "100%", height: "100%", zIndex: 2, display: chatContext.widget.state?.showChat ? "grid" : "none" }}>
                <Chat style={{ width: "100%", height: "100%", float: "right", backgroundColor: "transparent" }} />
            </Box>
        </>
    )
}

const MobileHeader = ({...props} : HTMLAttributes<HTMLDivElement>) => {
    const localP = useLocalParticipant()
    return (
        <div {...props} >
            <ParticipantLayoutToggle style={{backgroundColor:'transparent'}}/>
            <h4>{localP.localParticipant.name}</h4>
            <ChatToggle  props={{style:{backgroundColor:'transparent'}}}/>
        </div>
    )
}



