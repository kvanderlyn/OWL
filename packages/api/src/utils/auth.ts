import { authSchema, db } from "@owl/db";
import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { admin, username } from "better-auth/plugins";
import "dotenv/config";

export const auth = betterAuth({
      secret: process.env.BETTER_AUTH_SECRET!,
      database: drizzleAdapter(db, {
            provider: "pg",
            schema: { ...authSchema },
      }),
      trustedOrigins: [process.env.BETTER_AUTH_TRUSTED_URL!],
      emailAndPassword: {
            enabled: true,
      },
      plugins: [username()],
      user: {
            additionalFields: {
                  username: { type: "string", required: true },
                  birthday: {
                        type: "date",
                        required: false,
                        input: true,
                  },
            },
      },
});
export type User = typeof auth.$Infer.Session.user;
