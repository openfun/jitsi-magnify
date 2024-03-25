import { RouteObject } from 'react-router-dom';
import { RoomLiveKitView } from '../../../views/rooms/livekit';

export enum LiveKitPath {
    WEB_CONF = '/:id',
}

export const getLiveKitRoutes = (): RouteObject => {
    return {
        path: LiveKitPath.WEB_CONF,
        element:
            <RoomLiveKitView />
    };
};
