import React from "react";
import { RoomResponse } from "../../types";

const MagnifyRoomContext = React.createContext<RoomResponse>({} as RoomResponse)

type MagnifyRoomProviderProps = {
    room : RoomResponse
    children: React.ReactNode;
  };

export const useMagnifyRoomContext = () : RoomResponse =>  {
    const ctx = React.useContext(MagnifyRoomContext)
    return ctx
}

export const MagnifyRoomContextProvider = ({...props} : MagnifyRoomProviderProps) => {
    const [room, setRoom] = React.useState<RoomResponse>(props.room)
    return (
        <MagnifyRoomContext.Provider value={room}>
            {props.children}
        </MagnifyRoomContext.Provider>
    )
}