import { WebSocketServer, WebSocket } from "ws";

const wss = new WebSocketServer({ port: 3001 });

const servers: WebSocket[] = [];

wss.on("connection", (ws) => {
  console.log("server connected");
  ws.on("error", console.error);
  servers.push(ws);
  ws.on("message", function message(data: string) {
    servers.map(socket => socket.send(data));
  });

  ws.on("close", () => {
    console.log("server disconnected");
  });
});

console.log("WebSocket server started on ws://localhost:3001");