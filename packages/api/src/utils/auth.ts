import { betterAuth } from "better-auth";
import { username } from "better-auth/plugins"
import { admin } from "better-auth/plugins"
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { db } from "@owl/db";

export const auth = betterAuth({
    database: drizzleAdapter(db, { provider: "pg" }),
    emailAndPassword: {
        enabled: true
    },
    plugins: [
        username(),
        admin()
    ]
})