import {
  checkEmail,
  checkStrikes,
  checkUser,
  hashPassword,
} from "src/utils/auth";
import { db } from "src/utils/prisma";
import { createSession } from "src/utils/session";
import { ZodError } from "zod";
import { builder } from "../builder";

builder.prismaObject("User", {
  findUnique: (user) => ({ id: user.id }),
  fields: (t) => ({
    id: t.exposeID("id"),
    email: t.exposeString("email"),
    password: t.exposeString("password"),
    name: t.exposeString("name", { nullable: true }),
    major: t.exposeString("major", { nullable: true }),
    mostUsedLibrary: t.exposeString("mostUsedLibrary", { nullable: true }),
    mostUserTable: t.exposeString("mostUsedTable", { nullable: true }),
    reservations: t.exposeInt("reservations", { nullable: true }),
    extensions: t.exposeInt("extensions", { nullable: true }),
    strikes: t.exposeInt("strikes", { nullable: true }),
    date: t.exposeFloat("date"),
  }),
});

// userInput
const userInput = builder.inputType("userInput", {
  fields: (t) => ({
    email: t.string({
      validate: {
        minLength: 20,
        maxLength: 100,
      },
    }),
    password: t.string({
      validate: {
        minLength: 8,
      },
    }),
  }),
});

// signUp
builder.mutationField("signUp", (t) =>
  t.prismaField({
    type: "User",
    args: {
      input: t.arg({ type: userInput }),
    },
    errors: {
      types: [Error, ZodError],
    },
    authScopes: {
      public: true,
    },
    skipTypeScopes: true,
    resolve: async (query, _root, { input }, { req }) => {
      const user = await db.user.create({
        ...query,
        data: {
          email: await checkEmail(input.email),
          password: await hashPassword(input.password),
          date: Date.now(),
        },
      });

      await createSession(req, user);
      return user;
    },
  })
);

// signIn
builder.mutationField("signIn", (t) =>
  t.prismaField({
    type: "User",
    args: {
      input: t.arg({ type: userInput }),
    },
    errors: {
      types: [Error, ZodError],
    },
    authScopes: {
      public: true,
    },
    skipTypeScopes: true,
    resolve: async (query, _root, { input }, { req }) => {
      await checkUser(input.email, input.password);
      const user = await db.user.findUnique({
        ...query,
        where: { email: input.email },
        rejectOnNotFound: true,
      });
      await createSession(req, user);

      return user;
    },
  })
);

// strikeUser
builder.mutationField("strikeUser", (t) =>
  t.prismaField({
    type: "User",
    args: {
      id: t.arg.id(),
    },
    resolve: async (query, _root, { id }, _ctx) => {
      const user = await db.user.findUnique({
        ...query,
        where: { id: id },
        rejectOnNotFound: true,
      });
      await checkStrikes(user);
      return user;
    },
  })
);

// deleteUser
builder.mutationField("deleteUser", (t) =>
  t.prismaField({
    type: "User",
    resolve: async (query, _root, _args, { user }) => {
      return await db.user.delete({ ...query, where: { id: user!.id } });
    },
  })
);

// userQueries

builder.queryField("getCurrentUser", (t) =>
  t.prismaField({
    type: "User",
    resolve: async (query, _root, _args, { user }) => {
      return await db.user.findUnique({
        ...query,
        where: { id: user!.id },
        rejectOnNotFound: true,
      });
    },
  })
);
