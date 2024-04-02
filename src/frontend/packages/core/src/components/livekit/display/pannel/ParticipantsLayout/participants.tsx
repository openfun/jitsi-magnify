import { ChatCloseIcon, TrackReferenceOrPlaceholder, useLocalParticipant, useRemoteParticipants } from "@livekit/components-react"
import { Button, VariantType, useToastProvider } from "@openfun/cunningham-react"
import { useState } from "react"
import { UserAvatar } from "../../../../users"
import { SleepIcon, HandRaisedIcon, AdminIcon } from "../../../assets/icons"
import { BulkActions } from "../../../controls/actions/BulkActions"
import { UserActions } from "../../../controls/actions/UserActions"
import { useParticipantLayoutContext } from "../../../../../context/livekit/layout"

export interface ParticipantLayoutOptions {
    visible? : boolean
}

export interface ParticipantLayoutProps extends React.HTMLAttributes<HTMLDivElement>, ParticipantLayoutOptions {
    
}

interface MetaData {
    admin: boolean
}

export const ParticipantsLayout = ({ visible, ...props }: ParticipantLayoutProps) => {
    const remoteParticipants = useRemoteParticipants()
    const layoutContext = useParticipantLayoutContext()
    const localParticipant = useLocalParticipant()
    const localMetaData = ((localParticipant == undefined) || (localParticipant.localParticipant.metadata == undefined) ? DefaultMetaData : JSON.parse(localParticipant.localParticipant.metadata)) as MetaData
    const isAdmin = localMetaData.admin

    const participants = [localParticipant.localParticipant, ...remoteParticipants]
    return (
        <div {...props} style={{ display: layoutContext?.visible ? 'block' : 'none', width: "100%", minWidth:"30vw" }} >
            <div style={{ textAlign: "center", position: "relative", alignItems: "center", justifyItems: "center", gridTemplateColumns: "10fr 1fr" }}>
                {<h4 > Participants </h4>
                }
                <div style={{ position: "absolute", right: "0px", top: "0px", transform: "translate(0, -25%)", textAlign: "center", verticalAlign: "center" }} >
                    {<Button style={{ float: "right", backgroundColor: "transparent" }} onClick={layoutContext?.toggle} iconPosition="right" icon={<ChatCloseIcon />} />}
                </div>
            </div>
            {participants.length == 0 ?
                <div style={{ textAlign: "center", display: "flex", flexDirection: "column", alignItems: "center" }}>
                    <i>
                        Il semble que vous soyez tout seul ici...
                    </i>
                    <SleepIcon></SleepIcon>
                </div> :
                <div  style={{overflowY:'scroll', overflowX:'hidden', height:'100%'}}>
                    {isAdmin && <BulkActions />}
                    {participants.map((value, index) => {
                        return (
                            value.name &&
                            <div key={value.name} style={{ borderTop: "solid black 0.1em", display: "grid", alignItems: "center", justifyItems: "center", width: "100%", gridTemplateColumns: "1fr 10fr" }}>
                                <div style={{ paddingLeft: "0.5em", gridRow: "1/2", gridColumn: "1/2", display: "flex", flexDirection: "row", gap: "1em", justifyContent: "center", alignItems: "center" }}>
                                    <UserAvatar username={value.name}></UserAvatar>
                                    {JSON.parse(value.metadata || "{}").admin && <AdminIcon />}
                                </div>
                                {<div style={{ gridRow: "1/2", gridColumn: "2/3", textAlign: "left", width: "100%" }}>
                                    <p style={{ paddingLeft: "1em", width:"100%" }}>{value.name + (value.isLocal ? " (vous)" : "")}</p>
                                </div>}
                                {isAdmin && !value.isLocal && <div style={{ gridRow: "1/2", gridColumn: "3/4" }}>
                                    {<UserActions participant={value} />}
                                </div>}
                            </div>
                        )

                    })}
                </div>}
        </div>
    )
}

interface ParticipantMetaData {
    raised?: boolean
}

const DefaultMetaData = {
    raised: false
} as ParticipantMetaData

