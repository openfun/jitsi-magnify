import { useRoomContext } from "@livekit/components-react"
import { RoomService, RoomServices } from "../../../services/livekit/room.services"

export const RoomServiceContext = (props: any) => {
    const room = useRoomContext()
    const service = new RoomService(props.token, room)

    return (
        <RoomServices.Provider value={service}>
            {props.children}
        </RoomServices.Provider>
    )
}