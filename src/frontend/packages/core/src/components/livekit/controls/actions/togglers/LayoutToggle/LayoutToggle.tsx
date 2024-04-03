import { Button } from "@openfun/cunningham-react"
import { useParticipantLayoutContext } from "../../../../../../context/livekit/layout"
import { tokens } from "../../../../../../cunningham-tokens"
import { DropButton } from "grommet"
import { GridIcon, LayoutIcon, PinIcon, SpeakerIcon, TickIcon } from "../../../../assets/icons"
import { Layouts } from "../../../../conference/VideoConference/VideoConference"
import './style.css'

export const LayoutToggle = () => {
    const context = useParticipantLayoutContext()
    const selector =
        <div className="Selector" style={{ backgroundColor: `${tokens.theme.colors["primary-400"]}`}}>
            <Button style={{ width: "100%" }} icon={<PinIcon />} onClick={() => context?.setLayout(Layouts.PIN)}>Pin {(context.layout == Layouts.PIN) ? <TickIcon /> : ""}</Button>
            <Button style={{ width: "100%" }} icon={<GridIcon />} onClick={() => context?.setLayout(Layouts.GRID)}>Grid {(context.layout == Layouts.GRID) ? <TickIcon /> : ""}</Button>
            <Button style={{ width: "100%" }} icon={<SpeakerIcon />} onClick={() => context?.setLayout(Layouts.SPEAKER)}>Speaker {(context.layout == Layouts.SPEAKER) ? <TickIcon /> : ""}</Button>
        </div>
    return (
        <DropButton dropContent={selector} dropProps={{ justify: "center", alignContent: "center", alignSelf: "center", background: "transparent", elevation: "none" }} margin={"none"} style={{ padding: "0.8em", display: "flex", justifyContent: "center" }} dropAlign={{ top: "bottom" }} >
            <LayoutIcon />
        </DropButton>
    )
}