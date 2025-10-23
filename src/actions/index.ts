"use server";

import { auth } from "@/auth";
import { cookies } from "next/headers";

export const getAccessToken = async () => {
    const session = await auth()
    return session?.user?.access_token
}

export const getRefreshToken = async () => {
    const session = await auth()
    return session?.user?.refresh_token
}

export const getTokens = async () => {
    const session = await auth()
    return {
        access_token: session?.user?.access_token,
        refresh_token: session?.user?.refresh_token
    }
}

export const getUserId = async () => {
    const session = await auth()
    return session?.user?.id
}