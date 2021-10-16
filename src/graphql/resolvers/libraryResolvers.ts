import { db } from "../../../src/utils/prisma";
import { builder } from "../builder";

builder.prismaObject("Library", {
  findUnique: (library) => ({ id: library.id }),
  fields: (t) => ({
    id: t.exposeID("id"),
    section: t.exposeString("section"),
    name: t.exposeString("name"),
    adress: t.exposeString("adress"),
    email: t.exposeString("email"),
    website: t.exposeString("website", { nullable: true }),
    table: t.relation("Table"),
  }),
});

// getLibrary
builder.queryField("getLibrary", (t) =>
  t.prismaField({
    type: "Library",
    args: {
      name: t.arg.string(),
    },
    resolve: async (query, _root, { name }, _ctx) => {
      return await db.library.findUnique({
        ...query,
        where: { name: name },
        rejectOnNotFound: true,
      });
    },
  })
);

// getLibraries
builder.queryField("getLibraries", (t) =>
  t.prismaField({
    type: ["Library"],
    resolve: async (query, _root, _args, _ctx) => {
      return await db.library.findMany({ ...query });
    },
  })
);
