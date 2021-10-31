import { Result } from "../../../src/utils/result";
import { checkBooking } from "../../../src/utils/booking";
import { db } from "../../../src/utils/prisma";
import { addMinutes } from "../../../src/utils/time";
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
    extendedTime: t.exposeBoolean("extendedTime"),
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
      await checkBooking(user!);

      const date = new Date().getTime();
      const timer: number = addMinutes(date, 30);

      await db.user.update({
        where: { id: user?.id },
        data: { booked: true, tableIdentifier: input.identifier },
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
builder.mutationField("cancelBooking", (t) =>
  t.prismaField({
    type: "Table",
    args: {
      identifier: t.arg.string(),
    },
    resolve: async (query, _root, { identifier }, { user }) => {
      await db.user.update({
        where: { id: user?.id },
        data: { booked: false, tableIdentifier: null },
      });

      return await db.table.update({
        ...query,
        where: { identifier: identifier },
        data: { booked: false, time: null, userId: null },
      });
    },
  })
);

builder.mutationField("endBooking", (t) =>
  t.prismaField({
    type: "Table",
    resolve: async (query, _root, _args, { user }) => {
      await db.user.update({
        where: { id: user?.id },
        data: { booked: false, tableIdentifier: null },
      });

      return await db.table.update({
        ...query,
        where: { userId: user?.id },
        data: { booked: false, time: null, extendedTime: false, userId: null },
      });
    },
  })
);

// validateBooking
const validateInput = builder.inputType("validateInput", {
  fields: (t) => ({
    userId: t.string(),
    tableIdentifier: t.string(),
  }),
});

builder.mutationField("validateBooking", (t) =>
  t.prismaField({
    type: "Table",
    args: {
      input: t.arg({ type: validateInput }),
    },
    errors: {
      types: [Error],
    },
    resolve: async (query, _root, { input }, { user }) => {
      if (!user?.admin)
        throw new Error(
          "Nur Administratoren können diese Funktion durchführen."
        );

      const date = new Date().getTime();
      const timer: number = addMinutes(date, 90);

      const bookingUser = await db.user.findUnique({
        where: { id: input.userId },
        rejectOnNotFound: true,
      });

      const table = await db.table.update({
        ...query,
        where: { identifier: input.tableIdentifier },
        data: { userId: input.userId, time: timer, extendedTime: true },
      });

      if (table.extendedTime !== true) {
        await db.user.update({
          where: { id: input.userId },
          data: {
            reservations: bookingUser.reservations! + 1,
          },
        });
      }

      return table;
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
