import express, { Application, urlencoded } from "express";
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

const allowedOrigins: string[] = ["http://localhost:3000"];
export const pubsub = new PubSub();

export const expressLoader = async ({ app }: { app: Application }) => {
  // CORS To Allow Requests Between Front- & BackEnd
  app.use(cors({ origin: allowedOrigins, credentials: true }));

  // Body Parsers
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  // Next-Iron-Session & Options

  // GraphQLHelix
  app.use("/graphql", async (req, res) => {
    // Create A Generic Request Object That Can Be Consumed By Graphql Helix's API
    const request = {
      body: req.body,
      headers: req.headers,
      method: req.method,
      query: req.query,
    };

    try {
      // Determine Whether We Should Render GraphiQL Instead Of Returning An API Response
      if (shouldRenderGraphiQL(request)) {
        res.send(renderGraphiQL());
      } else {
        // Extract The Graphql Parameters From The Request
        const { operationName, query, variables } =
          getGraphQLParameters(request);

        // Validate And Execute The Query
        const result = await processRequest({
          operationName,
          query,
          variables,
          request,
          schema: schema,
        });

        sendResult(result, res);
      }
    } catch (error) {
      console.log(error);
    }
  });
};

export default expressLoader;
