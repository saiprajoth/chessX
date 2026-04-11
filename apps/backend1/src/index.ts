
import { WebSocketServer } from "ws";
import { gameManager } from "./GameManager";
const wss = new WebSocketServer({ port: 8080 });

wss.on("connection", (ws) => {
  console.log("websocket connection successfull");
  gameManager.addUser(ws);

  ws.on("close", () => gameManager.removeUser(ws));

  ws.on("error", (error) => {
    console.error(error);
  });
  ws.on("message", (data) => {
    console.log(`recieved : ${data}`);
  });
  ws.send("something");
  
});
