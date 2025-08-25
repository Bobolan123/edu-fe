"use server";

import { revalidateTag } from "next/cache";
import { IRole, IPermission } from "../../types/entities";
import { sendRequest } from "../../utils/api";
import { getAccessToken } from "./index";

export interface IRoleCreateRequest {
    name: string;
    description?: string;
    permissions?: number[];
}

export interface IRoleUpdatePermissionsRequest {
    roleId: number;
    permissions: number[];
}

export const getRoles = async (
    page: number = 1,
    limit: number = 10,
    search?: string
): Promise<IBackendRes<IRole>> => {
    const access_token = await getAccessToken();
    
    const queryParams: any = {
        page,
        take: limit,
    };
    
    if (search) queryParams.search = search;

    const res = await sendRequest<IBackendRes<IRole>>({
        method: "GET",
        url: `${process.env.NEXT_PUBLIC_SERVER}/roles`,
        queryParams,
        headers: {
            Authorization: `Bearer ${access_token}`,
        },
        nextOption: {
            next: { tags: ["roles"] },
        },
    });

    if (res?.statusCode !== 200 || !res?.data) {
        throw new Error(res?.message || "Failed to fetch roles");
    }

    return res;
};

export const getRoleById = async (id: number): Promise<IRole> => {
    const access_token = await getAccessToken();
    
    const res = await sendRequest<IBackendRes<IRole>>({
        method: "GET",
        url: `${process.env.NEXT_PUBLIC_SERVER}/roles/${id}`,
        headers: {
            Authorization: `Bearer ${access_token}`,
        },
        nextOption: {
            next: { tags: [`role-${id}`] },
        },
    });

    if (res?.statusCode !== 200 || !res?.data) {
        throw new Error(res?.message || "Failed to fetch role");
    }

    return res.data;
};

export const createRole = async (roleData: IRoleCreateRequest): Promise<IRole> => {
    const access_token = await getAccessToken();
    
    const res = await sendRequest<IBackendRes<IRole>>({
        method: "POST",
        url: `${process.env.NEXT_PUBLIC_SERVER}/roles`,
        body: roleData,
        headers: {
            Authorization: `Bearer ${access_token}`,
        },
    });

    if (res?.statusCode !== 201 && res?.statusCode !== 200 || !res?.data) {
        throw new Error(res?.message || "Failed to create role");
    }

    revalidateTag("roles");
    
    return res.data;
};

export const deleteRole = async (id: number): Promise<void> => {
    const access_token = await getAccessToken();
    
    const res = await sendRequest<IBackendRes<void>>({
        method: "DELETE",
        url: `${process.env.NEXT_PUBLIC_SERVER}/roles/${id}`,
        headers: {
            Authorization: `Bearer ${access_token}`,
        },
    });

    if (res?.statusCode !== 200 && res?.statusCode !== 204) {
        throw new Error(res?.message || "Failed to delete role");
    }

    revalidateTag("roles");
    revalidateTag(`role-${id}`);
};

export const updateRolePermissions = async (
    data: IRoleUpdatePermissionsRequest
): Promise<IRole> => {
    const access_token = await getAccessToken();
    
    const res = await sendRequest<IBackendRes<IRole>>({
        method: "PUT",
        url: `${process.env.NEXT_PUBLIC_SERVER}/roles/permissions`,
        body: data,
        headers: {
            Authorization: `Bearer ${access_token}`,
        },
    });

    if (res?.statusCode !== 200 || !res?.data) {
        throw new Error(res?.message || "Failed to update role permissions");
    }

    revalidateTag("roles");
    revalidateTag(`role-${data.roleId}`);
    
    return res.data;
};