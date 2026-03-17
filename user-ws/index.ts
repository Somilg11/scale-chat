import { WebSocketServer, WebSocket as WebSocketWsType } from "ws";

const wss = new WebSocketServer({ port: 8081 });

interface Room {
    sockets: WebSocketWsType[]
}

const rooms: Record<string, Room> = {}

const RELAYER_URL = "ws://localhost:3001";
const relayerSocket = new WebSocket(RELAYER_URL);

relayerSocket.onmessage = ({data}) => {
    const parseData = JSON.parse(data);
    
    if(parseData.type == "chat"){
        const room = parseData.room;
        rooms[room]?.sockets.map(socket => socket.send(data));
    }
}

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
        relayerSocket.send(data);
    }
  });

  ws.on("close", () => {
    console.log("Client disconnected");
  });
});

console.log("WebSocket server started on ws://localhost:8081");