'use server'

import { revalidateTag } from "next/cache";
import {
    ICourseContent,
    ICourseSection,
    ICourseLecture,
    UpsertCourseContentDto,
    CreateSectionDto,
    UpdateSectionDto,
    CreateLectureDto,
    UpdateLectureDto
} from "../../types/entities";
import { sendRequest, sendRequestFile } from "../utils/api";
import { getAccessToken } from "./index";

// ============ COURSE CONTENT MANAGEMENT ============

// Get Course Content
export const getCourseContent = async (courseId: number) => {
    const res = await sendRequest<IBackendRes<ICourseContent>>({
        method: "GET",
        url: `${process.env.NEXT_PUBLIC_SERVER}/course-content/${courseId}/content`,
        nextOption: {
            next: {
                tags: ["course-content"],
            },
        },
    });
    if (!res?.data) {
        return null;
    }
    return res.data;
};

// Update Course Content Metadata
export const updateCourseContent = async (
    courseId: number,
    contentData: UpsertCourseContentDto
) => {
    const access_token = await getAccessToken();
    const res = await sendRequest<IBackendRes<any>>({
        method: "PATCH",
        url: `${process.env.NEXT_PUBLIC_SERVER}/course-content/${courseId}/content`,
        body: contentData,
        headers: {
            Authorization: `Bearer ${access_token}`,
        },
    });

    if (!res?.data) {
        throw new Error(res.message || "Failed to update course content");
    }

    revalidateTag("course-content");
    return res.data;
};

// Get Complete Course Structure
export const getCourseStructure = async (courseId: number) => {
    const res = await sendRequest<IBackendRes<any>>({
        method: "GET",
        url: `${process.env.NEXT_PUBLIC_SERVER}/course-content/course/${courseId}/structure`,
        nextOption: {
            next: {
                tags: ["course-structure", `course-structure-${courseId}`],
            },
        },
    });
    if (!res?.data) {
        return null;
    }
    return res.data;
};

// ============ SECTION MANAGEMENT ============

// Create Course Section
export const createCourseSection = async (
    courseId: number,
    sectionData: CreateSectionDto
) => {
    const access_token = await getAccessToken();
    const res = await sendRequest<IBackendRes<ICourseSection>>({
        method: "POST",
        url: `${process.env.NEXT_PUBLIC_SERVER}/course-content/course/${courseId}/sections`,
        body: sectionData,
        headers: {
            Authorization: `Bearer ${access_token}`,
        },
    });

    if (!res?.data) {
        throw new Error(res.message || "Failed to create section");
    }

    revalidateTag("course-content");
    return res;
};

// Update Section
export const updateCourseSection = async (
    sectionId: string,
    sectionData: UpdateSectionDto
) => {
    const access_token = await getAccessToken();
    const res = await sendRequest<IBackendRes<ICourseSection>>({
        method: "PATCH",
        url: `${process.env.NEXT_PUBLIC_SERVER}/course-content/sections/${sectionId}`,
        body: sectionData,
        headers: {
            Authorization: `Bearer ${access_token}`,
        },
    });

    if (!res?.data) {
        throw new Error(res.message || "Failed to update section");
    }

    revalidateTag("course-content");
    return res.data;
};

// Delete Section
export const deleteCourseSection = async (sectionId: string) => {
    const access_token = await getAccessToken();
    const res = await sendRequest<IBackendRes<void>>({
        method: "DELETE",
        url: `${process.env.NEXT_PUBLIC_SERVER}/course-content/sections/${sectionId}`,
        headers: {
            Authorization: `Bearer ${access_token}`,
        },
    });

    if (res?.statusCode !== 200) {
        throw new Error(res.message || "Failed to delete section");
    }

    revalidateTag("course-content");
    return res;
};

// Reorder Sections
export const reorderCourseSections = async (
    courseId: number,
    sectionIds: string[]
) => {
    const access_token = await getAccessToken();
    const res = await sendRequest<IBackendRes<any>>({
        method: "PUT",
        url: `${process.env.NEXT_PUBLIC_SERVER}/course-content/course/${courseId}/sections/reorder`,
        body: { sectionIds },
        headers: {
            Authorization: `Bearer ${access_token}`,
        },
    });

    if (!res?.data) {
        throw new Error(res.message || "Failed to reorder sections");
    }

    revalidateTag("course-content");
    return res.data;
};

// ============ LECTURE MANAGEMENT ============

// Create Course Lecture
export const createCourseLecture = async (
    courseId: number,
    sectionId: string,
    lectureData: CreateLectureDto
) => {
    const access_token = await getAccessToken();
    const res = await sendRequest<IBackendRes<ICourseLecture>>({
        method: "POST",
        url: `${process.env.NEXT_PUBLIC_SERVER}/course-content/sections/${sectionId}/lectures`,
        body: lectureData,
        headers: {
            Authorization: `Bearer ${access_token}`,
        },
    });

    if (!res?.data) {
        throw new Error(res.message || "Failed to create lecture");
    }

    revalidateTag("course-content");
    return res;
};

