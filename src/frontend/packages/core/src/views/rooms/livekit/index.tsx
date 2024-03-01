import { useQuery } from "@tanstack/react-query";
import { LiveKitMeeting } from "../../../components/livekit"
import { useAuthContext } from "../../../context"
import { MagnifyQueryKeys } from "../../../utils";
import { useParams } from "react-router-dom";
import { RoomsRepository } from "../../../services";

export const RoomLiveKitView = () => {

    const {id} = useParams()

    const { data: room, isLoading } = useQuery([MagnifyQueryKeys.ROOM, id], () => {
        return RoomsRepository.get(id);
      });

      if (room && room.jitsi?.token == null) {
        return <>Room Privé, connectez vous</>;
      }
      return (
        room &&
        <LiveKitMeeting token={room.jitsi.token}/> || <>Error while joining room</>
      )
}