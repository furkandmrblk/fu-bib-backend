import express from "express";
import ws from "ws";
import { useServer } from "graphql-ws/lib/use/ws";
import { pubsub } from "../src/lib/express";
import { subscribe } from "graphql";
import { schema } from "../src/graphql/index";
import config from "../src/config";
import { connectSession } from "../src/utils/session";

async function startServer() {
  const app = express();
  await require("./lib").default({ app });

  const server = app
    .listen(config.port, () => {
      const webSocketServer = new ws.Server({
        server: server,
        path: config.path,
      });

      useServer(
        {
          context: async ({ extra }, _message, _args) => ({
            pubsub: pubsub,
            session: await connectSession({ req: extra.request }),
            req: extra.request,
            user: await connectSession({ req: extra.request }).then(
              (session) => session?.user
            ),
          }),
          schema: schema,
          subscribe,
        },
        webSocketServer
      );
      console.log(`| 🎉 Server started on port:${config.port} 🎉 |`);
    })
    .on("error", (err) => {
      console.log(err);
      process.exit(1);
    });
}

startServer();
