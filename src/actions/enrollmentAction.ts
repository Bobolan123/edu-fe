"use server";

import { revalidateTag } from "next/cache";
import { sendRequest } from "../../utils/api";

export const getEnrollmentWithProgress = async (
    access_token: string,
    enrrolmentId: number
) => {
    const res = await sendRequest<IBackendRes<any>>({
        method: "GET",
        url: `${process.env.NEXT_PUBLIC_SERVER}/enrollments/${enrrolmentId}/progress`,
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
    access_token: string,
    enrollmentId: string,
    lectureId: string,
    courseId: number
): Promise<IBackendRes<any>> => {
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

    console.log(res)
    if (res?.statusCode !== 200 || !res?.data) {
        throw new Error(res?.message || "Failed to mark lecture as completed");
    }

    // Revalidate the enrollment progress cache
    revalidateTag(`enrollment-progress-${courseId}`);

    return res;
};
