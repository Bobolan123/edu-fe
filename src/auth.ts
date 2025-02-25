import Google from "next-auth/providers/google";
import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { sendRequest } from "../ultils/api";
import { fetchSignIn } from "./auth.service";
// Your own logic for dealing with plaintext password strings; be careful!

export const { handlers, signIn, signOut, auth } = NextAuth({
    providers: [
        Google,
        Credentials({
            // You can specify which fields should be submitted, by adding keys to the `credentials` object.
            // e.g. domain, username, password, 2FA token, etc.
            credentials: {
                email: {},
                password: {},
            },
            authorize: async (credentials) => {
                let user = null;
                const res = await fetchSignIn(
                    credentials.email as string,
                    credentials.password as string
                );

                if (!user) {
                    throw new Error("Invalid credentials.");
                }
                return user;
            },
        }),
    ],
});
