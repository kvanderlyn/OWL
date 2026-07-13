import { betterAuth } from "better-auth";
import { username } from "better-auth/plugins"
import { admin } from "better-auth/plugins"
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { db, authSchema } from "@owl/db";
import "dotenv/config"

export const auth = betterAuth({
    database: drizzleAdapter(db, {
        provider: "pg",
        schema: { ...authSchema }
    }),
    trustedOrigins: [process.env.BETTER_AUTH_TRUSTED_URL!],
    emailAndPassword: {
        enabled: true
    },
    plugins: [
        username(),
        admin()
    ],
    user: {
        additionalFields: {
            birthday: {
                type: "date",
                required: false,
                input: true
            }
        }
    }
})