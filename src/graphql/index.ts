import fs from "fs";
import path from "path";
import { lexicographicSortSchema, printSchema } from "graphql";
import { builder } from "./builder";
import "./resolvers";

export const schema = builder.toSchema({});
const schemaAsString = printSchema(lexicographicSortSchema(schema));

if (process.env.NODE_ENV !== "production") {
  fs.writeFileSync(
    path.join(process.cwd(), "src/graphql/schema.gql"),
    schemaAsString
  );
}
