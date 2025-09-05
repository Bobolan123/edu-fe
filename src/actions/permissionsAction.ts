"use server";

import { revalidateTag } from "next/cache";
import { IPermission } from "../../types/entities";
import { sendRequest } from "../../utils/api";
import { getAccessToken } from "./index";

export interface IPermissionCreateRequest {
    api: string;
    description: string;
    method: string;
    module: string;
}

export interface IPermissionUpdateRequest {
    api?: string;
    description?: string;
    method?: string;
    module?: string;
}

export interface GetPermissionsParams {
    page?: number;
    take?: number;
    search?: string;
    api?: string;
    description?: string;
    method?: string;
    module?: string;
    order?: 'ASC' | 'DESC';
    orderBy?: 'id' | 'api' | 'description' | 'method' | 'module' | 'created' | 'updated';
}

export const getPermissions = async (
    params: GetPermissionsParams = {}
): Promise<IModelPaginate<IPermission>> => {
    const access_token = await getAccessToken();
    
    const {
        page = 1,
        take = 10,
        search,
        api,
        description,
        method,
        module,
        order = 'DESC',
        orderBy = 'id'
    } = params;
    
    const queryParams: any = {
        page,
        take,
        order,
        orderBy,
    };
    
    if (search) queryParams.search = search;
    if (api) queryParams.api = api;
    if (description) queryParams.description = description;
    if (method) queryParams.method = method;
    if (module) queryParams.module = module;

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

export const updatePermission = async (id: number, permissionData: IPermissionUpdateRequest): Promise<IPermission> => {
    const access_token = await getAccessToken();
    
    const res = await sendRequest<IBackendRes<IPermission>>({
        method: "PUT",
        url: `${process.env.NEXT_PUBLIC_SERVER}/permission/${id}`,
        body: permissionData,
        headers: {
            Authorization: `Bearer ${access_token}`,
        },
    });

    if (res?.statusCode !== 200 || !res?.data) {
        throw new Error(res?.message || "Failed to update permission");
    }

    revalidateTag("permissions");
    revalidateTag(`permission-${id}`);
    
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