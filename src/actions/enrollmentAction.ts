"use server";

import { revalidateTag } from "next/cache";
import { sendRequest } from "../utils/api";
import { auth } from "@/auth";
import { getAccessToken } from ".";
import { IEnrollment } from "../../types/entities";



export const markLectureAsCompleted = async (
    enrollmentId: string,
    lectureId: string,
    courseId: number
): Promise<IBackendRes<any>> => {
    const access_token = await getAccessToken();
    const res = await sendRequest<IBackendRes<any>>({
        method: "POST",
        url: `${process.env.NEXT_PUBLIC_SERVER}/enrollments/${enrollmentId}/lectures/${lectureId}/complete`,
        headers: {
            Authorization: `Bearer ${access_token}`,
        },
        body: {
            courseId: courseId,
        },
    });

    if (res?.statusCode !== 201 || !res?.data) {
        console.log(res);
        throw new Error(res?.message || "Failed to mark lecture as completed");
    }

    revalidateTag("enrollment-progress");

    return res;
};


export const updateWatchTime = async (
    enrollmentId: string,
    lectureId: string,
    courseId: number,
    watchTime: number
): Promise<IBackendRes<any>> => {
    const access_token = await getAccessToken();
    const res = await sendRequest<IBackendRes<any>>({
        method: "PATCH",
        url: `${process.env.NEXT_PUBLIC_SERVER}/enrollments/${enrollmentId}/lectures/${lectureId}/watch-time`,
        headers: {
            Authorization: `Bearer ${access_token}`,
        },
        body: {
            courseId: courseId,
            watchTime: watchTime,
        },
    });

    if (res?.statusCode !== 200) {
        console.log(res);
        throw new Error(res?.message || "Failed to update watch time");
    }

    // Don't revalidate to prevent infinite refresh loop
    // revalidateTag(`enrollment-progress-${courseId}`);

    return res;
};

interface GetEnrollmentsAdminParams {
    page?: number;
    take?: number;
    search?: string;
    userId?: number;
    courseId?: number;
    instructorId?: number;
    courseName?: string;
    studentName?: string;
    studentEmail?: string;
    enrolledFromDate?: string;
    enrolledToDate?: string;
    order?: 'ASC' | 'DESC';
    orderBy?: string;
}

export const getAllEnrollmentsAdmin = async (params: GetEnrollmentsAdminParams = {}): Promise<{
    result: IEnrollment[];
    meta: {
        page: number;
        take: number;
        itemCount: number;
        pageCount: number;
        hasPreviousPage: boolean;
        hasNextPage: boolean;
    };
}> => {
    const access_token = await getAccessToken();
    
    const queryParams: any = {
        page: params.page || 1,
        take: params.take || 10,
    };
    
    // Search and filters
    if (params.search) queryParams.search = params.search;
    if (params.userId) queryParams.userId = params.userId;
    if (params.courseId) queryParams.courseId = params.courseId;
    if (params.instructorId) queryParams.instructorId = params.instructorId;
    if (params.courseName) queryParams.courseName = params.courseName;
    if (params.studentName) queryParams.studentName = params.studentName;
    if (params.studentEmail) queryParams.studentEmail = params.studentEmail;
    if (params.enrolledFromDate) queryParams.enrolledFromDate = params.enrolledFromDate;
    if (params.enrolledToDate) queryParams.enrolledToDate = params.enrolledToDate;
    
    // Sorting
    if (params.order) queryParams.order = params.order;
    if (params.orderBy) queryParams.orderBy = params.orderBy;
    
    const res = await sendRequest<IBackendRes<{
        result: IEnrollment[];
        meta: {
            page: number;
            take: number;
            itemCount: number;
            pageCount: number;
            hasPreviousPage: boolean;
            hasNextPage: boolean;
        };
    }>>({
        method: "GET",
        url: `${process.env.NEXT_PUBLIC_SERVER}/enrollments`,
        queryParams,
        headers: {
            Authorization: `Bearer ${access_token}`,
        },
        nextOption: {
            next: { tags: ["admin-enrollments"] },
        },
    });
    
    if (res?.statusCode !== 200 || !res?.data) {
        throw new Error(res?.message || 'Failed to fetch enrollments');
    }
    
    return res.data;
};

export const getEnrollmentProgress = async (userId: string, courseId: string) => {
    const access_token = await getAccessToken();
    const res = await sendRequest<IBackendRes<any>>({
        method: "GET",
        url: `${process.env.NEXT_PUBLIC_SERVER}/enrollments/user/${userId}/course/${courseId}/progress`,
        headers: {
            Authorization: `Bearer ${access_token}`,
        },
        nextOption: {
            next: {
                tags: ["enrollment-progress"],
            },
        },
    });
    return res?.data;
};

interface GetEnrolledCoursesParams {
    search?: string;
    page?: string;
    take?: string;
}

export const getEnrolledCourses = async (
    userId: string,
    params: GetEnrolledCoursesParams = {}
): Promise<any[]> => {
    const access_token = await getAccessToken();
    const res = await sendRequest<IModelPaginate<any>>({
        method: "GET",
        url: `${process.env.NEXT_PUBLIC_SERVER}/enrollments/user/${userId}/courses`,
        queryParams: {
            search: params.search,
            page: params.page,
            take: params.take,
        },
        headers: {
            Authorization: `Bearer ${access_token}`,
        },
        nextOption: {
            next: {
                tags: [`enrolled-courses-${userId}`],
            },
        },
    });
    
    return res?.data?.result || [];
};
