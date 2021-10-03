import { db } from "src/utils/prisma";
import { builder } from "../builder";

builder.prismaObject("User", {
  findUnique: (user) => ({ id: user.id }),
  fields: (t) => ({
    id: t.exposeID("id"),
    email: t.exposeString("email"),
    password: t.exposeString("password"),
    name: t.exposeString("name"),
    major: t.exposeString("major"),
    mostUsedLibrary: t.exposeString("mostUsedLibrary"),
    mostUserTable: t.exposeString("mostUsedTable"),
    reservations: t.exposeInt("reservations"),
    extensions: t.exposeInt("extensions"),
    strikes: t.exposeInt("strikes"),
    date: t.exposeFloat("date"),
  }),
});