// Get Lecture Details
export const getLectureDetails = async (lectureId: string) => {
    const res = await sendRequest<IBackendRes<ICourseLecture>>({
        method: "GET",
        url: `${process.env.NEXT_PUBLIC_SERVER}/course-content/lectures/${lectureId}`,
        nextOption: {
            next: {
                tags: ["lecture", `lecture-${lectureId}`],
            },
        },
    });

    if (!res?.data) {
        throw new Error(res.message || "Failed to get lecture details");
    }

    return res.data;
};

// Update Lecture
export const updateCourseLecture = async (
    lectureId: string,
    lectureData: UpdateLectureDto
) => {
    const access_token = await getAccessToken();
    const res = await sendRequest<IBackendRes<ICourseLecture>>({
        method: "PATCH",
        url: `${process.env.NEXT_PUBLIC_SERVER}/course-content/lectures/${lectureId}`,
        body: lectureData,
        headers: {
            Authorization: `Bearer ${access_token}`,
        },
    });

    if (!res?.data) {
        throw new Error(res.message || "Failed to update lecture");
    }

    revalidateTag("course-content");
    return res.data;
};

// Delete Lecture
export const deleteCourseLecture = async (lectureId: string) => {
    const access_token = await getAccessToken();
    const res = await sendRequest<IBackendRes<void>>({
        method: "DELETE",
        url: `${process.env.NEXT_PUBLIC_SERVER}/course-content/lectures/${lectureId}`,
        headers: {
            Authorization: `Bearer ${access_token}`,
        },
    });

    if (res?.statusCode !== 200) {
        throw new Error(res.message || "Failed to delete lecture");
    }

    revalidateTag("course-content");
    return res;
};

// Reorder Lectures
export const reorderSectionLectures = async (
    sectionId: string,
    lectureIds: string[]
) => {
    const access_token = await getAccessToken();
    const res = await sendRequest<IBackendRes<any>>({
        method: "PUT",
        url: `${process.env.NEXT_PUBLIC_SERVER}/course-content/sections/${sectionId}/lectures/reorder`,
        body: { lectureIds },
        headers: {
            Authorization: `Bearer ${access_token}`,
        },
    });

    if (!res?.data) {
        throw new Error(res.message || "Failed to reorder lectures");
    }

    revalidateTag("course-content");
    return res.data;
};

// ============ MEDIA & FILE MANAGEMENT ============

// Upload Video to Lecture
export const uploadVideoToLecture = async (
    courseId: number,
    sectionId: string,
    lectureId: string,
    videoFile: File
) => {
    const access_token = await getAccessToken();
    const formData = new FormData();
    formData.append("lecture", videoFile);
    formData.append("sectionId", sectionId);
    formData.append("lectureId", lectureId);

    const res = await sendRequestFile<IBackendRes<string>>({
        method: "POST",
        url: `${process.env.NEXT_PUBLIC_SERVER}/course-content/${courseId}/lecture`,
        body: formData,
        headers: {
            Authorization: `Bearer ${access_token}`,
        },
    });

    if (!res?.data) {
        throw new Error(res.message || "Failed to upload video");
    }

    revalidateTag("course-content");
    return res;
};

// Get Lecture Captions
export const getLectureCaptions = async (lectureId: string) => {
    const res = await sendRequest<IBackendRes<any>>({
        method: "GET",
        url: `${process.env.NEXT_PUBLIC_SERVER}/course-content/lecture/${lectureId}/captions`,
        nextOption: {
            next: {
                tags: ["captions", `captions-${lectureId}`],
            },
        },
    });

    if (!res?.data) {
        throw new Error(res.message || "Failed to get captions");
    }

    return res.data;
};

// ============ PROGRESS TRACKING ============

// Update Lecture Progress
export const updateLectureProgress = async (
    enrollmentId: string,
    lectureId: string,
    progressData: {
        watchTimeSeconds: number;
        lastPositionSeconds?: number;
        isCompleted: boolean;
        submissionData?: any;
    }
) => {
    const access_token = await getAccessToken();
    const res = await sendRequest<IBackendRes<any>>({
        method: "POST",
        url: `${process.env.NEXT_PUBLIC_SERVER}/course-content/progress/${enrollmentId}/lectures/${lectureId}`,
        body: progressData,
        headers: {
            Authorization: `Bearer ${access_token}`,
        },
    });

    if (!res?.data) {
        throw new Error(res.message || "Failed to update progress");
    }

    return res.data;
};

// Get Course Progress
export const getCourseProgress = async (
    enrollmentId: string,
    courseId: number
) => {
    const access_token = await getAccessToken();
    const res = await sendRequest<IBackendRes<any>>({
        method: "GET",
        url: `${process.env.NEXT_PUBLIC_SERVER}/course-content/progress/${enrollmentId}/course/${courseId}`,
        headers: {
            Authorization: `Bearer ${access_token}`,
        },
        nextOption: {
            next: {
                tags: ["progress", `progress-${enrollmentId}-${courseId}`],
            },
        },
    });

    if (!res?.data) {
        throw new Error(res.message || "Failed to get course progress");
    }

    return res.data;
};

export const saveCourseContent = async (
    courseId: number,
    sections: any[]
) => {
    return {
        statusCode: 200,
        message: "Course content saved",
        data: sections
    };
};