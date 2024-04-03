import { CarouselLayout, FocusLayoutContainer, GridLayout, ParticipantPlaceholder, TrackReferenceOrPlaceholder } from "@livekit/components-react"
import { HTMLAttributes } from "react"
import { VideoDisplay } from "../../media/VideoDisplay/VideoDisplay"
import { useIsMobile } from "../../../../../hooks/useIsMobile"
import '../layouts.css'

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
                    <CarouselLayout tracks={props.notSpeakingTracks} className="Carousel">
                        <VideoDisplay style={{ width: !mobile ? '100%' : '' }} />
                    </CarouselLayout>
                    <div className="lk-grid-layout-wrapper GridContainer">
                        {props.focusTrack ?
                            <GridLayout tracks={[props.focusTrack]}>
                                <VideoDisplay />
                            </GridLayout> :
                            <ParticipantPlaceholder />
                        }
                    </div>

                </FocusLayoutContainer >
            </div > :
            <div className="lk-grid-layout-wrapper GridContainer">
                <GridLayout tracks={[props.focusTrack]}>
                    <VideoDisplay />
                </GridLayout>
            </div>
    )
}