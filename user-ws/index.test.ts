import { describe, expect, test } from "bun:test";

const BACKEND_URL1 = "ws://localhost:8080";
const BACKEND_URL2 = "ws://localhost:8081";

describe("Chat application", () => {
    test("Message from room1 reaches another participant in room1", async () => {
        const ws1 = new WebSocket(BACKEND_URL1);
        const ws2 = new WebSocket(BACKEND_URL2);

        // make sure sockets are connected
        await new Promise<void>((resolve, reject) => {
            let count = 0;
            ws1.onopen = () => {
                count = count + 1;
                if (count == 2) {
                    resolve();
                }
            }
            ws2.onopen = () => {
                count = count + 1;
                if (count == 2) {
                    resolve();
                }
            }
        });

        ws1.send(JSON.stringify({
            type: "join-room",
            room: "Room 1"
        }));
        ws2.send(JSON.stringify({
            type: "join-room",
            room: "Room 1"
        }));

        // small delay to avoid race condition
        await new Promise((r) => setTimeout(r, 100));

        await new Promise<void>((resolve, reject) => {
            const timeout = setTimeout(() => {
                reject(new Error("Message not received"));
            }, 3000);

            ws2.onmessage = ({ data }) => {
                try {
                    const parsed = JSON.parse(data.toString());

                    expect(parsed.type).toBe("chat");
                    expect(parsed.room).toBe("Room 1");
                    expect(parsed.message).toBe("Hello");

                    clearTimeout(timeout);
                    resolve();
                } catch (err) {
                    reject(err);
                }
            }
            ws1.send(JSON.stringify({
                type: "chat",
                room: "Room 1",
                message: "Hello"
            }));
        })
        ws1.close();
        ws2.close();
    });
})