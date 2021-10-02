import { writeFileSync } from "fs";
import { lexicographicSortSchema, printSchema } from "graphql";
import { builder } from "./builder";

export const schema = builder.toSchema({});
const schemaAsString = printSchema(lexicographicSortSchema(schema));

writeFileSync("src/graphql/schema.gql", schemaAsString);
