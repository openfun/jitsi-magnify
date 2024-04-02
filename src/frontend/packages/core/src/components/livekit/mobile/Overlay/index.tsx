import { Chat, useLayoutContext } from "@livekit/components-react"
import { ParticipantsLayout} from "../../display/pannel/ParticipantsLayout/participants"
import { useParticipantLayoutContext } from "../../../../context/livekit/layout"
import { Box } from "grommet"

export const Overlay = () => {
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