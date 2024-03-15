import { CarouselLayout, FocusLayout, FocusLayoutContainer, GridLayout, ParticipantTile, useLayoutContext, usePinnedTracks, useTracks, UseTracksOptions, UseTracksHookReturnType, useEnsureRoom, useRemoteParticipant, useRemoteParticipants  } from "@livekit/components-react"
import { RemoteParticipant, Track } from "livekit-client"
import * as React from "react"
  


export const ConferenceLayout = (props: React.CSSProperties) => {
    const tracks = useTracks(
        [
            { source: Track.Source.Camera, withPlaceholder: true },
            { source: Track.Source.ScreenShare, withPlaceholder: false }
        ]
    )

    const tracksFiltered = tracks.filter((track) => {return track.participant.permissions?.canSubscribe})
    const layoutContext = useLayoutContext()
    const focusTrack = usePinnedTracks(layoutContext)?.[0]

    return (
        <div style={{ height: "100%" }}>
            {!focusTrack ? (
                <div className="lk-grid-layout-wrapper" style={{height:"100%"}}>
                    <GridLayout tracks={tracksFiltered}>
                        <ParticipantTile />
                    </GridLayout>
                </div>
            ) : (
                <div className="lk-focus-layout-wrapper">
                    <FocusLayoutContainer>
                        <CarouselLayout tracks={tracks}>
                            <ParticipantTile />
                        </CarouselLayout>
                        {focusTrack && <FocusLayout trackRef={focusTrack} />}
                    </FocusLayoutContainer>
                </div>
            )}
        </div>
    )
}