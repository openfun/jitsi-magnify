import { TrackReferenceOrPlaceholder } from "@livekit/components-react"
import { Participant, Track } from "livekit-client"

export const audioTrackPrioritize = (a: TrackReferenceOrPlaceholder) => {
    if (a.participant.isLocal) {
        return 3
    } else if (JSON.parse(a.participant.metadata || "{}").raised) {
        return 2
    } else {
        return -1 / (a.participant.lastSpokeAt?.getTime() ?? 1)
    }
}

export const isVideoActivated = (participant: Participant): boolean => {
    return (participant.getTrackPublications().filter((t) => (t.kind == Track.Kind.Video) && !t.isMuted).length > 0)
}

export const trackWeight = (track: TrackReferenceOrPlaceholder) => {
    return track.publication ? 1 : 0
}

export const focusTrackPrioritize = (a: TrackReferenceOrPlaceholder) => {
    if (a.source == Track.Source.ScreenShare) {
        return Infinity
    } else {
        return a.participant.lastSpokeAt?.getTime() ?? 0
    }
}