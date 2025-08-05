"use server";

import { cookies } from "next/headers";

export async function setExchangeRateCookie(rate: number) {
    const cookieStore = await cookies();

    cookieStore.set("exchangeRate", rate.toString(), {
        maxAge: 3600, // 1 hour
        path: "/",
    });
}