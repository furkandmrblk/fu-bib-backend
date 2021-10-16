import { User } from ".prisma/client";
import bcrypt from "bcryptjs";
import { db } from "./prisma";

// Confirm Password
export const confirmPassword = async (
  password: string,
  confirmPassword: string
) => {
  if (password !== confirmPassword)
    throw new Error("Passwörter stimmen nicht überein.");
  return hashPassword(password);
};

// Hash Password
export const hashPassword = async (password: string) => {
  const salt = await bcrypt.genSalt(10);
  return await bcrypt.hash(password, salt);
};
// Email Already In Use?
export const checkEmail = async (email: string) => {
  const emailExists = await db.user.findUnique({ where: { email: email } });
  if (emailExists) {
    throw new Error(`${email} wird bereits genutzt.`);
  }

  return email;
};
// Verify Password
export const checkPassword = async (
  password: string,
  hashedPassword: string
) => {
  const verifyPassword = await bcrypt.compare(password, hashedPassword);

  if (!verifyPassword) {
    throw new Error("Email oder Passwort ist falsch.");
  }
};
// Email Exists & Password Correct?
export const checkUser = async (email: string, password: string) => {
  const user = await db.user.findUnique({ where: { email: email } });
  if (!user) throw new Error("Benutzer konnte nicht gefunden werden.");
  if (!email || !password) throw new Error("Email oder Passwort ist falsch.");

  await checkPassword(password, user.password);
  return user;
};
// Check Strikes
export const checkStrikes = async (user: User) => {
  if (user.strikes === 3) {
    // Soft ban users account
    await db.user.update({ where: { id: user.id }, data: { softban: true } });
  }
};
