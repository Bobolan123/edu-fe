"use server";

import { auth } from "@/auth";

export const getAccessToken = async () => {
    const session = await auth()
    return session?.user?.access_token
}

export const getUserId = async () => {
    const session = await auth()
    return session?.user?.id
}