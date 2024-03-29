import { Participant, Room, Track } from "livekit-client"
import axios, { AxiosInstance } from "axios"
import React, { useContext } from "react"

class LiveKitService {
    api: AxiosInstance
    constructor(token: string) {
        this.api = axios.create(
            {
                baseURL: window.config.LIVEKIT_ROOM_SERVICE_BASE_URL,
                timeout: 1000,
                headers: { "Authorization": `Bearer ${token}` }
            }
        )

        this.api.interceptors.request.use(request => {
            return request
        })

    }
}

enum RoomServiceRoutes {
    mute = "/MutePublishedTrack",
    update = "/UpdateParticipant",
    describe = "/GetParticipant",
    remove = "/RemoveParticipant"
}

export const RoomServices = React.createContext<RoomService>({} as RoomService)

export const useRoomService = (): RoomService => {
    const context = useContext(RoomServices)
    return context
}

export interface Permissions {
    canSubscribe?: boolean,
    canPublish?: boolean,
    canPublishData?: boolean,
    canUpdateMetadata?: boolean,
    canPublishSources?: string[]
}

export class RoomService {
    token: string
    service: LiveKitService
    room: Room
    constructor(token: string, room: Room) {
        this.token = token
        this.service = new LiveKitService(token)
        this.room = room
    }

    async update(participant: Participant, newPermissions: Permissions, metadata: string): Promise<boolean> {
        const res = await this.service.api.post(
            RoomServiceRoutes.update, {
            'room': this.room.name,
            'identity': participant.identity,
            'permission': newPermissions,
            'metadata': metadata
        }
        )

        return res.status == 200
    }

    async describe(participant: Participant): Promise<Permissions> {
        const res = await this.service.api.post(
            RoomServiceRoutes.describe, {
            'room': this.room.name,
            'identity': participant.identity
        }
        )
        const permissions = res.data.permission
        return { canPublish: permissions.can_publish, canPublishData: permissions.can_publish_data, canPublishSources: permissions.can_publish_sources, canSubscribe: permissions.can_subscribe, canUpdateMetadata: permissions.can_update_metadata }
    }

    async setAllowedSources(participant: Participant, sources: string[]): Promise<boolean> {
        const permissions = participant.permissions
        const newPermissions: Permissions = {
            canPublish: sources.length > 0 ? true : false,
            canPublishData: permissions?.canPublishData,
            canSubscribe: permissions?.canSubscribe,
            canPublishSources: sources
        }
        return this.update(participant, newPermissions, participant.metadata ? participant.metadata : "{}")
    }

    async mute(participant: Participant, muted: boolean, kind: Track.Source): Promise<boolean> {
        const audioTrack = participant.getTrackPublication(kind)

        const res = await this.service.api.post(
            RoomServiceRoutes.mute, {
            'room': this.room.name,
            'identity': participant.identity,
            'muted': muted,
            'track_sid': audioTrack?.trackSid
        }
        )

        return res.status === 200
    }

    async remove(participant: Participant): Promise<boolean> {
        const res = await this.service.api.post(
            RoomServiceRoutes.remove, {
            'room': this.room.name,
            'identity': participant.identity
        }
        )
        return res.status === 200

    }

    async initParticipant(participant: Participant): Promise<boolean> {
        const p = await this.describe(participant)
        const permissions: Permissions = {
            ...p,
            canPublish: true,
            canSubscribe: true,
            canUpdateMetadata: true,
        }

        return this.update(participant, permissions, participant.metadata || "{}")
    }

    async audioMute(participant: Participant): Promise<boolean> {
        return this.mute(participant, true, Track.Source.Microphone)
    }

    async audioUnMute(participant: Participant): Promise<boolean> {
        return this.mute(participant, false, Track.Source.Microphone)
    }

    async videoMute(participant: Participant): Promise<boolean> {
        return this.mute(participant, true, Track.Source.Camera)
    }

    async videoUnMute(participant: Participant): Promise<boolean> {
        return this.mute(participant, false, Track.Source.Camera)
    }


}