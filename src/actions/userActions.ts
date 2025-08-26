"use server";

import { revalidateTag } from "next/cache";
import { IUser } from "../../types/entities";
import { sendRequest, sendRequestFile } from "../../utils/api";
import { getAccessToken } from "./index";

export interface IUserListResponse {
    users: IUser[];
    total: number;
    page: number;
    limit: number;
}

export const getUsers = async (
    page: number = 1,
    limit: number = 10,
    search?: string,
    role?: string,
    status?: string
): Promise<IModelPaginate<IUser>> => {
    const access_token = await getAccessToken();
    
    const queryParams: any = {
        page,
        take: limit,
    };
    
    if (search) queryParams.search = search;
    if (role) queryParams.role = role;
    if (status) queryParams.status = status;

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

export const getUserById = async (id: number): Promise<IUser> => {
    const access_token = await getAccessToken();
    
    const res = await sendRequest<IBackendRes<IUser>>({
        method: "GET",
        url: `${process.env.NEXT_PUBLIC_SERVER}/users/${id}`,
        headers: {
            Authorization: `Bearer ${access_token}`,
        },
        nextOption: {
            next: { tags: [`user-${id}`] },
        },
    });

    if (res?.statusCode !== 200 || !res?.data) {
        throw new Error(res?.message || "Failed to fetch user");
    }

    return res.data;
};

export const updateUser = async (
    id: number,
    userData: Partial<IUser>
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
    revalidateTag(`user-${id}`);
    
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


export const updateUserAvatar = async (id: number, avatar: File): Promise<void> => {
    const access_token = await getAccessToken();
    
    const formData = new FormData();
    formData.append('avatar', avatar);
    
    const res = await sendRequestFile<IBackendRes<void>>({
        method: "POST",
        url: `${process.env.NEXT_PUBLIC_SERVER}/users/${id}/avatar`,
        body: formData,
        headers: {
            Authorization: `Bearer ${access_token}`,
        },
    });

    if (res?.statusCode !== 201) {
        throw new Error(res?.message || "Failed to upload avatar");
    }

    revalidateTag("users");
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
    revalidateTag(`user-${id}`);
    
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
            next: { tags: [`user-${userId}-enrollments`] },
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
