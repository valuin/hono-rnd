import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { getDb } from "../db";
import { openAPI } from "better-auth/plugins";

type auth = ReturnType<typeof betterAuth>;

export const createAuth = (env: any): auth => {
  const db = getDb(env);
  const secret = env.BETTER_AUTH_SECRET;
  const baseUrl = env.BETTER_AUTH_URL;

  return betterAuth({
    secret: secret,
    baseUrl: baseUrl,

    database: drizzleAdapter(db, {
      provider: "pg",
    }),
    emailAndPassword: {
      enabled: true,
    },
    plugins: [openAPI()],
  });
};

export default createAuth as (env: any) => auth;
