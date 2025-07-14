import { revalidateTag } from "next/cache";
import { ICourse } from "../../types/entities";
import { sendRequest } from "../../utils/api";

export interface ICreateCoursePayload {
    title: string;
    description: string;
    language: string;
    price: number;
    preview_url: string;
    active: boolean;
    duration: number;
    categoryIds: number[];
}

export const createCourse = async (
    access_token: string,
    data: ICreateCoursePayload
) => {
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
    access_token: string,
    id: string,
    data: Partial<ICourse>
) => {
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
    return res.data;
};

export const deleteCourse = async (access_token: string, id: string) => {
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
    access_token: string,
    id: string,
    thumbnail: File
) => {
    const formData = new FormData();
    formData.append("thumbnail", thumbnail);
    const res = await sendRequest<IBackendRes<any>>({
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
    return res.data;
};

export const updateCourseContent = async (
    access_token: string,
    courseId: number,
    content: any
) => {
    const res = await sendRequest<IBackendRes<any>>({
        method: "PUT",
        url: `${process.env.NEXT_PUBLIC_SERVER}/courses/content/${courseId}`,
        body: content,
        headers: {
            Authorization: `Bearer ${access_token}`,
        },
    });
    if (!res?.data) {
        throw new Error(res.message);
    }
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
    access_token: string,
    courseId: number,
    sectionId: number,
    lectureId: number,
    lectureFile: File
  ) => {
    const formData = new FormData();
    formData.append("lecture", lectureFile);
  
    const res = await sendRequest<IBackendRes<any>>({
      method: "POST",
      url: `${process.env.NEXT_PUBLIC_SERVER}/courses/${courseId}/lecture`,
      queryParams: { sectionId, lectureId }, 
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
    access_token: string,
    videoFile: File
  ) => {
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
  