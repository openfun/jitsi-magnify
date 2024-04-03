import { MicDisabledIcon, MicIcon, useRemoteParticipants } from "@livekit/components-react"
import { useRoomService } from "../../../../../services/livekit/room.services"
import React from "react"
import { Button, Decision, useModals } from "@openfun/cunningham-react"

export const BulkActions = () => {
    const roomService = useRoomService()
    const participants = useRemoteParticipants()
    const [allVideoMuted, setallVideoMuted] = React.useState<boolean>(true)
    const [allAudioMuted, setallAudioMuted] = React.useState<boolean>(false)
    const [allScreenMuted, setallScreenMuted] = React.useState<boolean>(true)
    const modals = useModals()

    const confirmBulk = async (): Promise<boolean> => {
        return await modals.confirmationModal({ children: `Cette action affectera tous les utilisateurs` })
            .then((decision: Decision) => {
                return decision == "yes" ? true : false
            }).catch(() => false)
    }

    const tVideo = () => {
        confirmBulk().then((choice) => {
            if (choice == true) {
                const sources = [...!allVideoMuted ? ["CAMERA"] : [], ...allAudioMuted ? ["MICROPHONE"] : [], ...allScreenMuted ? ["SCREEN_SHARE", "SCREEN_SHARE_AUDIO"] : []]
                const res = participants.map((p) => roomService.setAllowedSources(p, sources).then(() => true).catch(() => false)).every(Boolean)
                if (res) {
                    setallVideoMuted(!allVideoMuted)
                }
            }
        })

    }

    const tAudio = () => {
        confirmBulk().then((choice) => {
            if (choice == true) {
                const sources = [...allVideoMuted ? ["CAMERA"] : [], ...!allAudioMuted ? ["MICROPHONE"] : [], ...allScreenMuted ? ["SCREEN_SHARE", "SCREEN_SHARE_AUDIO"] : []]
                const res = participants.map((p) => roomService.setAllowedSources(p, sources).then(() => true).catch(() => false)).every(Boolean)
                if (res) {
                    setallAudioMuted(!allAudioMuted)
                }
            }
        })
    }

    const tScreen = () => {
        confirmBulk().then((choice) => {
            if (choice == true) {
                const sources = [...allVideoMuted ? ["CAMERA"] : [], ...allAudioMuted ? ["MICROPHONE"] : [], ...!allScreenMuted ? ["SCREEN_SHARE", "SCREEN_SHARE_AUDIO"] : []]
                const res = participants.map((p) => roomService.setAllowedSources(p, sources).then(() => true).catch(() => false)).every(Boolean)
                if (res) {
                    setallScreenMuted(!allScreenMuted)
                }
            }
        })
    }

    return (
        <div style={{ justifyContent: "center", display: "flex", gap: "0.5em" }}>
            <Button style={{ backgroundColor: "transparent" }} onClick={tAudio} icon={allAudioMuted ? <MicDisabledIcon /> : <MicIcon  />} >{!allAudioMuted? "Couper tous les micros" : "Autoriser à parler"}</Button>
        </div>
    )
}