'use server'

import { revalidateTag } from "next/cache";
import { ICourse } from "../../types/entities";
import { IStudentsResponse } from "../../types/resData";
import { sendRequest, sendRequestFile } from "../utils/api";
import { getAccessToken } from "./index";

export interface ICreateCoursePayload {
    title: string;
    description: string;
    language: string;
    price: number;
    preview_url?: string;
    thumbnail_url?: string;
    isActive: boolean;
    categoryIds: number[];
    instructorId?: number;
}

export const createCourse = async (
    data: ICreateCoursePayload
) => {
    const access_token = await getAccessToken();
    const res = await sendRequest<IBackendRes<ICourse>>({
        method: "POST",
        url: `${process.env.NEXT_PUBLIC_SERVER}/courses`,
        body: data,
        headers: {
            Authorization: `Bearer ${access_token}`,
        },
    });

    if (!res?.data) {
        throw new Error(res.message);
    }
    return res;
};


export interface GetCoursesParams {
    page?: number;
    limit?: number;
    search?: string;
    title?: string;
    categoryIds?: number[];
    instructorId?: number;
    status?: string;
    includeDeleted?: boolean;
    minPrice?: number;
    maxPrice?: number;
    minRating?: number;
    maxRating?: number;
    orderBy?: string;
    order?: 'ASC' | 'DESC';
    excludeEnrolled?: boolean;
    userId?: number;
}

export const getCourses = async (params: GetCoursesParams = {}): Promise<IModelPaginate<ICourse>> => {
    const access_token = await getAccessToken();
    
    const queryParams: any = {
        page: params.page || 1,
        take: params.limit || 10,
    };
    
    // Only add parameters that are defined
    if (params.search) queryParams.search = params.search;
    if (params.title) queryParams.title = params.title;
    if (params.categoryIds && params.categoryIds.length > 0) {
        queryParams.categoryIds = params.categoryIds;
    }
    if (params.instructorId) queryParams.instructorId = params.instructorId;
    if (params.status) queryParams.status = params.status;
    if (params.includeDeleted) queryParams.includeDeleted = params.includeDeleted;
    if (params.minPrice !== undefined) queryParams.minPrice = params.minPrice;
    if (params.maxPrice !== undefined) queryParams.maxPrice = params.maxPrice;
    if (params.minRating !== undefined) queryParams.minRating = params.minRating;
    if (params.maxRating !== undefined) queryParams.maxRating = params.maxRating;
    if (params.orderBy) queryParams.orderBy = params.orderBy;
    if (params.order) queryParams.order = params.order;
    if (params.excludeEnrolled) queryParams.excludeEnrolled = params.excludeEnrolled;
    if (params.userId) queryParams.userId = params.userId;

    const res = await sendRequest<IModelPaginate<ICourse>>({
        method: "GET",
        url: `${process.env.NEXT_PUBLIC_SERVER}/courses`,
        queryParams,
        headers: {
            Authorization: `Bearer ${access_token}`,
        },
        nextOption: {
            next: { tags: ["admin-courses"] },
        },
    });

    if (res?.statusCode !== 200 || !res?.data) {
        throw new Error(res?.message || "Failed to fetch courses");
    }

    return res;
};


export const getCourseById = async (id: string, includeDeleted?: boolean) => {
    const access_token = await getAccessToken();
    const queryParams: any = {};
    if (includeDeleted) queryParams.includeDeleted = includeDeleted;
    
    const res = await sendRequest<IBackendRes<ICourse>>({
        method: "GET",
        url: `${process.env.NEXT_PUBLIC_SERVER}/courses/${id}`,
        queryParams,
        headers: {
            Authorization: `Bearer ${access_token}`,
        },
        nextOption: {
            next: {
                tags: ["course"],
            },
        },
    });

    if (!res?.data) {
        throw new Error(res.message);
    }

    return res.data;
};

export const updateCourse = async (
    id: string,
    data: Partial<ICourse>
) => {
    const access_token = await getAccessToken();
    const res = await sendRequest<IBackendRes<any>>({
        method: "PATCH",
        url: `${process.env.NEXT_PUBLIC_SERVER}/courses/${id}`,
        body: data,
        headers: {
            Authorization: `Bearer ${access_token}`,
        },
    });

    if (!res?.data) {
        throw new Error(res.message);
    }

    revalidateTag("courses");
    revalidateTag("admin-courses");
    revalidateTag("course");
    return res;
};

export const deleteCourse = async (id: string) => {
    const access_token = await getAccessToken();
    const res = await sendRequest<IBackendRes<any>>({
        method: "DELETE",
        url: `${process.env.NEXT_PUBLIC_SERVER}/courses/${id}`,
        headers: {
            Authorization: `Bearer ${access_token}`,
        },
    });
 
    if (res?.statusCode !== 200) {
        throw new Error(res.message);
    }

    revalidateTag("courses");
    revalidateTag("admin-courses");
    revalidateTag("course");
    return res;
};


