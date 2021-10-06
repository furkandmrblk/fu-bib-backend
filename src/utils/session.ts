import { Session, User } from ".prisma/client";
import jwt from "jsonwebtoken";
import { IncomingMessage, OutgoingMessage } from "http";
import { applySession, SessionOptions } from "next-iron-session";
import config from "../../src/config/index";
import { db } from "./prisma";
import { Response } from "express";

interface PrismaSession extends Session {
  user: User;
}

export const createSession = async (user: User) => {
  const session = await db.session.create({
    data: {
      userId: user.id,
      expiresAt: new Date(),
    },
  });

  const payload = {
    session: session.id,
  };
  const secret = config.jwtKey;
  const options = {
    audience: user!.id,
    expiresIn: "30d",
  };

  return jwt.sign(payload, secret!, options);
};

export const removeSession = async (req: IncomingMessage, session: Session) => {
  const token = req.headers["session"];

  // get payload
  const payload = verifySession(token as string);

  await db.session.delete({
    where: {
      id: session.id,
    },
  });
};

export const connectSession = async ({
  req,
  res,
}: Pick<{ req: IncomingMessage; res?: Response }, "req" | "res">) => {
  const token = req.headers["session"];
  console.log('connectSession headers:"session": ', token);

  // const payload = verifySession(token as string);
  // console.log("payload connectSession", payload);

  const sessionId = "1";

  let session: PrismaSession | null = null;

  if (sessionId) {
    session = await db.session.findUnique({
      where: {
        id: sessionId,
      },
      include: {
        user: true,
      },
    });
  }

  return session;
};

const verifySession = async (token: string) => {
  if (!token) throw new Error("Token not found.");

  jwt.verify(
    token,
    config.jwtKey!,
    (err: { message: string } | null, payload: any) => {
      if (err) {
        throw new Error(err.message);
      } else {
        return payload;
      }
    }
  );
};
