import { builder } from "../builder";

builder.prismaObject("Table", {
  findUnique: (table) => ({ id: table.id }),
  fields: (t) => ({
    id: t.exposeID("id"),
    identifier: t.exposeString("identifier"),
    library: t.relation("library"),
    libraryId: t.exposeString("libraryId"),
    booked: t.exposeBoolean("booked"),
    time: t.exposeFloat("time"),
  }),
});
