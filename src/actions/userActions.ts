"use server";

import { revalidateTag } from "next/cache";
import { IUser } from "../../types/entities";
import { sendRequest, sendRequestFile } from "../utils/api";
import { getAccessToken } from "./index";

export interface IUserListResponse {
    users: IUser[];
    total: number;
    page: number;
    limit: number;
}

export interface GetUsersParams {
    page?: number;
    limit?: number;
    search?: string;
    role?: string;
    status?: string;
    includeDeleted?: boolean;
}

export interface UpdateUserData {
    name?: string;
    email?: string;
    bio?: string;
    roleId?: number;
    isActive?: boolean;
    [key: string]: any;
}

export const getUsers = async (params: GetUsersParams = {}): Promise<IModelPaginate<IUser>> => {
    const access_token = await getAccessToken();
    
    const queryParams: any = {
        page: params.page || 1,
        take: params.limit || 10,
    };
    
    // Only add parameters that are defined
    if (params.search) queryParams.search = params.search;
    if (params.role) queryParams.role = params.role;
    if (params.status) queryParams.status = params.status;
    if (params.includeDeleted) queryParams.includeDeleted = params.includeDeleted;

    const res = await sendRequest<IModelPaginate<IUser>>({
        method: "GET",
        url: `${process.env.NEXT_PUBLIC_SERVER}/users`,
        queryParams,
        headers: {
            Authorization: `Bearer ${access_token}`,
        },
        nextOption: {
            next: { tags: ["users"] },
        },
    });

    if (res?.statusCode !== 200 || !res?.data) {
        throw new Error(res?.message || "Failed to fetch users");
    }

    return res;
};

export const getUserById = async (id: number, includeDeleted?: boolean): Promise<IUser> => {
    const access_token = await getAccessToken();
    
    const queryParams: any = {};
    if (includeDeleted) queryParams.includeDeleted = includeDeleted;
    
    const res = await sendRequest<IBackendRes<IUser>>({
        method: "GET",
        url: `${process.env.NEXT_PUBLIC_SERVER}/users/${id}`,
        queryParams: Object.keys(queryParams).length > 0 ? queryParams : undefined,
        headers: {
            Authorization: `Bearer ${access_token}`,
        },
        nextOption: {
            next: { tags: ["user"] },
        },
    });

    if (res?.statusCode !== 200 || !res?.data) {
        throw new Error(res?.message || "Failed to fetch user");
    }

    return res.data;
};

export const updateUser = async (
    id: number,
    userData: UpdateUserData
): Promise<IUser> => {
    const access_token = await getAccessToken();
    
    const res = await sendRequest<IBackendRes<IUser>>({
        method: "PATCH",
        url: `${process.env.NEXT_PUBLIC_SERVER}/users/${id}`,
        body: userData,
        headers: {
            Authorization: `Bearer ${access_token}`,
        },
    });

    if (res?.statusCode !== 200 || !res?.data) {
        throw new Error(res?.message || "Failed to update user");
    }

    revalidateTag("users");
    revalidateTag("user");
    
    return res.data;
};

export const deleteUser = async (id: number): Promise<void> => {
    const access_token = await getAccessToken();
    
    const res = await sendRequest<IBackendRes<void>>({
        method: "DELETE",
        url: `${process.env.NEXT_PUBLIC_SERVER}/users/${id}`,
        headers: {
            Authorization: `Bearer ${access_token}`,
        },
    });

    if (res?.statusCode !== 200) {
        throw new Error(res?.message || "Failed to delete user");
    }

    revalidateTag("users");
};


export const updateUserAvatar = async (id: number, avatar: File): Promise<{ avatar_url: string }> => {
    const access_token = await getAccessToken();

    const formData = new FormData();
    formData.append('avatar', avatar);

    const res = await sendRequestFile<IBackendRes<{ avatar_url: string }>>({
        method: "POST",
        url: `${process.env.NEXT_PUBLIC_SERVER}/users/${id}/avatar`,
        body: formData,
        headers: {
            Authorization: `Bearer ${access_token}`,
        },
    });

    if (res?.statusCode !== 201 || !res?.data) {
        throw new Error(res?.message || "Failed to upload avatar");
    }

    revalidateTag("users");
    revalidateTag("user");
    return res.data;
};

