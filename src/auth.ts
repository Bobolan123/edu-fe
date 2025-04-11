import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { fetchSignIn, fetchSignInGoogle } from "./auth.service";
import { IUser } from "../types/next-auth";
import { InvalidActive, InvalidCredentials } from "../ultils/auth/auth-error";
import Google from "next-auth/providers/google";

export const { handlers, signIn, signOut, auth } = NextAuth({
    providers: [
        Google({
            authorization: {
                params: {
                    prompt: "consent",
                    access_type: "offline",
                    response_type: "code",
                },
            },
        }),
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
                if (res?.statusCode === 201 && res?.data) {
                    return {
                        email: res.data.email,
                        id: String(res.data.id),
                        name: res.data.name,
                    };
                } else if (res?.statusCode === 403) {
                    throw new InvalidActive();
                } else {
                    throw new InvalidCredentials();
                }
            },
        }),
    ],
    callbacks: {
        async signIn({ account, profile }) {
            if (account?.provider === "google") {
                if (profile?.email_verified && profile?.email?.endsWith("@gmail.com")) {
                    try {
                        const res = await fetchSignInGoogle(profile.email, profile.name || "", profile.sub || "");
                      if (res?.statusCode === 201 && res?.data) {
                        return true;
                      } else {
                        return false; 
                      }
                    } catch (error) {
                        console.error("Error saving Google user:", error);
                        return false;
                    }
                }
                return false;
            }
            return true;
        },

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
