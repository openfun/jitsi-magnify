import { CarouselLayout, FocusLayoutContainer, GridLayout, ParticipantPlaceholder, TrackReferenceOrPlaceholder } from "@livekit/components-react"
import { HTMLAttributes } from "react"
import { VideoDisplay } from "../../media/VideoDisplay"
import { useIsMobile } from "../../../../../hooks/useIsMobile"

export interface SpeakerLayoutProps extends HTMLAttributes<HTMLDivElement> {
    notSpeakingTracks: TrackReferenceOrPlaceholder[],
    focusTrack: TrackReferenceOrPlaceholder
}

export const SpeakerLayout = ({ ...props }: SpeakerLayoutProps) => {
    const mobile = useIsMobile()
    return (
        props.notSpeakingTracks.length > 0 ?
            <div className="lk-focus-layout-wrapper" style={{ height: "100%" }}>
                <FocusLayoutContainer>
                    <CarouselLayout tracks={props.notSpeakingTracks} style={{ paddingTop: "0.5em" }}>
                        <VideoDisplay style={{ width: !mobile ? '100%' : '' }} />
                    </CarouselLayout>
                    <div className="lk-grid-layout-wrapper" style={{ minHeight: "100%", padding: "0px", border: "solid black 0.1em", borderRadius: "0.5em" }}>
                        {props.focusTrack ?
                            <GridLayout tracks={[props.focusTrack]}>
                                <VideoDisplay />
                            </GridLayout> :
                            <ParticipantPlaceholder />
                        }
                    </div>

                </FocusLayoutContainer >
            </div > :
            <div className="lk-grid-layout-wrapper" style={{ minHeight: "100%", maxHeight: "100%" }}>
                <GridLayout tracks={[props.focusTrack]}>
                    <VideoDisplay />
                </GridLayout>
            </div>
    )
}