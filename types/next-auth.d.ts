import NextAuth from "next-auth";
import { JWT } from "next-auth/jwt";

interface IUser {
    id: string;
    username: string;
    password: string;
    email: string;
    isVerify: boolean;
    role: string;
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
