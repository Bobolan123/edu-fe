"use server";

import { revalidateTag } from "next/cache";
import { sendRequest } from "../../utils/api";
import { IOrder, PaymentMethod } from "../../types/entities";
import { getAccessToken, getUserId } from "./index";

interface CreateOrderParams {
    cartId: number;
    totalPrice: number;
    paymentMethod: PaymentMethod;
}

export const createOrder = async ({
    cartId,
    totalPrice,
    paymentMethod,
}: CreateOrderParams): Promise<{ paymentUrl: string; order: IOrder }> => {
    const access_token = await getAccessToken();
    const userId = await getUserId();
    
    const res = await sendRequest<
        IBackendRes<{
            paymentUrl: string;
            order: IOrder;
        }>
    >({
        method: "POST",
        url: `${process.env.NEXT_PUBLIC_SERVER}/orders`,
        body: {
            cartId,
            totalPrice,
            paymentMethod,
            userId,
        },
        headers: {
            Authorization: `Bearer ${access_token}`,
        },
    });

    if (!res?.data) {
        throw new Error(res.message);
    }
    revalidateTag("order");
    return res?.data;
};