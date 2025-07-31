import { getAccessToken } from "./index";
import { sendRequest } from "../../utils/api";
import { IReview } from "../../types/entities";
import { revalidateTag } from "next/cache";
import { IReviewDistribution, ICourseReviewsResponse } from "../../types/resData";


export const getReviewDistribution = async (courseId: number): Promise<IBackendRes<IReviewDistribution[]>> => {
    const access_token = await getAccessToken();
    const res = await sendRequest<IBackendRes<IReviewDistribution[]>>({
        method: "GET",
        url: `${process.env.NEXT_PUBLIC_SERVER}/reviews/distribution?id=${courseId}`,
        headers: {
            Authorization: `Bearer ${access_token}`,
        },
    });

    if (res?.statusCode !== 200 || !res?.data) {
        throw new Error(res?.message || "Failed to get review distribution");
    }

    return res;
};

interface GetReviewsParams {
    courseId?: number;
    page?: number;
    take?: number;
    search?: string;
    stars?: number[];
    minRating?: number;
    maxRating?: number;
    sortBy?: 'newest' | 'oldest' | 'highest_rating' | 'lowest_rating';
}

export const getAllReviews = async (params: GetReviewsParams = {}): Promise<IBackendRes<IModelPaginate<IReview>>> => {
    const access_token = await getAccessToken();
    
    const queryParams: any = {
        page: params.page || 1,
        take: params.take || 10,
    };

    if (params.search) queryParams.search = params.search;
    if (params.stars && params.stars.length > 0) queryParams.stars = params.stars.join(',');
    if (params.minRating) queryParams.minRating = params.minRating;
    if (params.maxRating) queryParams.maxRating = params.maxRating;
    if (params.sortBy) queryParams.sortBy = params.sortBy;

    const res = await sendRequest<IBackendRes<IModelPaginate<IReview>>>({
        method: "GET",
        url: `${process.env.NEXT_PUBLIC_SERVER}/reviews/course/${params.courseId}`,
        queryParams,
        headers: {
            Authorization: `Bearer ${access_token}`,
        },
        nextOption: {
            next: { tags: [`reviews-course-${params.courseId}`] }
        }
    });

    if (res?.statusCode !== 200 || !res?.data) {
        throw new Error(res?.message || "Failed to get reviews");
    }

    return res;
};

export const getReviewById = async (id: number): Promise<IBackendRes<IReview>> => {
    const access_token = await getAccessToken();
    const res = await sendRequest<IBackendRes<IReview>>({
        method: "GET",
        url: `${process.env.NEXT_PUBLIC_SERVER}/reviews/${id}`,
        headers: {
            Authorization: `Bearer ${access_token}`,
        },
    });

    if (res?.statusCode !== 200 || !res?.data) {
        throw new Error(res?.message || "Failed to get review");
    }

    return res;
};

interface GetCourseReviewsParams extends GetReviewsParams {
    courseId: number;
}

export const getCourseReviews = async (params: GetCourseReviewsParams): Promise<IBackendRes<ICourseReviewsResponse>> => {
    const access_token = await getAccessToken();
    
    const queryParams: any = {
        page: params.page || 1,
        take: params.take || 10,
    };

    if (params.search) queryParams.search = params.search;
    if (params.stars && params.stars.length > 0) queryParams.stars = params.stars.join(',');
    if (params.minRating) queryParams.minRating = params.minRating;
    if (params.maxRating) queryParams.maxRating = params.maxRating;
    if (params.sortBy) queryParams.sortBy = params.sortBy;

    const res = await sendRequest<IBackendRes<ICourseReviewsResponse>>({
        method: "GET",
        url: `${process.env.NEXT_PUBLIC_SERVER}/reviews/course/${params.courseId}`,
        queryParams,
        headers: {
            Authorization: `Bearer ${access_token}`,
        },
        nextOption: {
            next: { tags: [`course-reviews-${params.courseId}`] }
        }
    });
    console.log(res)

    if (res?.statusCode !== 200 || !res?.data) {
        throw new Error(res?.message || "Failed to get course reviews");
    }

    return res;
};

interface GetUserReviewsParams extends GetReviewsParams {
    userId: number;
}

export const getUserReviews = async (params: GetUserReviewsParams): Promise<IBackendRes<IModelPaginate<IReview>>> => {
    const access_token = await getAccessToken();
    
    const queryParams: any = {
        page: params.page || 1,
        take: params.take || 10,
    };

    if (params.search) queryParams.search = params.search;
    if (params.stars && params.stars.length > 0) queryParams.stars = params.stars.join(',');
    if (params.minRating) queryParams.minRating = params.minRating;
    if (params.maxRating) queryParams.maxRating = params.maxRating;
    if (params.sortBy) queryParams.sortBy = params.sortBy;

    const res = await sendRequest<IBackendRes<IModelPaginate<IReview>>>({
        method: "GET",
        url: `${process.env.NEXT_PUBLIC_SERVER}/reviews/user/${params.userId}`,
        queryParams,
        headers: {
            Authorization: `Bearer ${access_token}`,
        },
        nextOption: {
            next: { tags: [`user-reviews-${params.userId}`] }
        }
    });

    if (res?.statusCode !== 200 || !res?.data) {
        throw new Error(res?.message || "Failed to get user reviews");
    }

    return res;
};

export const addOrUpdateReview = async (reviewData: any): Promise<IBackendRes<IReview>> => {
    const access_token = await getAccessToken();
    const res = await sendRequest<IBackendRes<IReview>>({
        method: "POST",
        url: `${process.env.NEXT_PUBLIC_SERVER}/reviews/rate`,
        headers: {
            Authorization: `Bearer ${access_token}`,
        },
        body: reviewData,
    });

    if (res?.statusCode !== 201 || !res?.data) {
        throw new Error(res?.message || "Failed to submit review");
    }

    // Revalidate the course reviews cache
    revalidateTag(`course-reviews-${reviewData.courseId}`);

    return res;
};

export const updateReview = async (id: number, reviewData: Partial<IReview>): Promise<IBackendRes<IReview>> => {
    const access_token = await getAccessToken();
    const res = await sendRequest<IBackendRes<IReview>>({
        method: "PUT",
        url: `${process.env.NEXT_PUBLIC_SERVER}/reviews/${id}`,
        headers: {
            Authorization: `Bearer ${access_token}`,
        },
        body: reviewData,
    });

    if (res?.statusCode !== 200 || !res?.data) {
        throw new Error(res?.message || "Failed to update review");
    }

    // Revalidate the course reviews cache if courseId is available
    if ('course' in reviewData && reviewData.course?.id) {
        revalidateTag(`course-reviews-${reviewData.course.id}`);
    }

    return res;
};

export const deleteReview = async (id: number, courseId: number): Promise<IBackendRes<void>> => {
    const access_token = await getAccessToken();
    const res = await sendRequest<IBackendRes<void>>({
        method: "DELETE",
        url: `${process.env.NEXT_PUBLIC_SERVER}/reviews/${id}`,
        headers: {
            Authorization: `Bearer ${access_token}`,
        },
    });

    if (res?.statusCode !== 200) {
        throw new Error(res?.message || "Failed to delete review");
    }

    // Revalidate the course reviews cache
    revalidateTag(`course-reviews-${courseId}`);

    return res;
};
