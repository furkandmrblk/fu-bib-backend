import { Session, User } from ".prisma/client";
import { IncomingMessage, OutgoingMessage } from "http";
import { applySession, SessionOptions } from "next-iron-session";
import config from "../../src/config/index";
import { db } from "./prisma";

const IRON_SESSION_KEY = "sessionID";
const IRON_SESSION_COOKIE = "session";

export const sessionOptions: SessionOptions = {
  cookieName: IRON_SESSION_COOKIE,
  cookieOptions: {
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    httpOnly: true,
  },
  password: [
    {
      id: 1,
      password: config.ironSessionKey!,
    },
  ],
};

interface RequestSession extends IncomingMessage {
  session: import("next-iron-session").Session;
}
interface PrismaSession extends Session {
  user: User;
}

export const createSession = async (req: IncomingMessage, user: User) => {
  const session = await db.session.create({
    data: {
      userId: user.id,
      expiresAt: new Date(),
    },
  });

  const requestSession = req as unknown as RequestSession;

  requestSession.session.set(IRON_SESSION_KEY, session.id);
  await requestSession.session.save();

  return session;
};

export const removeSession = async (req: IncomingMessage, session: Session) => {
  const requestSession = req as unknown as RequestSession;

  requestSession.session.destroy();

  await db.session.delete({
    where: {
      id: session.id,
    },
  });
};

export const connectSession = async ({
  req,
  res,
}: Pick<{ req: IncomingMessage; res?: OutgoingMessage }, "req" | "res">) => {
  await applySession(req, res, sessionOptions);

  let session: PrismaSession | null = null;

  const requestSession = req as unknown as RequestSession;
  const sessionId = requestSession.session.get(IRON_SESSION_KEY);

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
