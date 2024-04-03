import { Chat, useLayoutContext } from "@livekit/components-react"
import { ParticipantsLayout} from "../../display/pannel/ParticipantsLayout/ParticipantsLayout"
import { useParticipantLayoutContext } from "../../../../context/livekit/layout"
import { Box } from "grommet"
import './style.css'

export const Overlay = () => {
    const layoutContext = useParticipantLayoutContext()
    const chatContext = useLayoutContext()
    return (
        <>
            <Box className="RightOverlay" style={{display: layoutContext.visible ? "grid" : "none"}}>
                <ParticipantsLayout />
            </Box>
            <Box className="LeftOverlay" style={{ display: chatContext.widget.state?.showChat ? "grid" : "none" }}>
                <Chat style={{ width: "100%", height: "100%", float: "right", backgroundColor: "transparent" }} />
            </Box>
        </>
    )
}