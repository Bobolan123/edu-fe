"use server";

import { getAccessToken, getUserId } from "./index";
import { sendRequest } from "../utils/api";
import { IReview, ReviewStatus } from "../../types/entities";
import { revalidateTag } from "next/cache";
import {
    IReviewDistribution,
} from "../../types/resData";

export const getReviewDistribution = async (
    courseId: number
): Promise<IReviewDistribution | undefined> => {
    const access_token = await getAccessToken();
    const res = await sendRequest<IBackendRes<IReviewDistribution>>({
        method: "GET",
        url: `${process.env.NEXT_PUBLIC_SERVER}/reviews/distribution`,
        headers: {
            Authorization: `Bearer ${access_token}`,
        },
        queryParams:{
            id: courseId,
        },
        nextOption: {
            next: {
                tags: [`review-distribution`],
            },
        },
    });

    if (res?.statusCode !== 200 || !res?.data) {
        return undefined;
    }

    return res.data;
};

interface GetReviewsParams {
    courseId?: number;
    page?: number;
    take?: number;
    search?: string;
    rating?: number;
    minRating?: number;
    maxRating?: number;
    status?: ReviewStatus;
    minUpVotes?: number;
    sortBy?: "newest" | "oldest" | "highest_rating" | "lowest_rating";
}

export const getAllReviews = async (
    params: GetReviewsParams = {}
): Promise<IModelPaginate<IReview>> => {
    const access_token = await getAccessToken();

    const queryParams: any = {
        page: params.page || 1,
        take: params.take || 10,
    };

    if (params.search) queryParams.search = params.search;
    if (params.rating) {
        queryParams.rating = params.rating;
    }
    if (params.minRating) queryParams.minRating = params.minRating;
    if (params.maxRating) queryParams.maxRating = params.maxRating;
    if (params.status) queryParams.status = params.status;
    if (params.minUpVotes) queryParams.minUpVotes = params.minUpVotes;
    if (params.sortBy) queryParams.sortBy = params.sortBy;

    const res = await sendRequest<IModelPaginate<IReview>>({
        method: "GET",
        url: `${process.env.NEXT_PUBLIC_SERVER}/reviews/course/${params.courseId}`,
        queryParams,
        headers: {
            Authorization: `Bearer ${access_token}`,
        },
        nextOption: {
            next: { tags: [`reviews-course`] },
        },
    });

    if (res?.statusCode !== 200 || !res?.data) {
        throw new Error(res?.message || "Failed to get reviews");
    }

    return res;
};

interface GetUserReviewsParams extends GetReviewsParams {
    userId: number;
}

export const getUserReviews = async (
    params: GetUserReviewsParams
): Promise<IBackendRes<IModelPaginate<IReview>>> => {
    const access_token = await getAccessToken();

    const queryParams: any = {
        page: params.page || 1,
        take: params.take || 10,
    };

    if (params.search) queryParams.search = params.search;
    if (params.rating) {
        queryParams.rating = params.rating;
    }
    if (params.minRating) queryParams.minRating = params.minRating;
    if (params.maxRating) queryParams.maxRating = params.maxRating;
    if (params.status) queryParams.status = params.status;
    if (params.minUpVotes) queryParams.minUpVotes = params.minUpVotes;
    if (params.sortBy) queryParams.sortBy = params.sortBy;

    const res = await sendRequest<IBackendRes<IModelPaginate<IReview>>>({
        method: "GET",
        url: `${process.env.NEXT_PUBLIC_SERVER}/reviews/user/${params.userId}`,
        queryParams,
        headers: {
            Authorization: `Bearer ${access_token}`,
        },
        nextOption: {
            next: { tags: [`user-reviews-${params.userId}`] },
        },
    });

    if (res?.statusCode !== 200 || !res?.data) {
        throw new Error(res?.message || "Failed to get user reviews");
    }

    return res;
};

interface ICreateReview {
    courseId: number;
    rating: number;
    comment: string;
    status?: ReviewStatus;
}
export const createReview = async (
    reviewData: ICreateReview
): Promise<IBackendRes<IReview>> => {
    const userId = await getUserId();
    let data = {
        ...reviewData,
        userId: userId,
    }
    const access_token = await getAccessToken();
    const res = await sendRequest<IBackendRes<IReview>>({
        method: "POST",
        url: `${process.env.NEXT_PUBLIC_SERVER}/reviews`,
        headers: {
            Authorization: `Bearer ${access_token}`,
        },
        body: data,
    });

    if (res?.statusCode !== 201 || !res?.data) {
        throw new Error(res?.message || "Failed to submit review");
    }

    revalidateTag(`user-review`);
    revalidateTag(`review-distribution`);
    return res;
};

