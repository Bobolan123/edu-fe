"use server";

import { revalidateTag } from "next/cache";
import { sendRequest } from "../../utils/api";
import { auth } from "@/auth";
import { getAccessToken } from ".";
import { IEnrollment } from "../../types/entities";

export const getEnrollmentWithProgress = async (
    access_token: string,
    enrollmentId: number
) => {
    const res = await sendRequest<IBackendRes<any>>({
        method: "GET",
        url: `${process.env.NEXT_PUBLIC_SERVER}/enrollments/${enrollmentId}/progress`,
        headers: {
            Authorization: `Bearer ${access_token}`,
        },
    });
    if (!res?.data) {
        throw new Error(res.message);
    }

    return res.data;
};

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

    revalidateTag(`enrollment-progress-${courseId}`);

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
    orderBy?: 'date_enrolled' | 'id' | 'course_title' | 'student_name' | 'instructor_name';
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
    
    const queryParams = new URLSearchParams();
    
    // Pagination
    queryParams.set('page', (params.page || 1).toString());
    queryParams.set('take', (params.take || 10).toString());
    
    // Search and filters
    if (params.search) queryParams.set('search', params.search);
    if (params.userId) queryParams.set('userId', params.userId.toString());
    if (params.courseId) queryParams.set('courseId', params.courseId.toString());
    if (params.instructorId) queryParams.set('instructorId', params.instructorId.toString());
    if (params.courseName) queryParams.set('courseName', params.courseName);
    if (params.studentName) queryParams.set('studentName', params.studentName);
    if (params.studentEmail) queryParams.set('studentEmail', params.studentEmail);
    if (params.enrolledFromDate) queryParams.set('enrolledFromDate', params.enrolledFromDate);
    if (params.enrolledToDate) queryParams.set('enrolledToDate', params.enrolledToDate);
    
    // Sorting - map our frontend sortBy values to API parameters
    const order = params.order || 'DESC';
    let orderBy = params.orderBy || 'date_enrolled';
    
    queryParams.set('order', order);
    queryParams.set('orderBy', orderBy);
    
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
    
    if (!res?.data) {
        throw new Error(res?.message || 'Failed to fetch enrollments');
    }
    
    return res.data;
};
