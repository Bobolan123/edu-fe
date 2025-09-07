"use server";

import { revalidateTag } from "next/cache";
import { IRole, IPermission } from "../../types/entities";
import { sendRequest } from "../utils/api";
import { getAccessToken } from "./index";
import { GetPermissionsParams } from "./permissionsAction";

export interface IRoleCreateRequest {
    name: string;
    description?: string;
    isActive?: boolean;
    permissionIds?: number[];
}

export interface IRoleUpdatePermissionsRequest {
    roleId: number;
    permissionIds: number[];
}

export interface IRoleUpdateRequest {
    name?: string;
    description?: string;
    isActive?: boolean;
    permissionIds?: number[];
}

export const getRoles = async (): Promise<IBackendRes<IRole[]>> => {
    const access_token = await getAccessToken();

    const res = await sendRequest<IBackendRes<IRole[]>>({
        method: "GET",
        url: `${process.env.NEXT_PUBLIC_SERVER}/roles`,
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

export const getPermissionsForRoles = async (
    params: GetPermissionsParams = {}
): Promise<IModelPaginate<IPermission>> => {
    const access_token = await getAccessToken();
    
    const {
        page = 1,
        take = 100, // Default higher limit for roles management
        search,
        api,
        description,
        method,
        module,
        order = 'ASC',
        orderBy = 'module'
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
            next: { tags: ["permissions-for-roles", `permissions-page-${page}`] },
        },
    });

    if (res?.statusCode !== 200 || !res?.data) {
        throw new Error(res?.message || "Failed to fetch permissions");
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

export const updateRole = async (id: number, roleData: IRoleUpdateRequest): Promise<IRole> => {
    const access_token = await getAccessToken();
    
    const res = await sendRequest<IBackendRes<IRole>>({
        method: "PATCH",
        url: `${process.env.NEXT_PUBLIC_SERVER}/roles/${id}`,
        body: roleData,
        headers: {
            Authorization: `Bearer ${access_token}`,
        },
    });

    if (res?.statusCode !== 200 || !res?.data) {
        throw new Error(res?.message || "Failed to update role");
    }

    revalidateTag("roles");
    revalidateTag(`role-${id}`);
    
    return res.data;
};