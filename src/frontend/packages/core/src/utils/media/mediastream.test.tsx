export class Track {
    constructor() {
        this.id = (Math.random() + 1).toString(36).substring(7);
    }
    id: string
    kind: string = "video"
    label: string = "Internal Camera"
    muted: boolean = false
    enabled: boolean = false
    readyState: string = "ended"
    stop() {
    }
    getSettings() {
        return { deviceId: "1", groupId: "local" }
    }
    getConstraints() {
        return { deviceId: "1" }
    }
    addEventListener() { }
    removeEventListener() { }
}

export class MediaDeviceInfo {
    constructor(id: string) {
        this.deviceId = id
    }
    deviceId: string = "1"
    groupID: string = "1"
    kind: string = "videoinput"
    label: string = "Internal camera"
}

export class MediaStreamTrack {
    constructor() {
        this.tracks = []
    }
    tracks: Track[] = []
    prototype: string = ""
    getVideoTracks(): Track[] { return [new Track()] }
    removeTrack(): void { }
    addTrack(): void { }
    getAudioTracks(): Track[] { return [new Track()] }
    getTracks() {
        return [new Track()]
    }
}