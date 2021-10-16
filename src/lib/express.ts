import express, { Application } from "express";
import cors from "cors";
import {
  getGraphQLParameters,
  processRequest,
  renderGraphiQL,
  sendResult,
  shouldRenderGraphiQL,
} from "graphql-helix";
import { PubSub } from "graphql-subscriptions";
import { schema } from "../../src/graphql/index";
import config from "../../src/config/index";
import { connectSession } from "../../src/utils/session";
import { Context, createGraphQLContext } from "../../src/graphql/builder";
import { ironSession } from "next-iron-session";

const allowedOrigins: string[] = [
  "exp://127.0.0.1:19000",
  "exp://192.168.2.226:19000",
];
export const pubsub = new PubSub();

export const expressLoader = async ({ app }: { app: Application }) => {
  // CORS To Allow Requests Between Front- & BackEnd
  app.use(cors({ origin: allowedOrigins, credentials: true }));

  // Body Parsers
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  app.get("/api/checkAuth", async (req, res) => {
    const session = await connectSession({ req, res });

    if (session && session?.user) {
      res.status(200).send("Authenticated");
    } else {
      res.status(401).send("Unauthenticated");
    }
  });

  // Next-Iron-Session & Options

  // GraphQLHelix
  app.use(config.path, async (req, res) => {
    // Create A Generic Request Object That Can Be Consumed By Graphql Helix's API
    const request = {
      body: req.body,
      headers: req.headers,
      method: req.method,
      query: req.query,
    };

    const session = await connectSession({ req, res });

    try {
      // Determine Whether We Should Render GraphiQL Instead Of Returning An API Response
      if (shouldRenderGraphiQL(request)) {
        res.send(
          renderGraphiQL({
            endpoint: config.path,
          })
        );
      } else {
        // Extract The Graphql Parameters From The Request
        const { operationName, query, variables } =
          getGraphQLParameters(request);

        // Validate And Execute The Query
        const result = await processRequest<Context>({
          operationName,
          query,
          variables,
          request,
          schema: schema,
          contextFactory: () => createGraphQLContext(req, res, pubsub, session),
        });

        sendResult(result, res);
      }
    } catch (error) {
      console.log(error);
    }
  });
};

export default expressLoader;
