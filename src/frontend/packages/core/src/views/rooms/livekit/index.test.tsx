import { createMemoryRouter} from "react-router-dom";
import { describe, it } from "vitest";
import { RoomLiveKitView } from ".";
import { act, fireEvent, render, screen, waitFor } from "@testing-library/react";
import { TestingContainer } from "../../../components/TestingContainer";
import userEvent from "@testing-library/user-event";
import { MediaStreamTrack, MediaDeviceInfo } from "../../../utils/media/mediastream.test";

const router = createMemoryRouter(
    [
        {
            path: '/:id',
            element: <RoomLiveKitView />,
        },
    ],
    { initialEntries: ['/123'], initialIndex: 1 },
);

describe('LiveKitView', () => {

    beforeEach(() => {
        render(<TestingContainer router={router} />)
    })

    beforeAll(() => {
        vi.spyOn(window.HTMLVideoElement.prototype, 'play').mockImplementation(async () => { })

        window.MediaStream = vi.fn().mockImplementation(() => (new MediaStreamTrack()))

        window.isSecureContext = true;

        const mockGetUserMedia = vi.fn(async () => {
            return new Promise<MediaStreamTrack>(resolve => {
                resolve(new MediaStreamTrack())
            })
        })

        Object.defineProperty(global.navigator, 'mediaDevices', {
            value: {
                getUserMedia: mockGetUserMedia,
                enumerateDevices: () => {
                    return [new MediaDeviceInfo("1"), new MediaDeviceInfo("2")]
                },
                addEventListener: () => { },
                removeEventListener: () => { }
            },
        })
    })

    it("Should allow one to join a room", async () => {
        await waitFor(() => expect(screen.getByText("Join Room")).not.toBe(null))

    })
    it("Should set your username according to your magnify user", async () => {
        await waitFor(() => expect(screen.getByDisplayValue('JohnDoe')).toBeInTheDocument())

    })
    it("Should verify that the form will submit the username", async () => {
        // Setup user
        const user = userEvent.setup();

        // Test submit
        const handleOnSubmitMock = vi.fn((e: Event) => {
            const data = new FormData(e.target as HTMLFormElement);
            assert(data.get('username') == "JohnDoe")
        })

        const join = screen.getByText('Join Room')
        expect(join).not.toBeDisabled()

        const form = await screen.getByText("Join Room").parentElement
        form!.onsubmit = handleOnSubmitMock;
        await act(() => fireEvent.submit(form!))

    })
    it("Should verify that the devices are displayed correctly", async () => {
        const user = userEvent.setup();
        const camera = screen.getByText("Camera")
        await act(() => user.click(camera!))
        const internalCamera = screen.getAllByText("Internal camera")
        assert(internalCamera.length == 2)
    })
})