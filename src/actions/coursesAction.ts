'use server'

import { revalidateTag } from "next/cache";
import { ICourse, ISection, ICourseContent, ICourseSection, ICourseLecture, CreateCaptionDto, UpdateCaptionDto, CaptionFormat, UpsertCourseContentDto, CreateSectionDto, UpdateSectionDto, CreateLectureDto, UpdateLectureDto } from "../../types/entities";
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
    const queryParams: any = {};
    if (includeDeleted) queryParams.includeDeleted = includeDeleted;
    
    const res = await sendRequest<IBackendRes<ICourse>>({
        method: "GET",
        url: `${process.env.NEXT_PUBLIC_SERVER}/courses/${id}`,
        queryParams: Object.keys(queryParams).length > 0 ? queryParams : undefined,
        nextOption: {
            next: {
                tags: ["courses", `course-${id}`],
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
    revalidateTag(`course-${id}`);
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
    return res;
};

// Get Course Content with new structure
export const getCourseContent = async (courseId: number) => {
    const res = await sendRequest<IBackendRes<any>>({
        method: "GET",
        url: `${process.env.NEXT_PUBLIC_SERVER}/courses/${courseId}/content`,
        nextOption: {
            next: {
                tags: ["course-content", `course-content-${courseId}`],
            },
        },
    });
    if (!res?.data) {
        return null;
    }
    return res.data;
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

export const restoreCourse = async (id: string) => {
    const access_token = await getAccessToken();

    const res = await sendRequest<IBackendRes<ICourse>>({
        method: "PATCH",
        url: `${process.env.NEXT_PUBLIC_SERVER}/courses/${id}/restore`,
        headers: {
            Authorization: `Bearer ${access_token}`,
        },
    });
    if (res?.statusCode !== 200 ) {
        throw new Error(res?.message || "Failed to restore course");
    }

    revalidateTag("courses");
    revalidateTag("admin-courses");
    revalidateTag(`course-${id}`);

    return res;
};

export const forceDeleteCourse = async (id: string) => {
    const access_token = await getAccessToken();

    const res = await sendRequest<IBackendRes<void>>({
        method: "DELETE",
        url: `${process.env.NEXT_PUBLIC_SERVER}/courses/${id}/force`,
        headers: {
            Authorization: `Bearer ${access_token}`,
        },
    });

    if (res?.statusCode !== 200) {
        throw new Error(res?.message || "Failed to permanently delete course");
    }

    revalidateTag("courses");
    revalidateTag("admin-courses");

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

// ============ COURSE CONTENT API FUNCTIONS ============

// Update Course Content
export const updateCourseContent = async (
    courseId: number,
    contentData: UpsertCourseContentDto
) => {
    const access_token = await getAccessToken();
    const res = await sendRequest<IBackendRes<any>>({
        method: "PUT",
        url: `${process.env.NEXT_PUBLIC_SERVER}/courses/${courseId}/content`,
        body: contentData,
        headers: {
            Authorization: `Bearer ${access_token}`,
        },
    });

    if (!res?.data) {
        throw new Error(res.message || "Failed to update course content");
    }

    revalidateTag(`course-content-${courseId}`);
    return res.data;
};

// Save Course Content (for ManageCourseContentModal)
export const saveCourseContent = async (
    courseId: number,
    sections: ICourseSection[]
) => {
    const access_token = await getAccessToken();
    const res = await sendRequest<IBackendRes<any>>({
        method: "PUT",
        url: `${process.env.NEXT_PUBLIC_SERVER}/courses/${courseId}/sections`,
        body: { sections },
        headers: {
            Authorization: `Bearer ${access_token}`,
        },
    });

    if (!res?.data) {
        throw new Error(res.message || "Failed to save course content");
    }

    revalidateTag(`course-content-${courseId}`);
    return res.data;
};

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

    const res = await sendRequestFile<IBackendRes<{ url: string }>>({
        method: "POST",
        url: `${process.env.NEXT_PUBLIC_SERVER}/courses/${courseId}/lecture`,
        body: formData,
        headers: {
            Authorization: `Bearer ${access_token}`,
        },
    });

    if (!res?.data) {
        throw new Error(res.message || "Failed to upload video");
    }

    revalidateTag(`course-content-${courseId}`);
    return res.data;
};

// Get SRT Captions
export const getSRTCaptions = async (
    courseId: number,
    lectureId: string
) => {
    const res = await sendRequest<IBackendRes<any>>({
        method: "GET",
        url: `${process.env.NEXT_PUBLIC_SERVER}/courses/${courseId}/lectures/${lectureId}/captions/srt`,
    });

    if (!res?.data) {
        throw new Error(res.message || "Failed to get captions");
    }

    return res.data;
};

// Update Lecture Progress
export const updateLectureProgress = async (
    enrollmentId: string,
    progressData: {
        lectureId: string;
        watchTimeSeconds: number;
        isCompleted: boolean;
        submissionData?: any;
    }
) => {
    const access_token = await getAccessToken();
    const res = await sendRequest<IBackendRes<any>>({
        method: "POST",
        url: `${process.env.NEXT_PUBLIC_SERVER}/enrollments/${enrollmentId}/progress`,
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

    revalidateTag(`course-content-${courseId}`);
    return res;
};

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

    revalidateTag(`course-content-${courseId}`);
    return res;
};

// ============ SECTION MANAGEMENT APIS ============

// Update Section
export const updateCourseSection = async (
    courseId: number,
    sectionId: string,
    sectionData: UpdateSectionDto
) => {
    const access_token = await getAccessToken();
    const res = await sendRequest<IBackendRes<ICourseSection>>({
        method: "PUT",
        url: `${process.env.NEXT_PUBLIC_SERVER}/courses/${courseId}/sections/${sectionId}`,
        body: sectionData,
        headers: {
            Authorization: `Bearer ${access_token}`,
        },
    });

    if (!res?.data) {
        throw new Error(res.message || "Failed to update section");
    }

    revalidateTag(`course-content-${courseId}`);
    return res.data;
};

// Delete Section
export const deleteCourseSection = async (
    courseId: number,
    sectionId: string
) => {
    const access_token = await getAccessToken();
    const res = await sendRequest<IBackendRes<void>>({
        method: "DELETE",
        url: `${process.env.NEXT_PUBLIC_SERVER}/courses/${courseId}/sections/${sectionId}`,
        headers: {
            Authorization: `Bearer ${access_token}`,
        },
    });

    if (res?.statusCode !== 200) {
        throw new Error(res.message || "Failed to delete section");
    }

    revalidateTag(`course-content-${courseId}`);
    return res;
};

// ============ LECTURE MANAGEMENT APIS ============

// Update Lecture
export const updateCourseLecture = async (
    courseId: number,
    sectionId: string,
    lectureId: string,
    lectureData: UpdateLectureDto
) => {
    const access_token = await getAccessToken();
    const res = await sendRequest<IBackendRes<ICourseLecture>>({
        method: "PUT",
        url: `${process.env.NEXT_PUBLIC_SERVER}/courses/${courseId}/sections/${sectionId}/lectures/${lectureId}`,
        body: lectureData,
        headers: {
            Authorization: `Bearer ${access_token}`,
        },
    });

    if (!res?.data) {
        throw new Error(res.message || "Failed to update lecture");
    }

    revalidateTag(`course-content-${courseId}`);
    return res.data;
};

// Delete Lecture
export const deleteCourseLecture = async (
    courseId: number,
    sectionId: string,
    lectureId: string
) => {
    const access_token = await getAccessToken();
    const res = await sendRequest<IBackendRes<void>>({
        method: "DELETE",
        url: `${process.env.NEXT_PUBLIC_SERVER}/courses/${courseId}/sections/${sectionId}/lectures/${lectureId}`,
        headers: {
            Authorization: `Bearer ${access_token}`,
        },
    });

    if (res?.statusCode !== 200) {
        throw new Error(res.message || "Failed to delete lecture");
    }

    revalidateTag(`course-content-${courseId}`);
    return res;
};

// ============ CAPTION MANAGEMENT APIS ============

// Create Caption
export const createCaption = async (
    captionData: CreateCaptionDto
) => {
    const access_token = await getAccessToken();
    const res = await sendRequest<IBackendRes<any>>({
        method: "POST",
        url: `${process.env.NEXT_PUBLIC_SERVER}/courses/${captionData.courseId}/lectures/${captionData.lectureId}/captions`,
        body: captionData,
        headers: {
            Authorization: `Bearer ${access_token}`,
        },
    });

    if (!res?.data) {
        throw new Error(res.message || "Failed to create caption");
    }

    return res.data;
};

// Update Caption
export const updateCaption = async (
    courseId: number,
    lectureId: string,
    captionData: UpdateCaptionDto
) => {
    const access_token = await getAccessToken();
    const res = await sendRequest<IBackendRes<any>>({
        method: "PUT",
        url: `${process.env.NEXT_PUBLIC_SERVER}/courses/${courseId}/lectures/${lectureId}/captions`,
        body: captionData,
        headers: {
            Authorization: `Bearer ${access_token}`,
        },
    });

    if (!res?.data) {
        throw new Error(res.message || "Failed to update caption");
    }

    return res.data;
};

// Get Captions by Format
export const getCaptionsByFormat = async (
    courseId: number,
    lectureId: string,
    format: CaptionFormat
) => {
    const res = await sendRequest<IBackendRes<any>>({
        method: "GET",
        url: `${process.env.NEXT_PUBLIC_SERVER}/courses/${courseId}/lectures/${lectureId}/captions`,
        queryParams: { format },
    });

    if (!res?.data) {
        throw new Error(res.message || "Failed to get captions");
    }

    return res.data;
};


