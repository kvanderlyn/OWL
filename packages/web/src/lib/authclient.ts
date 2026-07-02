import { createAuthClient } from "better-auth/react";
import { config } from "dotenv";

config();

export const authClient = createAuthClient({
    baseURL: process.env.BETTER_AUTH_URL
})

export const { signIn, signUp, useSession } = createAuthClient()