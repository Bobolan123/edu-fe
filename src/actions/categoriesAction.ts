'use server'

import { revalidateTag } from "next/cache";
import { ICategory } from "../../types/entities";
import { sendRequest } from "../../utils/api";
import { getAccessToken } from "./index";

export const getCategories = async (
    page: number = 1,
    limit: number = 10,
    search?: string
): Promise<IModelPaginate<ICategory>> => {
    const queryParams: any = {
        page,
        take: limit,
    };
    
    if (search) queryParams.search = search;

    const res = await sendRequest<IModelPaginate<ICategory>>({
        method: "GET",
        url: `${process.env.NEXT_PUBLIC_SERVER}/categories`,
        queryParams,
        nextOption: {
            next: { tags: ["categories"] },
        },
    });
    
    if (!res?.data) {
        throw new Error(res?.message || "Failed to fetch categories");
    }
    return res;
};

export const getCategoryById = async (id: number): Promise<ICategory> => {
    const res = await sendRequest<IBackendRes<ICategory>>({
        method: "GET",
        url: `${process.env.NEXT_PUBLIC_SERVER}/categories/${id}`,
        nextOption: {
            next: { tags: [`category-${id}`] },
        },
    });
    
    if (!res?.data) {
        throw new Error(res?.message || "Failed to fetch categories");
    }
    return res.data;
};

export interface ICreateCategoryPayload {
    name: string;
    description?: string;
}

export const createCategory = async (
    data: ICreateCategoryPayload
): Promise<ICategory> => {
    const access_token = await getAccessToken();
    
    const res = await sendRequest<IBackendRes<ICategory>>({
        method: "POST",
        url: `${process.env.NEXT_PUBLIC_SERVER}/categories`,
        body: data,
        headers: {
            Authorization: `Bearer ${access_token}`,
        },
    });

    if (!res?.data) {
        throw new Error(res?.message || "Failed to fetch categories");
    }
    
    revalidateTag("categories");
    return res.data;
};

export const updateCategory = async (
    id: number,
    data: Partial<ICategory>
): Promise<ICategory> => {
    const access_token = await getAccessToken();
    
    const res = await sendRequest<IBackendRes<ICategory>>({
        method: "PATCH",
        url: `${process.env.NEXT_PUBLIC_SERVER}/categories/${id}`,
        body: data,
        headers: {
            Authorization: `Bearer ${access_token}`,
        },
    });

    if (!res?.data) {
        throw new Error(res?.message || "Failed to fetch categories");
    }
    
    revalidateTag("categories");
    revalidateTag(`category-${id}`);
    return res.data;
};

export const deleteCategory = async (id: number): Promise<void> => {
    const access_token = await getAccessToken();
    
    const res = await sendRequest<IBackendRes<void>>({
        method: "DELETE",
        url: `${process.env.NEXT_PUBLIC_SERVER}/categories/${id}`,
        headers: {
            Authorization: `Bearer ${access_token}`,
        },
    });

    if (res?.statusCode !== 200) {
        throw new Error(res?.message || "Failed to delete category");
    }
    
    revalidateTag("categories");
};
