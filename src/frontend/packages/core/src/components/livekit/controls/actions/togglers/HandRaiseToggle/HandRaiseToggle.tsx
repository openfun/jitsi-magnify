import { useLocalParticipant } from "@livekit/components-react"
import { Button, VariantType, useToastProvider } from "@openfun/cunningham-react"
import { useState } from "react"
import { HandRaisedIcon } from "../../../../assets/icons"

export const HandRaiseToggle = () => {
    const localParticipant = useLocalParticipant().localParticipant

    const { toast } = useToastProvider()
    const [raised, setHand] = useState<boolean>(false)

    const error = () => {
        toast("Une erreur s'est produite", VariantType.ERROR)
    }

    const sendRaise = () => {
        const data = JSON.parse(localParticipant.metadata || "{}")
        data.raised = !raised
        localParticipant.setMetadata(JSON.stringify(data))
        setHand(!raised)
    }

    return (
        <div  >
            <Button style={{ backgroundColor: !raised ? "" : "white", color: raised ? "black" : "white" }} onClick={sendRaise} icon={<HandRaisedIcon />} />
        </div>
    )
}