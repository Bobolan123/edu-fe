"use server";

import { revalidateTag } from "next/cache";
import { sendRequest } from "../../utils/api";
import { IOrder, PaymentMethod, OrderStatus } from "../../types/entities";
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

export const getOrders = async (
    page: number = 1,
    limit: number = 10,
    status?: OrderStatus,
    search?: string,
    userId?: number
): Promise<IModelPaginate<IOrder>> => {
    const access_token = await getAccessToken();
    
    const queryParams: any = {
        page,
        take: limit,
    };
    
    if (status) queryParams.status = status;
    if (search) queryParams.search = search;
    if (userId) queryParams.userId = userId;

    const res = await sendRequest<IModelPaginate<IOrder>>({
        method: "GET",
        url: `${process.env.NEXT_PUBLIC_SERVER}/orders`,
        queryParams,
        headers: {
            Authorization: `Bearer ${access_token}`,
        },
        nextOption: {
            next: { tags: ["orders"] },
        },
    });

    if (res?.statusCode !== 200 || !res?.data) {
        throw new Error(res?.message || "Failed to fetch orders");
    }

    return res;
};

export const getOrderById = async (id: string): Promise<IOrder> => {
    const access_token = await getAccessToken();
    
    const res = await sendRequest<IBackendRes<IOrder>>({
        method: "GET",
        url: `${process.env.NEXT_PUBLIC_SERVER}/orders/${id}`,
        headers: {
            Authorization: `Bearer ${access_token}`,
        },
        nextOption: {
            next: { tags: [`order-${id}`] },
        },
    });

    if (res?.statusCode !== 200 || !res?.data) {
        throw new Error(res?.message || "Failed to fetch order");
    }

    return res.data;
};

export const updateOrderStatus = async (
    id: string,
    status: OrderStatus
): Promise<IOrder> => {
    const access_token = await getAccessToken();
    
    const res = await sendRequest<IBackendRes<IOrder>>({
        method: "PATCH",
        url: `${process.env.NEXT_PUBLIC_SERVER}/orders/${id}/status`,
        body: { status },
        headers: {
            Authorization: `Bearer ${access_token}`,
        },
    });

    if (res?.statusCode !== 200 || !res?.data) {
        throw new Error(res?.message || "Failed to update order status");
    }

    revalidateTag("orders");
    revalidateTag(`order-${id}`);
    
    return res.data;
};