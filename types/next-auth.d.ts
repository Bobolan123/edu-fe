import NextAuth from "next-auth";
import { JWT } from "next-auth/jwt";

interface IUser {
    id: string;
    name: string;
    username: string;
    email: string;
    isVerify: boolean;
    role: string;
    access_token: string;
    refresh_token: string;
    expires_at: number;
    permissions: IPermission[];
    avatar_url?: string | null;
}
declare module "next-auth/jwt" {
    interface JWT {
        user: IUser;
        accessToken: string;
        refreshToken: string;
        accessExpire: number;
        error: string;
    }
}

declare module "next-auth" {
    interface Session {
        user: IUser;
        accessToken: string;
        refreshToken: string;
        accessExpire: number;
        error: string;
    }
}
