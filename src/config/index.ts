import dotenv from "dotenv";

const envFound = dotenv.config();
if (envFound.error) {
  // This error should crash whole process
  throw new Error("Couldn't find .env file");
}
export default {
  port: parseInt(process.env.PORT!),
  path: "/graphql",

  ironSessionKey: process.env.IRON_SESSION_KEY,
};
