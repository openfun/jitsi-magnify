import { MemoryRouter, createMemoryRouter, useNavigate } from "react-router-dom";
import { describe, it } from "vitest";
import { RoomLiveKitView } from ".";
import { act, fireEvent, getByText, render, screen, waitFor } from "@testing-library/react";
import { TestingContainer } from "../../../components/TestingContainer";
import userEvent from "@testing-library/user-event";
import { server } from "../../../mocks/server";
import { rest } from "msw";
import { buildApiUrl } from "../../../services";
import { createRandomRoom } from "../../../factories";
import { useAuthContext } from "../../../context";
import React from "react";



describe('LiveKitView', () => {
    it("Should allow one to join the room", async () => {

        // Mock local storage
        const mockLocalStorage = (() => {
            let store = {} as Storage;

            return {
                getItem(key: string) {
                    return store[key];
                },

                setItem(key: string, value: string) {
                    store[key] = value;
                },

                removeItem(key: string) {
                    delete store[key];
                },

                clear() {
                    store = {} as Storage;
                },
            };
        })();

        // Mock navigator media
        interface MockedMedia {
            getTracks: any
        }

        class MockeMedia {
            getTracks() {
                return []
            }
        }

        const mockGetUserMedia = vi.fn(async () => {
            return new Promise<MockedMedia>(resolve => {
                resolve(new MockeMedia())
            })
        })

        Object.defineProperty(global.navigator, 'mediaDevices', {
            value: {
                getUserMedia: mockGetUserMedia,
            },
        })

        const router = createMemoryRouter(
            [
                {
                    path: '/:id',
                    element: <RoomLiveKitView />,
                },
            ],
            { initialEntries: ['/123'], initialIndex: 1 },
        );

        render(<TestingContainer router={router} />)

        await waitFor(() => expect(screen.getByText("Join Room")).not.toBe(null))

    }),
        it("Should set your username according to your magnify user", async () => {

            const AuthContext = React.createContext({ user: "Bob" });

            const router = createMemoryRouter(
                [
                    {
                        path: '/:id',
                        element: <AuthContext.Provider value={{ user: "Bob" }} ><RoomLiveKitView /></AuthContext.Provider>,
                    },
                ],
                { initialEntries: ['/123'], initialIndex: 1 },
            );

            render(<TestingContainer router={router} />)
            await waitFor(() => expect(screen.getByDisplayValue('JohnDoe')).toBeInTheDocument())

        })
})