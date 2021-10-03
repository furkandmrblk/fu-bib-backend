import { builder } from "../builder";

builder.prismaObject("Library", {
  findUnique: (library) => ({ id: library.id }),
  fields: (t) => ({
    id: t.exposeID("id"),
    name: t.exposeString("name"),
    adress: t.exposeString("adress"),
    email: t.exposeString("email"),
    website: t.exposeString("website"),
    table: t.relation("Table"),
  }),
});
