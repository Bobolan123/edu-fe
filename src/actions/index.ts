"use server";

import { revalidateTag } from "next/cache";
import { sendRequest, sendRequestFile } from "../../utils/api";
import { ISection } from "../../types/entities";

export const uploadLectureVideo = async (
    courseId: number,
    formData: FormData
) => {
    const res = await sendRequestFile<
        IBackendRes<{ videoUrl: string; totalDuration: string }>
    >({
        method: "POST",
        url: `${process.env.NEXT_PUBLIC_SERVER}/courses/${courseId}/lecture`,
        body: formData,
    });

    revalidateTag("course-content");
    return res;
};

export async function saveCourseContent(
    courseId: number,
    sections: ISection[]
) {
    const res = await sendRequest<
        IBackendRes<{ videoUrl: string; totalDuration: string }>
    >({
        method: "PUT",
        url: `${process.env.NEXT_PUBLIC_SERVER}/courses/content/${courseId}`,
        body: {sections},
    });
    revalidateTag("course-content");
    return res;
}
