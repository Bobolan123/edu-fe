import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { fetchSignIn } from "./auth.service";
import { IUser } from "../types/next-auth";
import { InvalidActive, InvalidCredentials } from "../ultils/auth/auth-error";

export const { handlers, signIn, signOut, auth } = NextAuth({
    providers: [
        Credentials({
            credentials: {
                email: {},
                password: {},
            },
            authorize: async (credentials) => {
                const res = await fetchSignIn(
                    credentials.email as string,
                    credentials.password as string
                );
                console.log(res)
                if (res?.statusCode === 201 && res?.data) {
                    return {
                        email: res.data.email,
                        id: String(res.data.id),
                        name: res.data.name,
                    };
                } else if (res?.statusCode === 403) {
                    throw new InvalidActive()
                } else {
                    throw new InvalidCredentials()
                }
            },
        }),
    ],
    callbacks: {
        jwt({ token, user }) {
            if (user) {
                // User is available during sign-in
                token.user = user as IUser;
            }
            return token;
        },
        session({ session, token }) {
            (session.user as IUser) = token.user;
            return session;
        },
        // authorized: async ({ auth }) => {
        //     // Logged in users are authenticated, otherwise redirect to login page
        //     return !!auth;
        // },
    },
});
