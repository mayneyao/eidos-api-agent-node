import { initTRPC } from "@trpc/server";
import { z } from "zod";

import { v4 as uuidv4 } from "uuid";

import { msgDataType, serializedMsg } from "./helper";
import { msgMap, wsMap } from "./main";

import { OpenApiMeta } from "trpc-openapi";
const t = initTRPC.meta<OpenApiMeta>().create(); /* 👈 */

export const appRouter = t.router({
  rpc: t.procedure
    .meta({ /* 👉 */ openapi: { method: "POST", path: "/rpc" } })
    .input(msgDataType)
    .output(z.any())
    .query(({ input }) => {
      const msgId = uuidv4();
      const msg = serializedMsg({
        id: msgId,
        data: input,
      });
      const ws = wsMap.get("worker");
      ws?.send(msg);
      return new Promise((resolve, reject) => {
        let sid = setInterval(() => {
          const msg = msgMap.get(msgId);
          if (msg) {
            msgMap.delete(msgId);
            resolve(msg);
            clearInterval(sid);
          }
        }, 100);
        setTimeout(() => {
          clearInterval(sid);
        }, 10000);
      });
    }),
});
