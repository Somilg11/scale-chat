import { describe, test} from "bun:test";

const BACKEND_URL = "ws://localhost:8080";

describe("Chat application", () => {
    test("Message from room1 reaches another participant in room1", async () => {
        const ws1 = new WebSocket(BACKEND_URL);
        const ws2 = new WebSocket(BACKEND_URL);

        // make sure sockets are connected
        
        await new Promise<void>((resolve, reject) => {
            let count = 1;
            ws1.onopen = () => {
                count += 1;
                if(count == 2){
                    resolve();
                }
            }
            ws2.onopen = () => {
                count += 1;
                if(count == 2){
                    resolve();
                }
            }
        });

        console.log('done');

        ws1.send(JSON.stringify({
            type: "join-room",
            room: "Room 1"
        }));
        ws2.send(JSON.stringify({
            type: "join-room",
            room: "Room 1"
        }));
    });
})