import { WebSocketServer, WebSocket } from "ws";

const wss = new WebSocketServer({ port: 8080 });

interface Room {
    sockets: WebSocket[]
}

const rooms: Record<string, Room> = {}

wss.on("connection", (ws) => {
  console.log("Client connected");
  ws.on("error", console.error);

  ws.on("message", function message(data: string) {
    const parseData = JSON.parse(data);
    if(parseData.type == "join-room"){
        const room = parseData.room;
        if(!rooms[room]){
            rooms[room] = {sockets: []}
        }
        rooms[room].sockets.push(ws);
    }
    if(parseData.type == "chat"){
        const room = parseData.room;
        rooms[room]?.sockets.map(socket => socket.send(data));
    }
  });

  ws.on("close", () => {
    console.log("Client disconnected");
  });
});

console.log("WebSocket server started on ws://localhost:8080");