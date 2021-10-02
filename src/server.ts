import express from "express";
import ws from "ws";
import { useServer } from "graphql-ws/lib/use/ws";
import { pubsub } from "./lib/express";
import { subscribe } from "graphql";

const port: number = 3000;

async function startServer() {
  const app = express();
  await require("./lib").default({ app });

  const server = app
    .listen(port, () => {
      const webSocketServer = new ws.Server({
        server: server,
        path: "/graphql",
      });

      // useServer(
      //     {
      //         context: async ({ extra }, _message, _args) => ({
      //             pubsub: pubsub,
      //             session: await connectSession({ req: extra.request }),
      //             req: extra.request,
      //             user: await connectSession({ req: extra.request }).then(
      //                 (session) => session?.user,
      //             ),
      //         }),
      //         schema: schema,
      //         subscribe,
      //     },
      //     wsServer,
      // );
      console.log(`----SERVER STARTED ON PORT ${port}----`);
    })
    .on("error", (err) => {
      console.log(err);
      process.exit(1);
    });
}

startServer();
