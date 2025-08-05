'use server'

import { revalidateTag } from "next/cache";
import { ICourse, ISection } from "../../types/entities";
import { IStudentsResponse } from "../../types/resData";
import { sendRequest, sendRequestFile } from "../../utils/api";
import { getAccessToken } from "./index";

export interface ICreateCoursePayload {
    title: string;
    description: string;
    language: string;
    price: number;
    preview_url: string;
    active: boolean;
    categoryIds: number[];
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
    return res.data;
};

export const getCourses = async (queryParams?: any) => {
    const res = await sendRequest<IBackendRes<ICourse[]>>({
        method: "GET",
        url: `${process.env.NEXT_PUBLIC_SERVER}/courses`,
        queryParams,
    });

    if (!res?.data) {
        throw new Error(res.message);
    }

    return res.data;
};

export const getCoursesByCategory = async (ids: string) => {
    const res = await sendRequest<IBackendRes<ICourse[]>>({
        method: "GET",
        url: `${process.env.NEXT_PUBLIC_SERVER}/courses/by-category`,
        queryParams: { ids },
    });

    if (!res?.data) {
        throw new Error(res.message);
    }

    return res.data;
};

export const getCourseById = async (id: string) => {
    const res = await sendRequest<IBackendRes<ICourse>>({
        method: "GET",
        url: `${process.env.NEXT_PUBLIC_SERVER}/courses/${id}`,
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
    revalidateTag(`course-${id}`);
    return res.data;
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

export const updateCourseContent = async (
    courseId: number,
    content: any
) => {
    const access_token = await getAccessToken();
    const res = await sendRequest<IBackendRes<any>>({
        method: "PATCH",
        url: `${process.env.NEXT_PUBLIC_SERVER}/courses/content/${courseId}`,
        body: content,
        headers: {
            Authorization: `Bearer ${access_token}`,
        },
    });
    if (!res?.data) {
        throw new Error(res.message);
    }
    
    revalidateTag(`course-content-${courseId}`);
    return res.data;
};

export const getCourseContent = async (courseId: number) => {
    const res = await sendRequest<IBackendRes<any>>({
        method: "GET",
        url: `${process.env.NEXT_PUBLIC_SERVER}/courses/content/${courseId}`,
    });
    if (!res?.data) {
        throw new Error(res.message);
    }
    return res.data;
};

export const uploadLecture = async (
    lectureFile: File
  ) => {
    const access_token = await getAccessToken();
    const formData = new FormData();
    formData.append("lecture", lectureFile);
  
    const res = await sendRequestFile<IBackendRes<any>>({
      method: "POST",
      url: `${process.env.NEXT_PUBLIC_SERVER}/courses/lecture`,
      body: formData,
      headers: {
        Authorization: `Bearer ${access_token}`,
      },
    });
  
    if (!res?.data) {
      throw new Error(res.message);
    }
    return res.data;
  };

export const uploadVideoFile = async (
    videoFile: File
  ) => {
    const access_token = await getAccessToken();
    const formData = new FormData();
    formData.append("video", videoFile);
  
    const res = await sendRequest<IBackendRes<any>>({
      method: "POST",
      url: `${process.env.NEXT_PUBLIC_SERVER}/upload/video`,
      body: formData,
      headers: {
        Authorization: `Bearer ${access_token}`,
      },
    });
  
    if (!res?.data) {
      throw new Error(res.message);
    }
    return res.data;
  };

export const uploadLectureVideo = async (
    courseId: number,
    formData: FormData
) => {
    const access_token = await getAccessToken();
    const res = await sendRequestFile<
        IBackendRes<{ videoUrl: string }>
    >({
        method: "POST",
        url: `${process.env.NEXT_PUBLIC_SERVER}/courses/${courseId}/lecture`,
        body: formData,
        headers: {
            Authorization: `Bearer ${access_token}`,
        },
    });

    revalidateTag("course-content");
    return res;
};

export async function saveCourseContent(
    courseId: number,
    sections: ISection[]
) {
    const access_token = await getAccessToken();
    const res = await sendRequest<
        IBackendRes<{ videoUrl: string }>
    >({
        method: "PATCH",
        url: `${process.env.NEXT_PUBLIC_SERVER}/courses/content/${courseId}`,
        body: { sections },
        headers: {
            Authorization: `Bearer ${access_token}`,
        },
    }); 
    revalidateTag("course-content");
    return res;
}

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
