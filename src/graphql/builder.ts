import { PrismaClient, Session, User } from ".prisma/client";
import SchemaBuilder from "@giraphql/core";
import ErrorsPlugin from "@giraphql/plugin-errors";
import SimpleObjectsPlugin from "@giraphql/plugin-simple-objects";
import ScopeAuthPlugin from "@giraphql/plugin-scope-auth";
import SmartSubscriptionsPlugin, {
  subscribeOptionsFromIterator,
} from "@giraphql/plugin-smart-subscriptions";
import ValidationPlugin from "@giraphql/plugin-validation";
import PrismaPlugin from "@giraphql/plugin-prisma";
import PrismaTypes from "../../prisma/giraphql-types";
import { PubSub } from "graphql-subscriptions";
import { IncomingMessage, OutgoingMessage } from "http";
import { ZodError } from "zod";

export interface Context {
  req: IncomingMessage;
  res: OutgoingMessage;
  pubsub: PubSub;
  user?: User | null;
  session?: Session | null;
}

export function createGraphQLContext(
  req: IncomingMessage,
  res: OutgoingMessage,
  pubsub: PubSub,
  session?: (Session & { user: User }) | null
): Context {
  return {
    req,
    res,
    pubsub,
    user: session?.user,
    session,
  };
}

const prisma = new PrismaClient({});

export const builder = new SchemaBuilder<{
  PrismaTypes: PrismaTypes;
  DefaultInputFieldRequiredness: true;
  Context: Context;
  Scalars: {
    ID: { Input: string; Output: string | number };
  };
  AuthScopes: {
    public: boolean;
    user: boolean;
  };
  SmartSubscription: {
    debounceDelay: number | null;
    subscribe: (
      name: string,
      context: Context,
      cb: (err: unknown, data?: unknown) => void
    ) => Promise<void> | void;
    unsubscripe: (name: string, context: Context) => Promise<void> | void;
  };
}>({
  defaultInputFieldRequiredness: true,
  plugins: [
    ErrorsPlugin,
    SimpleObjectsPlugin,
    ScopeAuthPlugin,
    ValidationPlugin,
    SmartSubscriptionsPlugin,
    PrismaPlugin,
  ],
  authScopes: async ({ user }) => ({
    public: true,
    user: !!user,
  }),
  smartSubscriptions: {
    ...subscribeOptionsFromIterator((name, { pubsub }) => {
      return pubsub.asyncIterator(name);
    }),
  },
  errorOptions: {
    defaultTypes: [Error, ZodError],
  },
  prisma: { client: prisma },
});

builder.queryType({
  authScopes: {
    user: true,
  },
});
builder.mutationType({
  authScopes: {
    user: true,
  },
});
builder.subscriptionType({
  authScopes: {
    user: true,
  },
});
