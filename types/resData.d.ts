import { ICategory, IReview } from "./entities";

export interface IReviewDistributionItem {
    stars: number; // Star rating (1–5)
    count: number; // Number of reviews with that star rating
    percentage: number; // Percentage of total reviews
}

export interface IReviewDistribution {
    average_rating: number; // Average rating of the course
    total_reviews: number; // Total number of reviews
    distribution: IReviewDistributionItem[]; // List of counts per rating level
}

export interface IStudentEnrollment {
    enrollmentId: number;
    student: {
        id: number;
        firstName?: string;
        lastName?: string;
        email: string;
        avatar?: string;
    };
    enrolledAt: string;
    completedLectures: number;
    totalLectures: number;
    progressPercentage: number;
}

export interface IStudentsResponse {
    result: IStudentEnrollment[];
    meta: {
        page: number;
        take: number;
        itemCount: number;
        pageCount: number;
    };
}

export interface IResFindAllCategories extends ICategory {
    courseCount:number;
}