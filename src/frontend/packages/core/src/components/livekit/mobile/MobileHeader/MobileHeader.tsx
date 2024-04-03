import { useLocalParticipant } from "@livekit/components-react"
import { HTMLAttributes } from "react"
import { ChatToggle } from "../../controls/ControlBar/ControlBar"
import { ParticipantLayoutToggle } from "../../controls/actions/togglers/ParticipantLayoutToggle/ParticipantLayoutToggle"

export const MobileHeader = ({ ...props }: HTMLAttributes<HTMLDivElement>) => {
    const localP = useLocalParticipant()
    return (
        <div {...props} >
            <ParticipantLayoutToggle style={{ backgroundColor: 'transparent' }} />
            <h4>{localP.localParticipant.name}</h4>
            <ChatToggle props={{ style: { backgroundColor: 'transparent' } }} />
        </div>
    )
}