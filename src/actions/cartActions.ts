"use server";

import { revalidateTag } from "next/cache";
import { sendRequest } from "../utils/api";
import { ICart } from "../../types/entities";
import { getAccessToken } from "./index";

export async function deleteCartItem(courseId: number) {
    const access_token = await getAccessToken();
    const res = await sendRequest<IBackendRes<ICart>>({
        method: "DELETE",
        url: `${process.env.NEXT_PUBLIC_SERVER}/cart/${courseId}`,
        headers: {
            Authorization: `Bearer ${access_token}`,
        },
    });
    revalidateTag("cart");
    return res;
}

export async function addCartItem(courseId: number) {
    const access_token = await getAccessToken();
    const res = await sendRequest<IBackendRes<ICart>>({
        method: "POST",
        url: `${process.env.NEXT_PUBLIC_SERVER}/cart/${courseId}`,
        headers: {
            Authorization: `Bearer ${access_token}`,
        },
    });
    revalidateTag("cart");
    return res;
}