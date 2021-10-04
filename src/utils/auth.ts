import { User } from ".prisma/client";
import bcrypt from "bcryptjs";
import { db } from "./prisma";

// Hash Password
export const hashPassword = async (password: string) => {
  const salt = await bcrypt.genSalt(10);
  return await bcrypt.hash(password, salt);
};
// Email Already In Use?
export const checkEmail = async (email: string) => {
  const emailExists = await db.user.findUnique({ where: { email: email } });
  if (emailExists) {
    throw new Error(`${email} is already in use.`);
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
    throw new Error("Invalid email or password.");
  }
};
// Email Exists & Password Correct?
export const checkUser = async (email: string, password: string) => {
  const user = await db.user.findUnique({ where: { email: email } });
  if (!user) throw new Error("Could not find user.");
  if (!email || !password) throw new Error("Invalid email or password.");

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
