'use server'

import { revalidateTag } from "next/cache";
import {
    ICourseContent,
    ICourseLecture
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


// ============ LECTURE MANAGEMENT ============

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

// Caption Response Types - Updated for triple-language system
interface ICaptionData {
    vtt?: string;      // Original language
    envtt?: string;    // English
    vivtt?: string;    // Vietnamese
    transcript?: string;
}

// Get Lecture Captions - Returns all three caption tracks
export const getLectureCaptions = async (lectureId: string) => {
    try {
        const res = await sendRequest<IBackendRes<ICaptionData>>({
            method: "GET",
            url: `${process.env.NEXT_PUBLIC_SERVER}/course-content/lecture/${lectureId}/captions`,
            nextOption: {
                next: {
                    tags: ["captions", `captions-${lectureId}`],
                },
            },
        });

        // Return all three caption URLs
        return res?.data ? {
            vtt: res.data.vtt || null,
            envtt: res.data.envtt || null,
            vivtt: res.data.vivtt || null,
        } : null;
    } catch (error) {
        return null;
    }
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

// Batch Create/Update Course Content (sections and lectures)
export const batchUpdateCourseContent = async (
    courseId: number,
    sections: any[]
) => {
    const access_token = await getAccessToken();
    const res = await sendRequest<IBackendRes<any>>({
        method: "POST",
        url: `${process.env.NEXT_PUBLIC_SERVER}/course-content/course/${courseId}/batch-content`,
        body: { sections },
        headers: {
            Authorization: `Bearer ${access_token}`,
        },
    });

    if (!res?.data) {
        throw new Error(res.message || "Failed to update course content");
    }

    revalidateTag("course-content");
    revalidateTag(`course-structure-${courseId}`);
    return res.data;
};

// Legacy alias for backwards compatibility
export const saveCourseContent = batchUpdateCourseContent;

// Submit Quiz
export const submitQuiz = async (
    enrollmentId: number,
    lectureId: string,
    answers: Array<{ questionId: string; answer: string | number | boolean }>
) => {
    const access_token = await getAccessToken();
    const res = await sendRequest<IBackendRes<{
        score: number;
        totalPoints: number;
        percentage: number;
        passed: boolean;
        correctAnswers: number;
        totalQuestions: number;
        results: Array<{
            questionId: string;
            isCorrect: boolean;
            studentAnswer: string | number;
            correctAnswer: string | number;
            points: number;
            earnedPoints: number;
        }>;
    }>>({
        method: "POST",
        url: `${process.env.NEXT_PUBLIC_SERVER}/course-content/quiz/submit`,
        body: {
            enrollmentId,
            lectureId,
            answers
        },
        headers: {
            Authorization: `Bearer ${access_token}`,
        },
    });

    if (!res?.data) {
        throw new Error(res.message || "Failed to submit quiz");
    }

    revalidateTag("enrollment-progress");
    return res.data;
};