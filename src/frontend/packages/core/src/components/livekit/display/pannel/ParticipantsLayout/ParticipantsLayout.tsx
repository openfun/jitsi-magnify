import { ChatCloseIcon, useLocalParticipant, useRemoteParticipants } from "@livekit/components-react"
import { Button } from "@openfun/cunningham-react"
import { UserAvatar } from "../../../../users"
import { SleepIcon, AdminIcon } from "../../../assets/icons"
import { BulkActions } from "../../../controls/actions/BulkActions/BulkActions"
import { UserActions } from "../../../controls/actions/UserActions/UserActions"
import { useParticipantLayoutContext } from "../../../../../context/livekit/layout"
import './style.css'

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
            <div className="LayoutHeader">
                {<h4 > Participants </h4>
                }
                <div className="LayoutToggle" >
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
                <div className="ParticipantsList">
                    {isAdmin && <BulkActions />}
                    {participants.map((value, index) => {
                        return (
                            value.name &&
                            <div key={value.name} className="ParticipantContainer" >
                                <div className="ProfileContainer">
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

