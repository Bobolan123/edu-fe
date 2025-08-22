"use server";

import { revalidateTag } from "next/cache";
import { IPermission } from "../../types/entities";
import { sendRequest } from "../../utils/api";
import { getAccessToken } from "./index";

export interface IPermissionCreateRequest {
    name: string;
    description?: string;
}

export const getPermissions = async (
    page: number = 1,
    limit: number = 10,
    search?: string
): Promise<IModelPaginate<IPermission>> => {
    const access_token = await getAccessToken();
    
    const queryParams: any = {
        page,
        take: limit,
    };
    
    if (search) queryParams.search = search;

    const res = await sendRequest<IModelPaginate<IPermission>>({
        method: "GET",
        url: `${process.env.NEXT_PUBLIC_SERVER}/permission`,
        queryParams,
        headers: {
            Authorization: `Bearer ${access_token}`,
        },
        nextOption: {
            next: { tags: ["permissions"] },
        },
    });

    if (res?.statusCode !== 200 || !res?.data) {
        throw new Error(res?.message || "Failed to fetch permissions");
    }

    return res;
};

export const getPermissionById = async (id: number): Promise<IPermission> => {
    const access_token = await getAccessToken();
    
    const res = await sendRequest<IBackendRes<IPermission>>({
        method: "GET",
        url: `${process.env.NEXT_PUBLIC_SERVER}/permission/${id}`,
        headers: {
            Authorization: `Bearer ${access_token}`,
        },
        nextOption: {
            next: { tags: [`permission-${id}`] },
        },
    });

    if (res?.statusCode !== 200 || !res?.data) {
        throw new Error(res?.message || "Failed to fetch permission");
    }

    return res.data;
};

export const createPermission = async (permissionData: IPermissionCreateRequest): Promise<IPermission> => {
    const access_token = await getAccessToken();
    
    const res = await sendRequest<IBackendRes<IPermission>>({
        method: "POST",
        url: `${process.env.NEXT_PUBLIC_SERVER}/permission`,
        body: permissionData,
        headers: {
            Authorization: `Bearer ${access_token}`,
        },
    });

    if (res?.statusCode !== 201 && res?.statusCode !== 200 || !res?.data) {
        throw new Error(res?.message || "Failed to create permission");
    }

    revalidateTag("permissions");
    
    return res.data;
};

export const deletePermission = async (id: number): Promise<void> => {
    const access_token = await getAccessToken();
    
    const res = await sendRequest<IBackendRes<void>>({
        method: "DELETE",
        url: `${process.env.NEXT_PUBLIC_SERVER}/permission/${id}`,
        headers: {
            Authorization: `Bearer ${access_token}`,
        },
    });

    if (res?.statusCode !== 200 && res?.statusCode !== 204) {
        throw new Error(res?.message || "Failed to delete permission");
    }

    revalidateTag("permissions");
    revalidateTag(`permission-${id}`);
};