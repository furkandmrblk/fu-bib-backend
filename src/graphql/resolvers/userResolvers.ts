import {
  checkEmail,
  checkStrikes,
  checkUser,
  confirmPassword,
  hashPassword,
} from "../../../src/utils/auth";
import { db } from "../../../src/utils/prisma";
import { createSession, removeSession } from "../../../src/utils/session";
import { ZodError } from "zod";
import { builder } from "../builder";
import { Result } from "../../../src/utils/result";

builder.prismaObject("User", {
  findUnique: (user) => ({ id: user.id }),
  fields: (t) => ({
    id: t.exposeID("id"),
    email: t.exposeString("email"),
    password: t.exposeString("password"),
    admin: t.exposeBoolean("admin"),
    name: t.exposeString("name", { nullable: true }),
    major: t.exposeString("major", { nullable: true }),
    booked: t.exposeBoolean("booked"),
    mostUsedLibrary: t.exposeString("mostUsedLibrary", { nullable: true }),
    mostUsedTable: t.exposeString("mostUsedTable", { nullable: true }),
    reservations: t.exposeInt("reservations", { nullable: true }),
    extensions: t.exposeInt("extensions", { nullable: true }),
    strikes: t.exposeInt("strikes", { nullable: true }),
    softban: t.exposeBoolean("softban"),
    date: t.exposeFloat("date"),
  }),
});

// userInput
const userInput = builder.inputType("userInput", {
  fields: (t) => ({
    email: t.string({
      validate: {
        email: [true, { message: "Bitte Email eingeben." }],
        minLength: [
          10,
          { message: "Email sollte mindestens 20 Zeichen lang sein." },
        ],
        maxLength: [
          100,
          { message: "Email sollte unter 100 Zeichen lang sein." },
        ],
      },
      required: true,
    }),
    password: t.string({
      validate: {
        minLength: [
          8,
          { message: "Passwort sollte mindestens 8 Zeichen lang sein." },
        ],
      },
      required: true,
    }),
    confirmPassword: t.string({ required: false }),
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
    resolve: async (query, _root, { input }, { res }) => {
      const user = await db.user.create({
        ...query,
        data: {
          email: await checkEmail(input.email),
          password: await confirmPassword(
            input.password,
            input.confirmPassword!
          ),
          admin: false,
          reservations: 0,
          extensions: 0,
          strikes: 0,
          booked: false,
          softban: false,
          date: Date.now(),
        },
      });

      const token = await createSession(user);
      res.setHeader("session", token);

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
    resolve: async (query, _root, { input }, { res }) => {
      await checkUser(input.email, input.password);
      const user = await db.user.findUnique({
        ...query,
        where: { email: input.email },
        rejectOnNotFound: true,
      });
      const token = await createSession(user);
      res.setHeader("session", token);

      return user;
    },
  })
);

// signOut
builder.mutationField("signOut", (t) =>
  t.field({
    type: Result,
    resolve: async (_root, _args, { req, session }) => {
      await removeSession(session!);
      return Result.SUCCESS;
    },
  })
);

// strikeUser
builder.mutationField("strikeUser", (t) =>
  t.prismaField({
    type: "User",
    resolve: async (query, _root, _args, { user }) => {
      const currentUser = await db.user.update({
        ...query,
        where: { id: user?.id },
        data: { strikes: user?.strikes! + 1 },
      });

      await checkStrikes(currentUser);
      return currentUser;
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
