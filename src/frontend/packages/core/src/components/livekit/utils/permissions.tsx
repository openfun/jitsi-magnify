import { ParticipantPermission } from "livekit-client/dist/src/proto/livekit_models_pb"

export const useVideoAllowed = (permissions : ParticipantPermission | undefined) : boolean => {
    return (permissions?.canPublish && (permissions?.canPublishSources ?? [1]).includes(1)) ?? true
}

export const useAudioAllowed = (permissions : ParticipantPermission | undefined) : boolean => {
    return (permissions?.canPublish && (permissions?.canPublishSources ?? [2]).includes(2)) ?? true
}

export const useScreenSharingAllowed = (permissions : ParticipantPermission | undefined) : boolean => {
    return (permissions?.canPublish && (permissions?.canPublishSources ?? [3, 4]).includes(3) && (permissions?.canPublishSources ?? [3, 4]).includes(4)) ?? true
}