export const uploadThumbnail = async (
    id: string,
    thumbnail: File
) => {
    const access_token = await getAccessToken();
    const formData = new FormData();
    formData.append("thumbnail", thumbnail);
    const res = await sendRequestFile<IBackendRes<any>>({
        method: "POST",
        url: `${process.env.NEXT_PUBLIC_SERVER}/courses/${id}/thumbnail`,
        body: formData,
        headers: {
            Authorization: `Bearer ${access_token}`,
        },
    });
    if (!res?.data) {
        throw new Error(res.message);
    }
    revalidateTag("courses");
    revalidateTag("course");
    return res;
};


export const getCourseStudents = async (
    courseId: number,
    page: number = 1,
    take: number = 10
): Promise<IStudentsResponse | null> => {
    const access_token = await getAccessToken();
    const res = await sendRequest<IBackendRes<any>>({
        method: "GET",
        url: `${process.env.NEXT_PUBLIC_SERVER}/courses/${courseId}/students`,
        queryParams: { page, take },
        headers: {
            Authorization: `Bearer ${access_token}`,
        },
    });

    if (!res?.data) {
        console.error("Failed to fetch course students:", res?.message || "Unknown error");
        return null;
    }
    
    return res.data;
};

export const restoreCourse = async (courseId: number): Promise<IBackendRes<any>> => {
    const access_token = await getAccessToken();

    const res = await sendRequest<IBackendRes<any>>({
        method: "PATCH",
        url: `${process.env.NEXT_PUBLIC_SERVER}/courses/${courseId}/restore`,
        headers: {
            Authorization: `Bearer ${access_token}`,
        },
        nextOption: {
            tags: ["courses"],
        },
    });
    if (res?.statusCode !== 200 ) {
        throw new Error(res?.message || "Failed to restore course");
    }

    revalidateTag("courses");
    revalidateTag("admin-courses");
    revalidateTag("course");

    return res;
};

export const forceDeleteCourse = async (courseId: number): Promise<IBackendRes<any>> => {
    const access_token = await getAccessToken();

    const res = await sendRequest<IBackendRes<any>>({
        method: "DELETE",
        url: `${process.env.NEXT_PUBLIC_SERVER}/courses/${courseId}/force`,
        headers: {
            Authorization: `Bearer ${access_token}`,
        },
        nextOption: {
            tags: ["courses"],
        },
    });

    if (res?.statusCode !== 200) {
        throw new Error(res?.message || "Failed to permanently delete course");
    }

    revalidateTag("courses");
    revalidateTag("admin-courses");
    revalidateTag("course");

    return res;
};

// ============ ADDITIONAL COURSE MANAGEMENT APIS ============

// Get Courses by Category
export const getCoursesByCategory = async (categoryId: number) => {
    const res = await sendRequest<IBackendRes<ICourse[]>>({
        method: "GET",
        url: `${process.env.NEXT_PUBLIC_SERVER}/courses/category/${categoryId}`,
        nextOption: {
            next: { tags: ["courses", `category-${categoryId}`] },
        },
    });

    if (!res?.data) {
        throw new Error(res.message || "Failed to fetch courses by category");
    }

    return res.data;
};

// Advanced Course Search
export const searchCourses = async (params: GetCoursesParams & {
    maxRating?: number;
}): Promise<IModelPaginate<ICourse>> => {
    const access_token = await getAccessToken();

    const queryParams: any = {
        page: params.page || 1,
        take: params.limit || 10,
    };

    // Add all search parameters
    Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
            if (key === 'categoryIds' && Array.isArray(value)) {
                queryParams[key] = value.join(',');
            } else {
                queryParams[key] = value;
            }
        }
    });

    const res = await sendRequest<IModelPaginate<ICourse>>({
        method: "GET",
        url: `${process.env.NEXT_PUBLIC_SERVER}/courses`,
        queryParams,
        headers: access_token ? {
            Authorization: `Bearer ${access_token}`,
        } : {},
        nextOption: {
            next: { tags: ["courses-search"] },
        },
    });

    if (res?.statusCode !== 200 || !res?.data) {
        throw new Error(res?.message || "Failed to search courses");
    }

    return res;
};

export const softDeleteCourse = async (courseId: number): Promise<IBackendRes<any>> => {
    const access_token = await getAccessToken();
    const res = await sendRequest<IBackendRes<any>>({
        method: "DELETE",
        url: `${process.env.NEXT_PUBLIC_SERVER}/courses/${courseId}`,
        headers: {
            Authorization: `Bearer ${access_token}`,
        },
        nextOption: {
            tags: ["courses"],
        },
    });

    if (res?.statusCode !== 200) {
        throw new Error(res?.message || "Failed to delete course");
    }

    revalidateTag("courses");
    return res;
};




