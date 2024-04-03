import { TrackReferenceOrPlaceholder, useRemoteParticipants } from "@livekit/components-react";
import { Dispatch, SetStateAction, createContext, useContext, PropsWithChildren, useState } from "react";
import { Layouts } from "../../../components/livekit/conference/VideoConference/VideoConference.js";
import { PinnedTrackUtils } from "../../../components/livekit/display/layouts/PinLayout/PinLayout.js";

export interface ParticipantLayoutContextProps {
    visible: boolean,
    setVisible: Dispatch<SetStateAction<boolean>>,
    toggle: () => void,
    handraised: Set<string>,
    isRaised: boolean,
    isWaiting: boolean,
    layout: Layouts,
    setLayout: (layout: Layouts) => void,
    pinnedTracks: Map<string, TrackReferenceOrPlaceholder>,
    togglePinTrack: (track: TrackReferenceOrPlaceholder) => void
}

const ParticipantLayoutContextDefault: ParticipantLayoutContextProps = {
    visible: true,
    setVisible: () => { },
    toggle: () => { },
    handraised: new Set(),
    isRaised: false,
    isWaiting: false,
    layout: Layouts.PIN,
    setLayout: (layout: Layouts) => { },
    pinnedTracks: new Map(),
    togglePinTrack: (track: TrackReferenceOrPlaceholder) => { }
}

export interface ToggleProps {
    visible: boolean,
}

export const ParticipantContext = createContext<ParticipantLayoutContextProps>(ParticipantLayoutContextDefault);

export const ParticipantLayoutContext = (props: PropsWithChildren<ToggleProps>) => {
    const [visible, setVisible] = useState<boolean>(props.visible)
    const [layout, setLayout] = useState<Layouts>(Layouts.GRID)
    const [pinnedTracks, setPinnedTracks] = useState<Map<string, TrackReferenceOrPlaceholder>>(new Map())
    const participants = useRemoteParticipants()
    const allMetadata = participants.map((value, index) => { return JSON.parse(value.metadata || "{}").raised })
    const allSubscribe = participants.map((value, index) => { return value.permissions?.canSubscribe })
    const isRaised = allMetadata.includes(true)
    const isWaiting = allSubscribe.includes(false)

    const pinTrack = (track: TrackReferenceOrPlaceholder, sid: string): void => {
        const n = new Map(pinnedTracks)
        n.set(sid, track)
        setPinnedTracks(n)
    }

    const togglePinTrack = (track: TrackReferenceOrPlaceholder) => {
        if (track.publication?.trackSid && pinnedTracks.has(track.publication.trackSid)) {
            unPinTrack(track.publication.trackSid)
        } else {
            track.publication?.trackSid && pinTrack(track, track.publication?.trackSid)
        }
    }

    const unPinTrack = (sid: string): void => {
        const n = new Map(pinnedTracks)
        n.delete(sid)
        setPinnedTracks(n)
    }

    const toggleLayout = (layout: Layouts) => {
        setLayout(layout)
    }

    const toggle = () => {
        setVisible(!visible)
    }

    return (
        <ParticipantContext.Provider value={{setVisible: setVisible,visible: visible, toggle: toggle, handraised: new Set([""]), isRaised: isRaised, isWaiting: isWaiting, layout: layout, setLayout: toggleLayout, togglePinTrack: togglePinTrack, pinnedTracks: pinnedTracks }}>
            {props.children}
        </ParticipantContext.Provider>
    )
}

export const useParticipantLayoutContext = () => {
    const context = useContext(ParticipantContext)
    return context
}

export const usePinnedTracks = (): PinnedTrackUtils => {
    const ctx = useContext(ParticipantContext)
    return { togglePinTrack: ctx.togglePinTrack, pinnedTracks: ctx.pinnedTracks ? Array.from(ctx.pinnedTracks.values()) : [] }
}