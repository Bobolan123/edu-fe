import CourseDetail from "@/components/CourseDetail/CourseDetail";
import {
    ICategory,
    ICourse,
    ICourseContent,
    IEnrollment,
    ICourseLecture,
    IReview,
    ILectureProgress,
} from "../../../../../types/entities";
import { extractIds } from "../../../../utils/utils";
import CourseLesson from "@/components/My-learning/CourseLesson/CourseLesson";
import CourseLearningNavbar from "@/components/My-learning/CourseLesson/CourseLearningNavbar";
import { IReviewDistribution } from "../../../../../types/resData";
import { auth } from "@/auth";
import { getAllReviews, getUserReviewForCourse, getReviewDistribution } from "@/actions/reviewsAction";
import { getCourseContent, getLectureCaptions } from "@/actions/courseContentAction";
import { getEnrollmentProgress } from "@/actions/enrollmentAction";

export type EnrollmentProgress = {
    enrollment: IEnrollment;
    lectureProgress: ILectureProgress[];
    progressPercentage: number;
};

interface Params {
    params: { title: string };
    searchParams: { 
        id: string;
        rating?: string;
        sort?: string;
    };
}

export default async function CourseDetailPage({
    params,
    searchParams,
}: Params) {
    const { id } = await searchParams;
    const session = await auth();

    const resContent = await getCourseContent(Number(id));

    const resEnrollmentProgress = await getEnrollmentProgress(session?.user?.id!, id);

    const reviewDistribution = await getReviewDistribution(Number(id));
    const { rating, sort } = await searchParams;

    const resUserReviews = await getAllReviews({
        courseId: +id,
        rating: rating ? Number(rating) : undefined,
        sortBy: sort ? (sort.toUpperCase() as 'NEWEST' | 'OLDEST' | 'HIGHEST_RATING' | 'LOWEST_RATING') : undefined
    });

    const resUserReview = await getUserReviewForCourse(session?.user?.id!, id);

    // Fetch captions for the first lecture server-side
    const firstLecture = resContent?.sections?.[0]?.lectures?.[0];
    const initialCaptionUrl = firstLecture?.id
        ? await getLectureCaptions(firstLecture.id, 'srt')
        : null;

    return (
        <div className="min-h-screen">
            <CourseLearningNavbar
                course={
                    resEnrollmentProgress?.enrollment?.course as ICourse
                }
                courseContent={resContent as ICourseContent}
                enrollmentProgress={
                    resEnrollmentProgress as EnrollmentProgress
                }
            />
            <CourseLesson
                courseContent={resContent as ICourseContent}
                course={
                    resEnrollmentProgress?.enrollment?.course as ICourse
                }
                enrollmentProgress={
                    resEnrollmentProgress as EnrollmentProgress
                }
                reviewDistribution={reviewDistribution}
                resUserReviews={resUserReviews}
                userReview={resUserReview}
                initialCaptionUrl={initialCaptionUrl}
            />
        </div>
    );
}
