import { checkBooking } from "../../../src/utils/booking";
import { db } from "../../../src/utils/prisma";
import { addMinutes } from "../../../src/utils/time";
import { nullable } from "zod";
import { builder } from "../builder";

builder.prismaObject("Table", {
  findUnique: (table) => ({ id: table.id }),
  fields: (t) => ({
    id: t.exposeID("id"),
    identifier: t.exposeString("identifier"),
    order: t.exposeInt("order"),
    library: t.relation("library"),
    libraryName: t.exposeString("libraryName"),
    floor: t.exposeString("floor"),
    booked: t.exposeBoolean("booked"),
    userId: t.exposeString("userId", { nullable: true }),
    time: t.exposeFloat("time", { nullable: true }),
  }),
});

const bookingInput = builder.inputType("bookingInput", {
  fields: (t) => ({
    identifier: t.string(),
  }),
});

// bookTable
builder.mutationField("bookTable", (t) =>
  t.prismaField({
    type: "Table",
    args: {
      input: t.arg({ type: bookingInput }),
    },
    errors: {
      types: [Error],
    },
    resolve: async (query, _root, { input }, { user }) => {
      checkBooking(user!);

      const date = new Date().getTime();
      const timer: number = addMinutes(date, 30);

      await db.user.update({
        where: { id: user?.id },
        data: { booked: true },
      });

      return await db.table.update({
        ...query,
        where: { identifier: input.identifier },
        data: { booked: true, time: timer },
      });
    },
  })
);

// endBooking && cancelBooking
builder.mutationField("endBooking", (t) =>
  t.prismaField({
    type: "Table",
    resolve: async (query, _root, _args, { user }) => {
      await db.user.update({
        where: { id: user?.id },
        data: { booked: false },
      });

      return await db.table.update({
        ...query,
        where: { userId: user?.id },
        data: { booked: false, time: null, userId: null },
      });
    },
  })
);

// validateBooking
builder.mutationField("validateBooking", (t) =>
  t.prismaField({
    type: "Table",
    resolve: async (query, _root, _args, { user }) => {
      const date = new Date().getTime();
      const timer: number = addMinutes(date, 90);

      await db.user.update({
        where: { id: user?.id },
        data: {
          reservations: user?.reservations! + 1,
        },
      });

      return await db.table.update({
        ...query,
        where: { userId: user?.id },
        data: { time: timer },
      });
    },
  })
);

// extendTable
builder.mutationField("extendTable", (t) =>
  t.prismaField({
    type: "Table",
    errors: {
      types: [Error],
    },
    resolve: async (query, _root, _args, { user }) => {
      const date = new Date().getTime();
      const timer: number = addMinutes(date, 60);

      await db.user.update({
        where: { id: user?.id },
        data: { extensions: user?.extensions! + 1 },
      });

      return await db.table.update({
        ...query,
        where: { userId: user?.id },
        data: { time: timer },
      });
    },
  })
);

// leaveTable
builder.mutationField("leaveTable", (t) =>
  t.prismaField({
    type: "Table",
    resolve: async (query, _root, _args, { user }) => {
      await db.user.update({
        where: { id: user?.id },
        data: { booked: false },
      });

      return await db.table.update({
        ...query,
        where: { userId: user?.id },
        data: { booked: false, time: null, userId: null },
      });
    },
  })
);

// findTable
builder.queryField("getTable", (t) =>
  t.prismaField({
    type: "Table",
    args: {
      identifier: t.arg.string(),
    },
    resolve: async (query, _root, { identifier }, _ctx) => {
      return await db.table.findUnique({
        ...query,
        where: { identifier: identifier },
        rejectOnNotFound: true,
      });
    },
  })
);