export const updateReview = async (
    id: number,
    reviewData: Partial<IReview>
): Promise<IBackendRes<IReview>> => {
    const access_token = await getAccessToken();
    const res = await sendRequest<IBackendRes<IReview>>({
        method: "PATCH",
        url: `${process.env.NEXT_PUBLIC_SERVER}/reviews/${id}`,
        headers: {
            Authorization: `Bearer ${access_token}`,
        },
        body: reviewData,
    });

    if (res?.statusCode !== 200 || !res?.data) {
        throw new Error(res?.message || "Failed to update review");
    }

    revalidateTag(`user-review`);
    revalidateTag(`review-distribution`);

    return res;
};

export const deleteReview = async (
    id: number,
    courseId: number
): Promise<IBackendRes<void>> => {
    const userId = await getUserId();
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
    revalidateTag(`user-review`);
    revalidateTag(`review-distribution`);   

    return res;
};

// New voting system with vote tracking
export const voteUp = async (
    reviewId: number
): Promise<IBackendRes<IReview>> => {
    const access_token = await getAccessToken();
    const res = await sendRequest<IBackendRes<IReview>>({
        method: "POST",
        url: `${process.env.NEXT_PUBLIC_SERVER}/reviews/${reviewId}/vote/up`,
        headers: {
            Authorization: `Bearer ${access_token}`,
        },
    });

    if (res?.statusCode !== 200 && res?.statusCode !== 201) {
        throw new Error(res?.message || "Failed to vote");
    }

    revalidateTag(`reviews-course`);
    revalidateTag(`user-review`);

    return res;
};

export const voteDown = async (
    reviewId: number
): Promise<IBackendRes<IReview>> => {
    const access_token = await getAccessToken();
    const res = await sendRequest<IBackendRes<IReview>>({
        method: "POST",
        url: `${process.env.NEXT_PUBLIC_SERVER}/reviews/${reviewId}/vote/down`,
        headers: {
            Authorization: `Bearer ${access_token}`,
        },
    });

    if (res?.statusCode !== 200 && res?.statusCode !== 201) {
        throw new Error(res?.message || "Failed to vote");
    }

    revalidateTag(`reviews-course`);
    revalidateTag(`user-review`);

    return res;
};

// Check current user's vote on a review
export interface IUserVote {
    id: number;
    voteType: "UP" | "DOWN";
    userId: number;
    reviewId: number;
}

export const getUserVote = async (
    reviewId: number
): Promise<IBackendRes<IUserVote | null>> => {
    const access_token = await getAccessToken();
    const res = await sendRequest<IBackendRes<IUserVote | null>>({
        method: "GET",
        url: `${process.env.NEXT_PUBLIC_SERVER}/reviews/${reviewId}/vote/user`,
        headers: {
            Authorization: `Bearer ${access_token}`,
        },
    });

    if (res?.statusCode !== 200) {
        throw new Error(res?.message || "Failed to get user vote");
    }

    return res;
};

// Admin-specific function to get all reviews across all courses
interface GetAllReviewsAdminParams {
    page?: number;
    take?: number;
    search?: string;
    rating?: number;
    minRating?: number;
    maxRating?: number;
    status?: ReviewStatus;
    minUpVotes?: number;
    sortBy?: "newest" | "oldest" | "highest_rating" | "lowest_rating";
}

export const getAllReviewsAdmin = async (
    params: GetAllReviewsAdminParams = {}
): Promise<IModelPaginate<IReview>> => {
    const access_token = await getAccessToken();

    const queryParams: any = {
        page: params.page || 1,
        take: params.take || 10,
    };

    if (params.search) queryParams.search = params.search;
    if (params.rating) queryParams.rating = params.rating;
    if (params.minRating) queryParams.minRating = params.minRating;
    if (params.maxRating) queryParams.maxRating = params.maxRating;
    if (params.status) queryParams.status = params.status;
    if (params.minUpVotes) queryParams.minUpVotes = params.minUpVotes;
    if (params.sortBy) queryParams.sortBy = params.sortBy;

    const res = await sendRequest<IModelPaginate<IReview>>({
        method: "GET",
        url: `${process.env.NEXT_PUBLIC_SERVER}/reviews`,
        queryParams,
        headers: {
            Authorization: `Bearer ${access_token}`,
        },
        nextOption: {
            next: { tags: [`admin-reviews`] },
        },
    });

    if (res?.statusCode !== 200 || !res?.data) {
        throw new Error(res?.message || "Failed to get reviews");
    }

    return res;
};

export const getUserReviewForCourse = async (
    userId: string,
    courseId: string
): Promise<IReview | undefined> => {
    const access_token = await getAccessToken();
    const res = await sendRequest<IBackendRes<IReview>>({
        method: "GET",
        url: `${process.env.NEXT_PUBLIC_SERVER}/reviews/user/${userId}/course/${courseId}`,
        headers: {
            Authorization: `Bearer ${access_token}`,
        },
        nextOption: {
            next: {
                tags: [`user-review`],
            },
        },
    });
    
    return res?.data;
};
