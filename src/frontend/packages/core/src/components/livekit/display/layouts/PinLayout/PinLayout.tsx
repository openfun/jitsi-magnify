import { CarouselLayout, FocusLayoutContainer, FocusToggleIcon, GridLayout, ParticipantPlaceholder, TrackReferenceOrPlaceholder } from "@livekit/components-react"
import { HTMLAttributes } from "react"
import { VideoDisplay } from "../../media/VideoDisplay/VideoDisplay"
import { useIsMobile } from "../../../../../hooks/useIsMobile"
import './style.css'
import '../layouts.css'

export interface PinLayoutProps extends HTMLAttributes<HTMLDivElement> {
    otherTracks: TrackReferenceOrPlaceholder[]
    pinnedTracks: TrackReferenceOrPlaceholder[]
}

export interface PinnedTrackUtils {
    pinnedTracks: TrackReferenceOrPlaceholder[]
    togglePinTrack: (track: TrackReferenceOrPlaceholder) => void
}

export const PinLayout = ({ ...props }: PinLayoutProps) => {
    const mobile = useIsMobile()
    return (
        props.otherTracks.length ?
            <div className="lk-focus-layout-wrapper" style={{ height: "100%" }}>
                <FocusLayoutContainer>
                    <CarouselLayout tracks={props.otherTracks} style={{paddingTop: "0.2em", paddingLeft:"0.2em", paddingRight:"0.2em"}} >
                        <VideoDisplay style={{ width: !mobile ? '100%' : '' }} />
                    </CarouselLayout>

                    <div className="lk-grid-layout-wrapper GridContainer" >
                        {props.pinnedTracks.length > 0 ?
                            <GridLayout tracks={props.pinnedTracks}>
                                <VideoDisplay style={{ width: "100%" }} />
                            </GridLayout> :
                            <div className="Placeholder" >
                                <ParticipantPlaceholder style={{ width: "100%" }} />
                                <div className="Instructions">
                                    <h4>Appuyer </h4>
                                    <FocusToggleIcon />
                                    <h4>pour suivre une vidéo</h4>
                                </div>

                            </div>
                        }
                    </div>
                </FocusLayoutContainer>
            </div> :
            <div className="lk-grid-layout-wrapper" style={{ minHeight: "100%", maxHeight: "100%" }}>
                <GridLayout tracks={props.pinnedTracks}>
                    <VideoDisplay />
                </GridLayout>
            </div>



    )
}