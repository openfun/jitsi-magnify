import { Button } from "@openfun/cunningham-react"
import { useParticipantLayoutContext } from "../../../../../../context/livekit/layout"
import { ParticipantsIcon } from "../../../../assets/icons"
import { ParticipantLayoutProps } from "../../../../display/pannel/ParticipantsLayout/participants"

export const ParticipantLayoutToggle = ({ ...props }: ParticipantLayoutProps) => {
    const layoutContext = useParticipantLayoutContext()
    return (
            <Button onClick={layoutContext?.toggle} icon={<ParticipantsIcon />} style={{...props.style}} />
        
    )
}