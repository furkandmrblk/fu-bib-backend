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
}: Pick<{ req: IncomingMessage; res?: Response }, "req" | "res">): Promise<
  (Session & { user: User }) | null
> => {
  try {
    const token = req.headers["session"];
    console.log('connectSession headers:"session": ', token);

    const payload = await verifySession(token as string);
    console.log("payload connectSession", payload);

    let session: PrismaSession | null = null;

    if (payload.session) {
      session = await db.session.findUnique({
        where: {
          id: payload.session,
        },
        include: {
          user: true,
        },
      });
    }

    return session;
  } catch (error) {
    return null;
  }
};

const verifySession = async (token: string) => {
  return new Promise((resolve, reject) => {
    jwt.verify(token, config.jwtKey!, (err, decoded: any) => {
      if (err) return reject(err);
      if (!("exp" in decoded) || !("iat" in decoded))
        reject("Token has no 'EXP' or 'IAT'");

      resolve(decoded);
    });
  });
};
