"use server";

import { revalidateTag } from "next/cache";
import { sendRequest, sendRequestFile } from "../../utils/api";
import { ICart, IOrder, ISection, PaymentMethod } from "../../types/entities";
import { cookies } from "next/headers";

export const uploadLectureVideo = async (
    courseId: number,
    formData: FormData
) => {
    const res = await sendRequestFile<
        IBackendRes<{ videoUrl: string; totalDuration: string }>
    >({
        method: "POST",
        url: `${process.env.NEXT_PUBLIC_SERVER}/courses/${courseId}/lecture`,
        body: formData,
    });

    revalidateTag("course-content");
    return res;
};

export async function saveCourseContent(
    courseId: number,
    sections: ISection[]
) {
    const res = await sendRequest<
        IBackendRes<{ videoUrl: string; totalDuration: string }>
    >({
        method: "PUT",
        url: `${process.env.NEXT_PUBLIC_SERVER}/courses/content/${courseId}`,
        body: { sections },
    });
    revalidateTag("course-content");
    return res;
}

export async function deleteCartItem(courseId: number, access_token: string) {
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

export async function addCartItem(courseId: number, access_token: string) {
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

interface CreateOrderParams {
    cartId: number;
    totalPrice: number;
    paymentMethod: PaymentMethod;
    userId: string;
    access_token: string;
}

export const createOrder = async ({
    cartId,
    totalPrice,
    paymentMethod,
    userId,
    access_token,
}: CreateOrderParams): Promise<{ paymentUrl: string; order: IOrder }> => {
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

export async function setExchangeRateCookie(rate: number) {
    const cookieStore = await cookies();

    cookieStore.set("exchangeRate", rate.toString(), {
        maxAge: 3600, // 1 hour
        path: "/",
    });
}
