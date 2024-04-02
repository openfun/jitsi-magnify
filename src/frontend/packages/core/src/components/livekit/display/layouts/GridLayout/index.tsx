import { TrackReferenceOrPlaceholder } from "@livekit/components-react";
import { HTMLAttributes, ReactNode } from "react";
import { VideoDisplay } from "../../media/VideoDisplay";

export interface GridLayoutProps extends HTMLAttributes<HTMLDivElement> {
    tracks: TrackReferenceOrPlaceholder[]
}


export const GridLayout = ({ ...props }: GridLayoutProps) => {
    return (
        <div className="lk-grid-layout-wrapper" style={{ height: "100%" }}>
            <GridLayout tracks={props.tracks}>
                <VideoDisplay />
            </GridLayout>
        </div>
    )

}