import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import {
    fetchSignIn,
    fetchSignInGoogle,
    fetchRefreshToken,
} from "./auth.service";
import { IUser } from "../types/next-auth";
import { InvalidActive, InvalidCredentials } from "./utils/auth/auth-error";
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
                        access_token: res.data.access_token,
                        refresh_token: res.data.refresh_token,
                        expires_at: res.data.expires_at,
                        role: res.data.role || "user",
                        permissions: res.data.permissions || [],
                        avatar_url: res.data.avatar_url || "",
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
                if (
                    profile?.email_verified &&
                    profile?.email?.endsWith("@gmail.com")
                ) {
                    try {
                        const res = await fetchSignInGoogle(
                            profile.email,
                            profile.name || "",
                            profile.sub || ""
                        );
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

        async jwt({ token, user, trigger, session, account, profile }) {
            // Initial sign in with credentials
            if (user) {
                token.user = user as IUser;
                return token;
            }

            // Google OAuth sign in
            if (account?.provider === "google" && profile) {
                try {
                    const res = await fetchSignInGoogle(
                        profile.email || "",
                        profile.name || "",
                        profile.sub || ""
                    );

                    if (res?.statusCode === 201 && res?.data) {
                        token.user = {
                            email: res.data.email,
                            id: String(res.data.id),
                            name: res.data.name,
                            access_token: res.data.access_token,
                            refresh_token: res.data.refresh_token,
                            expires_at: res.data.expires_at,
                            role: res.data.role || "user",
                            permissions: res.data.permissions || [],
                            avatar_url: res.data.avatar_url || "",
                        } as IUser;
                    }
                } catch (error) {
                    console.error("Error fetching Google OAuth tokens:", error);
                }
                return token;
            }

            // Handle session update trigger
            if (trigger === "update" && session?.user) {
                token.user = { ...token.user, ...session.user };
                return token;
            }

            // Check if token needs refresh
            if (token.user?.expires_at) {
                if (Date.now() >= token.user.expires_at) {
                    try {
                        console.log("refreshing token");
                        const res = await fetchRefreshToken(
                            token.user.refresh_token
                        );

                        if (res?.statusCode === 201 && res?.data) {
                            // Update token with new access_token and expires_at
                            token.user = {
                                ...token.user,
                                access_token: res.data.access_token,
                                refresh_token: res.data.refresh_token,
                                expires_at: res.data.expires_at,
                            };
                        } else {
                            console.error("Failed to refresh token, invalidating session");
                            return null as any;
                        }
                    } catch (error) {
                        console.error("Error refreshing token:", error);
                        return null as any;
                    }
                }
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
