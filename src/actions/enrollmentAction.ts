"use server";

import { revalidateTag } from "next/cache";
import { sendRequest } from "../../utils/api";
import { auth } from "@/auth";
import { getAccessToken } from ".";

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
