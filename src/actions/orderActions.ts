"use server";

import { revalidateTag } from "next/cache";
import { sendRequest } from "../utils/api";
import { IOrder, PaymentMethod, OrderStatus } from "../../types/entities";
import { getAccessToken, getUserId } from "./index";

interface CreateOrderParams {
    cartId: string;
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
    
    // Validate cartId
    if (!cartId || cartId === 'undefined' || cartId === 'null') {
        throw new Error("Invalid cartId provided");
    }
    
    const res = await sendRequest<
        IBackendRes<{
            paymentUrl: string;
            order: IOrder;
        }>
    >({
        method: "POST",
        url: `${process.env.NEXT_PUBLIC_SERVER}/orders`,
        body: {
            cartId: String(cartId).trim(),
            totalPrice,
            paymentMethod,
            userId,
        },
        headers: {
            Authorization: `Bearer ${access_token}`,
        },
    });
    console.log(res)

    if (!res?.data) {
        throw new Error(res.message);
    }
    revalidateTag("order");
    return res?.data;
};

export interface GetOrdersParams {
    page?: number;
    limit?: number;
    search?: string;
    status?: OrderStatus;
    paymentMethod?: PaymentMethod;
    minPrice?: number;
    maxPrice?: number;
    startDate?: string;
    endDate?: string;
    userId?: number;
    userName?: string;
    userEmail?: string;
    transactionId?: string;
    orderBy?: string;
    order?: 'ASC' | 'DESC';
}

export const getOrders = async (params: GetOrdersParams = {}): Promise<IModelPaginate<IOrder>> => {
    const access_token = await getAccessToken();
    
    const queryParams: any = {
        page: params.page || 1,
        take: params.limit || 10,
    };
    
    // Only add parameters that are defined
    if (params.search) queryParams.search = params.search;
    if (params.status) queryParams.status = params.status;
    if (params.paymentMethod) queryParams.paymentMethod = params.paymentMethod;
    if (params.minPrice !== undefined) queryParams.minPrice = params.minPrice;
    if (params.maxPrice !== undefined) queryParams.maxPrice = params.maxPrice;
    if (params.startDate) queryParams.startDate = params.startDate;
    if (params.endDate) queryParams.endDate = params.endDate;
    if (params.userId) queryParams.userId = params.userId;
    if (params.userName) queryParams.userName = params.userName;
    if (params.userEmail) queryParams.userEmail = params.userEmail;
    if (params.transactionId) queryParams.transactionId = params.transactionId;
    if (params.orderBy) queryParams.orderBy = params.orderBy;
    if (params.order) queryParams.order = params.order;

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

    if (!res?.data) {
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

export const deleteOrder = async (id: string): Promise<void> => {
    const access_token = await getAccessToken();
    
    const res = await sendRequest<IBackendRes<void>>({
        method: "DELETE",
        url: `${process.env.NEXT_PUBLIC_SERVER}/orders/${id}`,
        headers: {
            Authorization: `Bearer ${access_token}`,
        },
    });

    if (res?.statusCode !== 200) {
        throw new Error(res?.message || "Failed to delete order");
    }
    
    revalidateTag("orders");
};