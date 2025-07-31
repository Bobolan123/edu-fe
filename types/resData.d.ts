import { IReview } from "./entities";

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

export interface ICourseReviewsResponse {
    distribution: IReviewDistribution;
    reviews: IModelPaginate<IReview>;
}