export const suspendUser = async (id: number, suspended: boolean): Promise<IUser> => {
    const access_token = await getAccessToken();
    
    const res = await sendRequest<IBackendRes<IUser>>({
        method: "PATCH",
        url: `${process.env.NEXT_PUBLIC_SERVER}/users/${id}/suspend`,
        body: { suspended },
        headers: {
            Authorization: `Bearer ${access_token}`,
        },
    });

    if (res?.statusCode !== 200 || !res?.data) {
        throw new Error(res?.message || "Failed to update user status");
    }

    revalidateTag("users");
    revalidateTag("user");
    
    return res.data;
};

export const getUserEnrollments = async (
    userId: number,
    page: number = 1,
    limit: number = 10
) => {
    const access_token = await getAccessToken();
    
    const res = await sendRequest<IModelPaginate<any>>({
        method: "GET",
        url: `${process.env.NEXT_PUBLIC_SERVER}/users/${userId}/enrollments`,
        queryParams: { page, take: limit },
        headers: {
            Authorization: `Bearer ${access_token}`,
        },
        nextOption: {
            next: { tags: ["user-enrollments"] },
        },
    });

    if (res?.statusCode !== 200 || !res?.data) {
        throw new Error(res?.message || "Failed to fetch user enrollments");
    }

    return res;
};

export const createAdminUser = async (formData: FormData): Promise<IUser> => {
    const access_token = await getAccessToken();
    
    const res = await sendRequestFile<IBackendRes<IUser>>({
        method: "POST",
        url: `${process.env.NEXT_PUBLIC_SERVER}/users/admin`,
        body: formData,
        headers: {
            Authorization: `Bearer ${access_token}`,
        },
    });

    if (res?.statusCode !== 201 || !res?.data) {
        throw new Error(res?.message || "Failed to create admin user");
    }

    revalidateTag("users");
    
    return res.data;
};

export const restoreUser = async (id: number): Promise<IUser> => {
    const access_token = await getAccessToken();
    
    const res = await sendRequest<IBackendRes<IUser>>({
        method: "PATCH",
        url: `${process.env.NEXT_PUBLIC_SERVER}/users/${id}/restore`,
        headers: {
            Authorization: `Bearer ${access_token}`,
        },
    });

    if (res?.statusCode !== 200 || !res?.data) {
        throw new Error(res?.message || "Failed to restore user");
    }

    revalidateTag("users");
    revalidateTag("user");
    
    return res.data;
};

export const forceDeleteUser = async (id: number): Promise<void> => {
    const access_token = await getAccessToken();
    
    const res = await sendRequest<IBackendRes<void>>({
        method: "DELETE",
        url: `${process.env.NEXT_PUBLIC_SERVER}/users/${id}/force`,
        headers: {
            Authorization: `Bearer ${access_token}`,
        },
    });

    if (res?.statusCode !== 200) {
        throw new Error(res?.message || "Failed to permanently delete user");
    }

    revalidateTag("users");
};

// Profile management actions following backend specifications
export const getCurrentUserProfile = async (): Promise<IUser> => {
    const access_token = await getAccessToken();
    
    const res = await sendRequest<IBackendRes<IUser>>({
        method: "GET",
        url: `${process.env.NEXT_PUBLIC_SERVER}/users/me`,
        headers: {
            Authorization: `Bearer ${access_token}`,
        },
        nextOption: {
            next: { tags: ["current-user"] },
        },
    });

    if (res?.statusCode !== 200 || !res?.data) {
        throw new Error(res?.message || "Failed to fetch profile");
    }

    return res.data;
};


// Change password following backend spec: PATCH /users/password/:id
export const changeUserPassword = async (id: number, passwordData: {
    currentPassword: string;
    newPassword: string;
}): Promise<void> => {
    const access_token = await getAccessToken();
    
    const res = await sendRequest<IBackendRes<any>>({
        method: "PATCH",
        url: `${process.env.NEXT_PUBLIC_SERVER}/users/password/${id}`,
        body: {
            id: id,
            password: passwordData.currentPassword,
            newPassword: passwordData.newPassword,
        },
        headers: {
            Authorization: `Bearer ${access_token}`,
        },
    });

    if (res?.statusCode !== 200) {
        throw new Error(res?.message || "Failed to change password");
    }
};

