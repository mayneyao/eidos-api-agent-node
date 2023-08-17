import http from "http";

import { WebSocket, WebSocketServer } from "ws";
import { createOpenApiHttpHandler } from "trpc-openapi";

import { deserializedMsg } from "./helper";
import { appRouter } from "./router";

export const msgMap = new Map<string, any>();
export const wsMap = new Map<string, WebSocket>();
const server = http.createServer(
  createOpenApiHttpHandler({ router: appRouter })
);

export const wss = new WebSocketServer({ server });

// Connection from worker and server
wss.on("connection", (ws) => {
  console.log("Worker connected");
  // for now only support one worker
  wsMap.set("worker", ws);
  ws.on("close", () => {
    console.log("Worker disconnected");
    wsMap.delete("worker");
  });
  ws.on("message", (message) => {
    const msg = deserializedMsg(message.toString());
    msgMap.set(msg.id, msg);
    //
    // if (msg.data.method === "Syscall") {
    //   const cmd = msg.data.params.join(" ");
    //   console.log("cmd:", cmd);
    //   exec(cmd, (error, stdout, stderr) => {
    //     if (error) {
    //       console.error(error);
    //       return;
    //     }
    //     if (stderr) {
    //       console.error(stderr);
    //       return;
    //     }
    //     console.log(stdout);
    //   });
    // }
  });
});

server.listen(3333);
console.log("Server started at http://localhost:3333");
